import { Currency, CurrencyAmount, ETHER, Token } from "@pancakeswap/sdk";
import { getBNBBalances } from "./getBNBBalance";
import { getTokenBalances } from "./getTokenBalances";

export async function getCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): Promise<(CurrencyAmount | undefined)[]> {
  const tokens =
    currencies?.filter(
      (currency): currency is Token => currency instanceof Token
    ) ?? [];

  const tokenBalances = await getTokenBalances(account, tokens);
  const containsBNB: boolean =
    currencies?.some((currency) => currency === ETHER) ?? false;
  const ethBalance = await getBNBBalances(containsBNB ? [account] : []);

  return currencies?.map((currency) => {
    if (!account || !currency) return undefined;
    if (currency instanceof Token) return tokenBalances[currency.address];
    if (currency === ETHER) return ethBalance[account];
    return undefined;
  }) ?? [];
}
