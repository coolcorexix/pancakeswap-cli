import ReadLine from "readline";
import fs from "fs";
import path from "path";
import { ChainId } from "@pancakeswap/sdk";
import Commander from "commander";
import { initProvider, initWallet, setChainId } from "context";
import { trade } from "trade-module";

const program = new Commander.Command();
const readLine = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query: string) =>
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
    const { totalReceive } = await trade({
      inputTokenSymbol,
      inputAmount,
      outputTokenSymbol,
    });
    const acceptToProceed = await prompt(
      `💸 ${inputAmount} ${inputTokenSymbol} 👉 ${totalReceive} ${outputTokenSymbol}? (y/N) \n`
    );
    console.log(
      "🚀 ~ file: index.ts ~ line 50 ~ .action ~ acceptToProceed",
      acceptToProceed
    );
    process.exit(0);
  });

program.parse(process.argv);
