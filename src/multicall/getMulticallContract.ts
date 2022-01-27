import { getContract } from "contract/getContract";
import MulticallAbi from "abi/Multicall.json";

import { getMulticallAddress } from "utils/addressHelpers";
import { provider } from "context";

export function getMulticallContract() {
  return getContract(
    getMulticallAddress(),
    MulticallAbi,
    provider
  );
}
