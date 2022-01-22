import ReadLine from "readline";
import fs from "fs";
import path from "path";
import { ChainId } from "@pancakeswap/sdk";
import Commander from "commander";
import { getRouterAddress, initProvider, initWallet, setChainId, wallet } from "context";
import { trade } from "trade-module";
import { approveIfNeeded } from "feature/approve";

const program = new Commander.Command();
const readLine = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt: (query: string) => Promise<string> = (query: string) =>
  new Promise((resolve) => readLine.question(query, resolve));

program.version("0.0.1");

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

pancakeswap()
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

    

    process.exit(0);
  });

program.parse(process.argv);
