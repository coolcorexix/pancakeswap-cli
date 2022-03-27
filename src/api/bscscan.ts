import axios from "axios";
import { getAddress } from "@ethersproject/address";
import { BscScanApiTransaction } from "types";
import { Log } from "@ethersproject/abstract-provider";
import { CoinGeckoClient } from "coingecko-api-v3";
import { decodeTransactionInputData } from "utils/decodeInputData";
import { provider } from "context";
import { ERC20_INTERFACE } from "contract/interface/erc20";
import { getContract } from "contract/getContract";

interface StakeContractInfo {
  name: string;
  address: string;
  abi: string;
  stakingMethods: string[];
}

const DEPOSIT_METHOD = "deposit";
const WITHDRAW_METHOD = "withdraw";
const WITHDRAW_ALL_METHOD = "withdrawAll";
const ENTER_STAKING_METHOD = "enterStaking";
const LEAVE_STAKING_METHOD = "leaveStaking";
const HARVEST_METHOD = "harvest";

const bscScanUrl = "https://api.bscscan.com/api";
const cakeTokenContractAddress = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
//** This token is used to trade for real cake, represent pool share */
const syrupBarTokenContractAddress =
  "0x009cF7bC57584b7998236eff51b98A168DceA9B0";

const ifoCakePool: StakeContractInfo = {
  name: "ifoCakePool",
  address: "0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8",
  abi: require("abi/CakeSyrupPool.json"),
  stakingMethods: [DEPOSIT_METHOD, WITHDRAW_METHOD, WITHDRAW_ALL_METHOD],
};

const autoCakePool: StakeContractInfo = {
  name: "autoCakePool",
  address: "0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC",
  abi: require("abi/CakeSyrupPool.json"),
  stakingMethods: [
    DEPOSIT_METHOD,
    WITHDRAW_METHOD,
    WITHDRAW_ALL_METHOD,
    HARVEST_METHOD,
  ],
};

const inflowMethods = [DEPOSIT_METHOD, ENTER_STAKING_METHOD];
const outflowMethods = [
  WITHDRAW_METHOD,
  WITHDRAW_ALL_METHOD,
  LEAVE_STAKING_METHOD,
  HARVEST_METHOD,
];

const manualCakePool: StakeContractInfo = {
  name: "manualCakePool",
  address: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
  abi: require("abi/ManualCakeSyrupPool.json"),
  stakingMethods: [ENTER_STAKING_METHOD, LEAVE_STAKING_METHOD],
};

const currentPool = autoCakePool;

async function getCurrentCakeStakedInCurrentPool(inspectingAddress: string) {
  if (currentPool.name === "autoCakePool") {
    const autoCakePoolContract = getContract(
      autoCakePool.address,
      require("abi/AutoCakePool.json"),
      provider
    );
    const pricePerFullShare = await autoCakePoolContract.getPricePerFullShare();
    const userShares = await autoCakePoolContract.userInfo(inspectingAddress);
    return (userShares.shares * pricePerFullShare) / Math.pow(10, DECIMALS * 2);
  }

  return undefined;
}

async function getCakePriceAtTheTime(unixEpochtimeStamp: number) {
  try {
    const client = new CoinGeckoClient();
    // 1 hours, probing until we get a valid price up to 5 hours
    const timeGap = 60 * 60;
    for (let i = 0; i < 5; i++) {
      const response = await client.contractMarketChartRange({
        id: "binance-smart-chain" as any,
        contract_address: cakeTokenContractAddress,
        vs_currency: "usd",
        from: unixEpochtimeStamp - timeGap * (i + 1),
        to: unixEpochtimeStamp,
      });
      if (!response.prices.length) {
        continue;
      }
      return response.prices[0][1];
    }
  } catch {
    console.log("timestamp with error: ", unixEpochtimeStamp);
  }
}
const DECIMALS = 18;

//TODO this might not longer be used
function getAmountFromMethod(decodedInputData: DecodedMethodInfo) {
  switch (decodedInputData.name) {
    case DEPOSIT_METHOD:
    case WITHDRAW_METHOD:
      return Number(decodedInputData.params[0].value) / Math.pow(10, DECIMALS);
    default:
      return 0;
  }
}

interface OutputResponse {
  createdTime: Date;
  txHash: string;
  method: string;
  priceAtTheTime: number;
  amountOfToken: number;
  toUSDValue: number;
  efficientComparedToCurrentRate: number;
}

interface DecodedMethodInfo {
  name: string;
  params: {
    name: string;
    value: string;
    type: string;
  }[];
}

const transferTopic = ERC20_INTERFACE.getEventTopic("Transfer");
console.log("🚀 ~ file: bscscan.ts ~ line 68 ~ transferTopic", transferTopic);

