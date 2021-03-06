import { Interface } from "@ethersproject/abi";
import { abi as IUniswapV2PairABI } from "@uniswap/v2-core/build/IUniswapV2Pair.json";
import { ChainId, Currency, Pair, TokenAmount } from "@pancakeswap/sdk";
import { wrappedCurrency } from "utils/wrappedCurrency";
import { getChainId } from "context";
import { getPairAddressTestnet } from "contract/getPairAddressTestnet";
import { callMultipleContractForSingleData } from "./callMultipleContractForSingleData";

const PAIR_INTERFACE = new Interface(JSON.stringify(IUniswapV2PairABI));

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export async function createPairs(
  currencies: [Currency, Currency][]
): Promise<[PairState, Pair | null][]> {
  const tokens = currencies.map(([currencyA, currencyB]) => [
    wrappedCurrency(currencyA, getChainId()),
    wrappedCurrency(currencyB, getChainId()),
  ]);
  // dup token pairs [A, B] and [B, A] cause dup pair
  const pairAddresses = tokens.map(([tokenA, tokenB]) => {
    if (getChainId() === ChainId.TESTNET) {
      return tokenA && tokenB && !tokenA.equals(tokenB)
      ? getPairAddressTestnet(tokenA, tokenB)
      : undefined;
    }
    return tokenA && tokenB && !tokenA.equals(tokenB)
      ? Pair.getAddress(tokenA, tokenB)
      : undefined;
  });

  const results = await callMultipleContractForSingleData(
    pairAddresses,
    PAIR_INTERFACE,
    "getReserves"
  );

  return results.map((result, i) => {
    const { result: reserves } = result;
    const tokenA = tokens[i][0];
    const tokenB = tokens[i][1];

    if (!tokenA || !tokenB || tokenA.equals(tokenB))
      return [PairState.INVALID, null];
    if (!reserves) return [PairState.NOT_EXISTS, null];
    const { reserve0, reserve1 } = reserves;
    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA];
    return [
      PairState.EXISTS,
      new Pair(
        new TokenAmount(token0, reserve0.toString()),
        new TokenAmount(token1, reserve1.toString())
      ),
    ];
  });
}
