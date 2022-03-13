import axios from "axios";
import { BscScanApiTransaction } from "types";
import { Log } from "@ethersproject/abstract-provider";
import { CoinGeckoClient } from "coingecko-api-v3";
import { decodeTransactionInputData } from "utils/decodeInputData";
import { provider } from "context";
import { ERC20_INTERFACE } from "contract/interface/erc20";

const cakeSyrupPoolAbi = require("abi/CakeSyrupPool.json");

const bscScanUrl = "https://api.bscscan.com/api";
const cakeTokenCotractAddress = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
const stakingPoolContractAddress = "0x1B2A2f6ed4A1401E8C73B4c2B6172455ce2f78E8";

async function getCakePriceAtTheTime(unixEpochtimeStamp: number) {
  const client = new CoinGeckoClient();
  const timeGap = 60 * 60;
  const response = await client.contractMarketChartRange({
    id: "binance-smart-chain" as any,
    contract_address: cakeTokenCotractAddress,
    vs_currency: "usd",
    from: unixEpochtimeStamp - timeGap,
    to: unixEpochtimeStamp,
  });
  return response.prices[0][1];
}
const DECIMALS = 18;

function getAmountFromMethod(decodedInputData: DecodedMethodInfo) {
  switch (decodedInputData.name) {
    case "deposit":
    case "withdraw":
      return Number(decodedInputData.params[0].value) / Math.pow(10, DECIMALS);
    default:
      return 0;
  }
}

interface OutputResponse {
  createdTime: Date;
  method: 'deposit' | 'withdraw' | 'withdrawAll' | string,
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

function getAmountOfWithdrawAllFromLogs(logs: Log[]) {
  const transferLog = logs.find((log) => log.topics[0] === transferTopic);
  return parseInt(transferLog?.data, 16) / Math.pow(10, DECIMALS);
}

export async function getTransactionsFromAccount(
  address: string
): Promise<BscScanApiTransaction[]> {
  console.log(
    "🚀 ~ file: bscscan.ts ~ line 6 ~ getTransactionsFromAccount ~ address",
    address
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
      stakingPoolContractAddress.toLocaleLowerCase()
    );
  });
  const interestedMethodNames = ["deposit", "withdraw"];

  const outputResponses: Promise<OutputResponse>[] =
    poolInteractingContractTransactions.map(async (t) => {
      const decodedInputData: DecodedMethodInfo = decodeTransactionInputData(
        t.input,
        cakeSyrupPoolAbi
      );
      if (!interestedMethodNames.includes(decodedInputData.name)) {
        console.log("withdraw all method: ", t.hash);

        const transactionReceipt = await provider.getTransactionReceipt(t.hash);
        const priceAtTheTime = await getCakePriceAtTheTime(Number(t.timeStamp));
        const currentPrice = await getCakePriceAtTheTime(Date.now() / 1000);
        const amountOfToken = getAmountOfWithdrawAllFromLogs(
          transactionReceipt.logs
        );
        const outputResponse = {
          method: decodedInputData.name,
          createdTime: new Date(Number(t.timeStamp) * 1000),
          priceAtTheTime,
          amountOfToken,
          toUSDValue: priceAtTheTime * amountOfToken,
          efficientComparedToCurrentRate: currentPrice / priceAtTheTime,
        };
        console.log(
          "🚀 ~ file: bscscan.ts ~ line 122 ~ poolInteractingContractTransactions.map ~ outputResponse",
          outputResponse
        );
        return;
      }
      const amountOfToken = getAmountFromMethod(decodedInputData);
      const priceAtTheTime = await getCakePriceAtTheTime(Number(t.timeStamp));
      const currentPrice = await getCakePriceAtTheTime(Date.now() / 1000);
      const outputResponse = {
        method: decodedInputData.name,
        createdTime: new Date(Number(t.timeStamp) * 1000),
        priceAtTheTime,
        amountOfToken,
        toUSDValue: priceAtTheTime * amountOfToken,
        efficientComparedToCurrentRate: currentPrice / priceAtTheTime,
      };
      console.log(
        "🚀 ~ file: bscscan.ts ~ line 111 ~ poolInteractingContractTransactions.map ~ outputResponse",
        outputResponse
      );
      return outputResponse;
    });

  return response.data.result;
}
