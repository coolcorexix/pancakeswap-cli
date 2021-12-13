import {
  ChainId,
  Currency,
  CurrencyAmount,
  ETHER,
  Token,
  TokenAmount,
  WETH,
} from "@pancakeswap/sdk";

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
