import { ChainId } from "@pancakeswap/sdk";
import Commander from "commander";
import { setChainId } from "context";
import { trade } from "trade-module";

const program = new Commander.Command();

program.version("0.0.1");

function pancakeswap() {
  return program
    .command('pancakeswap')
    .option("-e, --environment <string>", "Runtime environment", "mainnet")
    .hook('preAction', (thisCommand) => {
      const { environment } = thisCommand.opts();
      switch (environment) {
        case "mainnet":
          setChainId(ChainId.MAINNET);
          break;
        case "testnet":
          setChainId(ChainId.TESTNET);
          break;
      }
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
    console.log(
      `💸 ${inputAmount} ${inputTokenSymbol} 👉 ${totalReceive} ${outputTokenSymbol}?`
    );
  });

program.parse(process.argv);
