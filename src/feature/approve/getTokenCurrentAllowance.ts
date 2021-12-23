import { Token, TokenAmount } from "@pancakeswap/sdk";
import { provider } from "context";
import { getSingleCallResult } from "contract/getSingleCallResult";
import { getTokenContract } from "contract/getTokenContract";

// * owner is the owner of the fund, not the owner of the token
// * spender is the approved to use address of the token, in this case the router address
export async function getTokenCurrentAllowance(
  token: Token,
  owner: string,
  spender: string
): Promise<TokenAmount | undefined> {
  const tokenContract = getTokenContract(token.address, provider, owner);
  const inputs = [owner, spender];
  const allowance = (await getSingleCallResult(
    tokenContract,
    "allowance",
    inputs
  )).result;
  return token && allowance
    ? new TokenAmount(token, allowance.toString())
    : undefined;
}