function getAmountOfTokenTransferFromLogs(
  logs: Log[],
  methodName: string,
  inspectingAddress: string
) {
  const transferToAccountLogs = logs.filter((log) => {
    if (inflowMethods.includes(methodName)) {
      return (
        log.topics[0] === transferTopic &&
        log.topics[1].replace("000000000000000000000000", "") ===
          inspectingAddress
      );
    }
    if (outflowMethods.includes(methodName)) {
      return (
        log.topics[0] === transferTopic &&
        log.topics[2].replace("000000000000000000000000", "") ===
          inspectingAddress
      );
    }
  });
  return transferToAccountLogs.reduce((acc, transferLog) => {
    return acc + parseInt(transferLog?.data, 16) / Math.pow(10, DECIMALS);
  }, 0);
}

function calculateTotalCost(outputResponses: OutputResponse[]): {
  usdCost: number;
  cakeCost: number;
} {
  return outputResponses
    .filter((response) => inflowMethods.includes(response.method))
    .reduce(
      (acc, curr) => ({
        usdCost: acc.usdCost + curr.toUSDValue,
        cakeCost: acc.cakeCost + curr.amountOfToken,
      }),
      {
        usdCost: 0,
        cakeCost: 0,
      }
    );
}

function calculateTotalProceed(outputResponses: OutputResponse[]): {
  usdCost: number;
  cakeCost: number;
} {
  return outputResponses
    .filter((response) => outflowMethods.includes(response.method))
    .reduce(
      (acc, curr) => ({
        usdCost: acc.usdCost + curr.toUSDValue,
        cakeCost: acc.cakeCost + curr.amountOfToken,
      }),
      {
        usdCost: 0,
        cakeCost: 0,
      }
    );
}

export async function getTransactionsFromAccount(
  rawAddress: string
): Promise<BscScanApiTransaction[]> {
  const address = rawAddress.toLowerCase();

  console.log(
    "🚀 ~ file: bscscan.ts ~ line 6 ~ getTransactionsFromAccount ~ address",
    address
  );

  const beingStakedCakes = await getCurrentCakeStakedInCurrentPool(address);
  console.log(
    "🚀 ~ file: bscscan.ts ~ line 206 ~ beingStakedCakes",
    beingStakedCakes
  );

  const response = await axios.get(bscScanUrl, {
    params: {
      module: "account",
      action: "txlist",
      address,
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "1000",
      sort: "asc",
      apikey: process.env.BSCSCAN_API_KEY,
    },
  });
  if (!response.status || !Number(response.data.status)) {
    throw new Error(response.data.message);
  }
  const poolInteractingContractTransactions = (
    response.data.result as BscScanApiTransaction[]
  ).filter((transaction) => {
    return (
      transaction.to.toLocaleLowerCase() ===
        currentPool.address.toLocaleLowerCase() && !Number(transaction.isError)
    );
  });
  const interestedMethodNames = currentPool.stakingMethods;
  const currentPrice = await getCakePriceAtTheTime(Date.now() / 1000);

  const outputResponses: OutputResponse[] = (
    await Promise.all(
      poolInteractingContractTransactions.map(async (t) => {
        const decodedInputData: DecodedMethodInfo = decodeTransactionInputData(
          t.input,
          currentPool.abi
        );
        if (!interestedMethodNames.includes(decodedInputData.name)) {
          console.log(
            "🚀 ~ file: bscscan.ts ~ line 169 ~ poolInteractingContractTransactions.map ~ decodedInputData",
            decodedInputData
          );
          return;
        }

        const transactionReceipt = await provider.getTransactionReceipt(t.hash);
        const priceAtTheTime = await getCakePriceAtTheTime(Number(t.timeStamp));
        const amountOfToken = getAmountOfTokenTransferFromLogs(
          transactionReceipt.logs,
          decodedInputData.name,
          address
        );
        // console.log(`tx: ${t.hash} ${decodedInputData.name} ${amountOfToken}`);
        const outputResponse = {
          method: decodedInputData.name,
          txHash: t.hash,
          createdTime: new Date(Number(t.timeStamp) * 1000),
          priceAtTheTime,
          amountOfToken,
          toUSDValue: priceAtTheTime * amountOfToken,
          efficientComparedToCurrentRate: currentPrice / priceAtTheTime,
        };
        return outputResponse;
      })
    )
  ).filter((response) => !!response);
  console.table(outputResponses, Object.keys(outputResponses[0]));
  const totalCost = calculateTotalCost(outputResponses);
  const totalProceed = calculateTotalProceed(outputResponses);
  console.log(
    `${currentPool.name} USD gain / loss: `,
    beingStakedCakes * currentPrice + totalProceed.usdCost - totalCost.usdCost
  );
  console.log(
    `${currentPool.name} deposited CAKE: `,
    totalCost.cakeCost - totalProceed.cakeCost
  );
  console.log(
    `earned cakes from staking: ${
      beingStakedCakes + totalProceed.cakeCost - totalCost.cakeCost
    }`
  );
  console.log(
    `DCA cake price (including rewards): ${
      (totalCost.usdCost - totalProceed.usdCost) / beingStakedCakes
    }`
  );

  return response.data.result;
}
