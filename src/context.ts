import { ChainId } from "@pancakeswap/sdk";
import { initRpcProvider } from "utils/providers";

let chainId = null;

export function setChainId(chainIdValue: ChainId) {
  chainId = chainIdValue;
}

export function getChainId() {
  if (!chainId) {
    throw new Error("chainId is not set");
  }
  return chainId;
}

export let provider = null;
export const initProvider = () => {
  provider = initRpcProvider();
};

export async function getCurrentBlockNumber() {
  const currentBlock = await provider.getBlockNumber();
  return currentBlock;
}
