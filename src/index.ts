import { program } from "commander";
import { trade } from "trade-module";

program.version("0.0.1");

program
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
      `💸💸💸 Trade ${inputAmount} ${inputTokenSymbol} for ${totalReceive} ${outputTokenSymbol}?`
    );
  });

program.parse(process.argv);
