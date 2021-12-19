import { JsonRpcProvider } from "@ethersproject/providers";
import { getChainId } from "context";
import getRpcUrl from "utils/getRpcUrl";

export function initRpcProvider() {
  const RPC_URL = getRpcUrl(getChainId());
  return new JsonRpcProvider(RPC_URL);
}
