import { Token } from "@pancakeswap/sdk";
import { testnetTokens } from "constants/testnetToken";
import { initProvider } from "context";
import { getTokenDict } from "feature/trade/getTokenDict";
import { tryParseAmount } from "feature/tryParseAmount";
import { tradeExactIn } from "./feature/trade";

export async function trade(args: {
  inputTokenSymbol: string;
  inputAmount: number;
  outputTokenSymbol: string;
}): Promise<{
  totalReceive: number;
}> {
  initProvider();
  
  const inputToken = getTokenDict()[args.inputTokenSymbol];
  const outputToken = getTokenDict()[args.outputTokenSymbol];

  const bestTradeSoFar = await tradeExactIn(
    tryParseAmount(args.inputAmount.toString(), inputToken),
    outputToken
  );

  return {
    totalReceive: Number(bestTradeSoFar.executionPrice.toFixed()) * args.inputAmount,
  };
}
