import { MaxUint256 } from '@ethersproject/constants'
import { CurrencyAmount, ETHER, Token } from "@pancakeswap/sdk";
import { getRouterAddress, provider, wallet } from "context";
import { getTokenContract } from "contract/getTokenContract";
import { getTokenCurrentAllowance } from "./getTokenCurrentAllowance";

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

export async function approveIfNeeded(args: {
  inputToken: Token;
  amountToApprove: CurrencyAmount;
  spender: string;
}) {
  const { amountToApprove, spender } = args;
  const currentAllowance = await getTokenCurrentAllowance(
    args.inputToken,
    wallet.address,
    getRouterAddress()
  );
  console.log(
    "🚀 ~ file: index.ts ~ line 11 ~ approveIfNeeded ~ currentAllowance",
    currentAllowance
  );

  // check the current approval status
  const getApprovalState = () => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  };
  const tokenContract = getTokenContract(
    args.inputToken.address,
    provider,
    wallet.address
  );
  const approve = async () => {
    if (!args.inputToken) {
      console.error("no token");
      return;
    }

    if (!tokenContract) {
      console.error("tokenContract is null");
      return;
    }

    if (!amountToApprove) {
      console.error("missing amount to approve");
      return;
    }

    if (!spender) {
      console.error("no spender");
      return;
    }

    let useExact = false;

    const estimatedGas = await tokenContract.estimateGas
      .approve(spender, MaxUint256)
      .catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true;
        return tokenContract.estimateGas.approve(
          spender,
          amountToApprove.raw.toString()
        );
      });
  };
}
