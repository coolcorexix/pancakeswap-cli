import {
  ChainId,
  Currency,
  Token,
} from "@pancakeswap/sdk";
import { ETHER, WETH } from "constants/index";

export function wrappedCurrency(
  currency: Currency | undefined,
  chainId: ChainId | undefined
): Token {
  if (!(currency instanceof Token)) {
    throw new Error("has to be a token please");
  }
  return chainId && currency === ETHER
    ? WETH[chainId]
    : currency;
}
