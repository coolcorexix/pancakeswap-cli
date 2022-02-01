import { JSBI, Token, TokenAmount } from "@pancakeswap/sdk";
import { ERC20_INTERFACE } from "contract/interface/erc20";
import { isAddress } from "contract/isAddress";
import { callMultipleContractForSingleData } from "feature/callMultipleContractForSingleData";

export async function getTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): Promise<{ [tokenAddress: string]: TokenAmount | undefined }> {
  const validatedTokens: Token[] =
    tokens?.filter(
      (t?: Token): t is Token => isAddress(t?.address) !== false
    ) ?? [];
  const validatedTokenAddresses = validatedTokens.map((vt) => vt.address);
  const balances = await callMultipleContractForSingleData(
    validatedTokenAddresses,
    ERC20_INTERFACE,
    "balanceOf",
    [address]
  );
  return address && validatedTokens.length > 0
    ? validatedTokens.reduce<{
        [tokenAddress: string]: TokenAmount | undefined;
      }>((memo, token, i) => {
        const value = balances?.[i]?.result?.[0];
        const amount = value ? JSBI.BigInt(value.toString()) : undefined;
        if (amount) {
          memo[token.address] = new TokenAmount(token, amount);
        }
        return memo;
      }, {})
    : {};
}
