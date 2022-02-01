import { ChainId } from "@pancakeswap/sdk";
import addresses from "constants/contracts";
import { Address } from "constants/types";
import { getChainId } from "context";

export const getAddress = (address: Address): string => {
  return address[getChainId()] ? address[getChainId()] : address[ChainId.MAINNET];
};

export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall);
};

export const getWethAddress = () => {
  return getAddress(addresses.weth);
}

export const getRouterAddress = () => {
  return getAddress(addresses.router);
};
