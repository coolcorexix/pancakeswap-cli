import { Currency, Token } from "@pancakeswap/sdk";
import { tryParseAmount } from "feature/tryParseAmount";
import { mainnetTokens } from "./constants/mainnetTokens";
import { chainId } from "./context";
import { tradeExactIn } from "./feature/trade";

const pols = new Token(
  chainId,
  "0x7e624fa0e1c4abfd309cc15719b7e2580887f570",
  18,
  "POLS",
  "polka-starter"
);

const dnxc = new Token(
  chainId,
  "0x3c1748d647e6a56b37b66fcd2b5626d0461d3aa0",
  18,
  "DNXC",
  "Dinox Currency"
);

const TokenDict: Record<string, Token> = {
  pols,
  dnxc,
  ...mainnetTokens,
};

export async function trade(args: {
  inputTokenSymbol: string;
  inputAmount: number;
  outputTokenSymbol: string;
}): Promise<{
  totalReceive: number;
}> {
  const inputToken = TokenDict[args.inputTokenSymbol];
  const outputToken = TokenDict[args.outputTokenSymbol];

  const bestTradeSoFar = await tradeExactIn(
    tryParseAmount(args.inputAmount.toString(), inputToken),
    outputToken
  );

  return {
    totalReceive: Number(bestTradeSoFar.executionPrice.toFixed()) * args.inputAmount,
  };
}
