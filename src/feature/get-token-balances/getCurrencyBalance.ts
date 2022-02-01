import { Currency, CurrencyAmount } from "@pancakeswap/sdk";
import { getCurrencyBalances } from "./getCurencyBalances";
import { getTokenBalances } from "./getTokenBalances";

export async function getCurrencyBalance(account?: string, currency?: Currency): Promise<CurrencyAmount | undefined> {
    return (await getCurrencyBalances(account, [currency]))[0];
}