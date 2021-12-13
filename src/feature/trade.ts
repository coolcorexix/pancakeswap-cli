import { Currency, Token } from "@pancakeswap/sdk";
import { createPairs } from "./createPairs";
import flatMap from 'lodash/flatMap';
import { BASES_TO_CHECK_TRADES_AGAINST } from "constants/BASE_TRADE_PAIRS";
import { chainId } from "context";
import { wrappedCurrency } from "utils/wrappedCurrency";

export function trade(currencyA: Currency, currencyB: Currency) {
    const [tokenA, tokenB] = [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)];
    const bases: Token[] = [...BASES_TO_CHECK_TRADES_AGAINST[chainId]];
    const basePairs: [Token, Token][] = flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase]));
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
      ].filter(([t0, t1]) => t0.address !== t1.address)
    createPairs(allPairCombinations);

}