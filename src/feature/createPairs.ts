import { Interface } from "@ethersproject/abi";
import { abi as IUniswapV2PairABI } from "@uniswap/v2-core/build/IUniswapV2Pair.json";
import { Currency, Pair } from "@pancakeswap/sdk";
import { wrappedCurrency } from "utils/wrappedCurrency";
import { chainId } from "context";
import { callMultipleContractForSingleData } from "./callMultipleContractForSingleData";

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);

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
    wrappedCurrency(currencyA, chainId),
    wrappedCurrency(currencyB, chainId),
  ]);
  console.log('------');
  // dup token pairs [A, B] and [B, A] cause dup pair
  const pairAddresses = tokens.map(([tokenA, tokenB]) => {
    console.log(`${tokenA.name}-${tokenB.name}`);
    console.log(Pair.getAddress(tokenA, tokenB))
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
    const { result: reserves, loading } = result
    const tokenA = tokens[i][0]
    const tokenB = tokens[i][1]

    if (loading) return [PairState.LOADING, null]
    if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
    if (!reserves) return [PairState.NOT_EXISTS, null]
    const { reserve0, reserve1 } = reserves
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
    return [
      PairState.EXISTS,
      new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString())),
    ]
  })



//   return useMemo(() => {
//     return results.map((result, i) => {
//       const { result: reserves, loading } = result;
//       const tokenA = tokens[i][0];
//       const tokenB = tokens[i][1];

//       if (loading) return [PairState.LOADING, null];
//       if (!tokenA || !tokenB || tokenA.equals(tokenB))
//         return [PairState.INVALID, null];
//       if (!reserves) return [PairState.NOT_EXISTS, null];
//       const { reserve0, reserve1 } = reserves;
//       const [token0, token1] = tokenA.sortsBefore(tokenB)
//         ? [tokenA, tokenB]
//         : [tokenB, tokenA];
//       return [
//         PairState.EXISTS,
//         new Pair(
//           new TokenAmount(token0, reserve0.toString()),
//           new TokenAmount(token1, reserve1.toString())
//         ),
//       ];
//     });
//   }, [results, tokens]);
}
