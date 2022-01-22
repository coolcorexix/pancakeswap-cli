import { Token, Trade } from "@pancakeswap/sdk";
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
  bestTradeSoFar: Trade;
  totalReceive: number;
  inputToken: Token;
}> {
  const inputToken = getTokenDict()[args.inputTokenSymbol];
  const outputToken = getTokenDict()[args.outputTokenSymbol];

  const bestTradeSoFar = await tradeExactIn(
    tryParseAmount(args.inputAmount.toString(), inputToken),
    outputToken
  );
  if (!bestTradeSoFar) {
    throw new Error("No trade found 💩💩💩 ");
  }
  return {
    bestTradeSoFar,
    totalReceive:
      Number(bestTradeSoFar.executionPrice.toFixed()) * args.inputAmount,
    inputToken,
  };
}
