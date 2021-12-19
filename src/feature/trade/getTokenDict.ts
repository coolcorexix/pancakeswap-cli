import { ChainId, Token } from "@pancakeswap/sdk";
import { mainnetTokens } from "constants/mainnetTokens";
import { testnetTokens } from "constants/testnetToken";
import { getChainId } from "context";

export const getTokenDict: () => Record<string, Token> = () => {
  if (getChainId() === ChainId.MAINNET) {
    return {...mainnetTokens};
  }
  if (getChainId() === ChainId.TESTNET) {
    return {...testnetTokens};
  }
  return null;
};
