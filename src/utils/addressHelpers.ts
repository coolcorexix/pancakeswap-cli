import { ChainId } from "@pancakeswap/sdk";
import addresses from "constants/contracts";
import { Address } from "constants/types";

export const getAddress = (address: Address): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID;
  return address[chainId] ? address[chainId] : address[ChainId.MAINNET];
};

export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall);
};
