import { Currency, CurrencyAmount, Pair, Token, Trade } from "@pancakeswap/sdk";
import { createPairs, PairState } from "./createPairs";
import flatMap from "lodash/flatMap";
import { BASES_TO_CHECK_TRADES_AGAINST } from "constants/BASE_TRADE_PAIRS";
import { getChainId } from "context";
import { wrappedCurrency } from "utils/wrappedCurrency";

export async function createAllCommonPairs(
  currencyA: Currency,
  currencyB: Currency
) {
  const [tokenA, tokenB] = [
    wrappedCurrency(currencyA, getChainId()),
    wrappedCurrency(currencyB, getChainId()),
  ];
  const bases: Token[] = [...BASES_TO_CHECK_TRADES_AGAINST[getChainId()]];
  const basePairs: [Token, Token][] = flatMap(bases, (base): [Token, Token][] =>
    bases.map((otherBase) => [base, otherBase])
  );
  const directPair: [Token, Token] = [tokenA, tokenB];
  const allPairCombinations: [Token, Token][] = [
    // the direct pair
    directPair,
    // token A against all bases
    ...bases.map((base): [Token, Token] => [tokenA, base]),
    // token B against all bases
    ...bases.map((base): [Token, Token] => [tokenB, base]),
    // each base against all bases
    ...basePairs,
  ].filter(([t0, t1]) => t0.address !== t1.address);
  const allPairs = await createPairs(allPairCombinations);

  return Object.values(
    allPairs
      // filter out invalid pairs
      .filter((result): result is [PairState.EXISTS, Pair] =>
        Boolean(result[0] === PairState.EXISTS && result[1])
      )
      // filter out duplicated pairs
      .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
        memo[curr.liquidityToken.address] =
          memo[curr.liquidityToken.address] ?? curr;
        return memo;
      }, {})
  );
}

export async function tradeExactIn(
  currencyAmountIn?: CurrencyAmount,
  currencyOut?: Currency
): Promise<Trade | null> {
  const allowedPairs = await createAllCommonPairs(
    currencyAmountIn?.currency,
    currencyOut
  );
  return Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
    maxHops: 3,
    maxNumResults: 1,
  })[0] ?? null;
}
