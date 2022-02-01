import { CurrencyAmount, JSBI } from "@pancakeswap/sdk";
import { isAddress } from "contract/isAddress";
import { callSingleContractForMultipleData } from "feature/callSingleContractForMultipleData";
import { getMulticallContract } from "multicall/getMulticallContract";

/**
 * Returns a map of the given addresses to their eventually consistent BNB balances.
 */
export async function getBNBBalances(uncheckedAddresses?: (string | undefined)[]): Promise<{
  [address: string]: CurrencyAmount | undefined;
}> {
  const multicallContract = getMulticallContract();

  const addresses: string[] = uncheckedAddresses
    ? uncheckedAddresses
        .map(isAddress)
        .filter((a): a is string => a !== false)
        .sort()
    : [];

  const results = await callSingleContractForMultipleData(
    multicallContract,
    "getEthBalance",
    addresses.map((address) => [address])
  );

  return addresses.reduce<{ [address: string]: CurrencyAmount }>(
    (memo, address, i) => {
      const value = results?.[i]?.result?.[0];
      if (value)
        memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()));
      return memo;
    },
    {}
  );
}
