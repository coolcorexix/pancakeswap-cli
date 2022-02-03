import ReadLine from "readline";
import fs from "fs";
import path from "path";
import { ChainId, Token } from "@pancakeswap/sdk";
import Commander from "commander";
import {
  getChainId,
  getRouterAddress,
  initProvider,
  initWallet,
  setChainId,
  wallet,
} from "context";
import { trade } from "trade-module";
import { approveIfNeeded } from "feature/approve";
import { swap } from "feature/swap";
import { getTokenBalances } from "feature/get-token-balances/getTokenBalances";
import { getTokenDict } from "feature/trade/getTokenDict";
import { wrapCommand } from "wrap-module";
import { SwapCallbackState } from "feature/swap/types";
import { getCurrencyBalance } from "feature/get-token-balances/getCurrencyBalance";

const readLine = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt: (query: string) => Promise<string> = (query: string) =>
  new Promise((resolve) => readLine.question(query, resolve));

const program = new Commander.Command();
program.version("0.0.1");

// TODO: decompose command logics to smaller modules

function pancakeswap() {
  return program
    .command("pancakeswap")
    .option("-m, --mnemonic-path <string>", "Mnemonic")
    .option("-e, --environment <string>", "Runtime environment", "mainnet")
    .hook("preAction", (thisCommand) => {
      const { environment } = thisCommand.opts();
      switch (environment) {
        case "mainnet":
          setChainId(ChainId.MAINNET);
          break;
        case "testnet":
          setChainId(ChainId.TESTNET);
          break;
      }
      initProvider();
    })
    .hook("preAction", async (thisCommand) => {
      const { mnemonicPath } = thisCommand.opts();
      if (!mnemonicPath) {
        return;
      }
      const resolvedPath = path.resolve(process.cwd(), mnemonicPath);
      const mnemonic = fs.readFileSync(resolvedPath, "utf8");
      await initWallet(mnemonic);
    });
}

const pancakeSwapCommands = pancakeswap();

pancakeSwapCommands
  .command("trade")
  .option("-i, --input <string>", "Input token symbol")
  .option("-a, --input-amount <number>", "Amount to trade")
  .option("-o --output <string>", "Output token symbol")
  .action(async (directory, cmd) => {
    const {
      input: inputTokenSymbol,
      inputAmount,
      output: outputTokenSymbol,
    } = cmd.opts();
    const { totalReceive, inputToken, bestTradeSoFar } = await trade({
      inputTokenSymbol,
      inputAmount,
      outputTokenSymbol,
    });
    const acceptToProceed = await prompt(
      `💸 ${inputAmount} ${inputTokenSymbol} 👉 ${totalReceive} ${outputTokenSymbol}? (y/N) \n`
    );
    if (acceptToProceed.toLowerCase() !== "y") {
      process.exit(0);
    }
    const spender = getRouterAddress();
    await approveIfNeeded({
      bestTradeSoFar,
      inputToken,
      spender,
    });
    const swapBundle = await swap(bestTradeSoFar);
    switch (swapBundle.state) {
      case SwapCallbackState.VALID: {
        const txReceipt = await swapBundle.callback();
        const newInputBalance = (
          await getCurrencyBalance(
            wallet.address,
            bestTradeSoFar.inputAmount.currency
          )
        ).toFixed();
        const newOutputBalance = (
          await getCurrencyBalance(
            wallet.address,
            bestTradeSoFar.outputAmount.currency
          )
        ).toFixed()
        console.log(`🙌 You now have ${newInputBalance} ${inputTokenSymbol} and ${newOutputBalance} ${outputTokenSymbol}`);
        console.log(`🧾 Tx receipt: ${txReceipt}`);
        break;
      }
      case SwapCallbackState.INVALID: {
        console.log(swapBundle.error);
      }
    }

    process.exit(0);
  });

pancakeSwapCommands
  .command("get-token-balance")
  .option("-s, --symbol <string>", "Input token symbol")
  .option("-a, --address <string>", "Input token address")
  .action(async (directory, cmd) => {
    let { symbol: inputTokenSymbol, address: inputTokenAddress } = cmd.opts();
    let balance;
    if (inputTokenAddress) {
      balance = await getTokenBalances(wallet.address, [
        new Token(getChainId(), inputTokenAddress, 18),
      ]);
    }
    if (inputTokenSymbol) {
      const queriedToken = getTokenDict()[inputTokenSymbol];
      balance = await getTokenBalances(wallet.address, [queriedToken]);
      inputTokenAddress = queriedToken.address;
    }
    if (!balance) {
      console.log("💩 bad token info, try again");
    }
    console.log(
      `🏦 current balance of ${
        inputTokenSymbol || inputTokenAddress
      }: ${balance[inputTokenAddress].toFixed()} `
    );

    process.exit(0);
  });

pancakeSwapCommands
  .command("wrap")
  .option("-u, --unwrap", "Unwrap WBNB to BNB")
  .option("-a, --amount <string>", "Amount to wrap / unwrap")
  .action(async (directory, cmd) => {
    const { unwrap, amount } = cmd.opts();
    await wrapCommand({
      depositValue: amount,
    });
    process.exit(0);
  });

program.parse(process.argv);
