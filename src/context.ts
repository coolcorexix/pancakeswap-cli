import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ChainId } from "@pancakeswap/sdk";
import { initRpcProvider } from "utils/providers";
import { ROUTER_ADDRESS, TESTNET_ROUTER_ADDRESS } from "constants/BASE_TRADE_PAIRS";
import { GAS_PRICE_GWEI } from "constants/gasPrice";

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

export let wallet: Wallet = null;
export let provider: JsonRpcProvider = null;

export const initProvider = () => {
  provider = initRpcProvider();
};

export const gasPrice = GAS_PRICE_GWEI.testnet;

export const initWallet = async (mnemonic: string) => {
  const newWallet = Wallet.fromMnemonic(mnemonic);
  wallet = newWallet.connect(provider);
  const gasBalance = await wallet.getBalance(); 
  console.log(`💰 Current gas balance: ${Number(gasBalance.toString())/1e18}`);
};

export async function getCurrentBlockNumber() {
  const currentBlock = await provider.getBlockNumber();
  return currentBlock;
}

export const getRouterAddress = () => {
  if (chainId === ChainId.TESTNET) {
    return TESTNET_ROUTER_ADDRESS;
  }
  if (chainId === ChainId.MAINNET) {
    return ROUTER_ADDRESS;
  }
  throw new Error('chainId is not set');
}
