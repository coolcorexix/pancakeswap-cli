import { BigNumber } from "@ethersproject/bignumber";
import { getSingleCallResult } from "contract/getSingleCallResult";
import { getMulticallContract } from "multicall/getMulticallContract";

// gets the current timestamp from the blockchain
export async function getCurrentBlockTimestamp(): Promise<BigNumber | undefined> {
  const multicall = getMulticallContract();
  return (await getSingleCallResult(multicall, "getCurrentBlockTimestamp"))
    ?.result?.[0];
}
