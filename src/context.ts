import { ChainId } from "@pancakeswap/sdk";
import { simpleRpcProvider } from "utils/providers";

export const chainId = ChainId.MAINNET;

export const provider = simpleRpcProvider;

export async function getCurrentBlockNumber() {
  const currentBlock = await simpleRpcProvider.getBlockNumber();
  return currentBlock;
}
