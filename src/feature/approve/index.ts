import { MaxUint256 } from "@ethersproject/constants";
import { ETHER, Token, Trade } from "@pancakeswap/sdk";
import { getRouterAddress, provider, wallet } from "context";
import { calculateGasMargin } from "utils/calculateGasMargin";
import { callWithGasPrice } from "contract/callWithGasPrice";
import { getTokenContract } from "contract/getTokenContract";
import { computeSlippageAdjustedAmounts } from "./computeSlippageAdjustedAmount";
import { getTokenCurrentAllowance } from "./getTokenCurrentAllowance";

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// TODO: this is only a approve for trade, have a better name for it when come back
export async function approveIfNeeded(args: {
  inputToken: Token;
  spender: string;
  bestTradeSoFar: Trade;
}) {
  const { spender } = args;
  const allowedSlippage = 5;
  const amountToApprove = computeSlippageAdjustedAmounts(
    args.bestTradeSoFar,
    allowedSlippage
  ).INPUT;
  const currentAllowance = await getTokenCurrentAllowance(
    args.inputToken,
    wallet.address,
    getRouterAddress()
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
  tokenContract.connect(wallet.address);
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
      .catch((e) => {
        // general fallback for tokens who restrict approval amounts
        useExact = true;
        return tokenContract.estimateGas.approve(
          spender,
          amountToApprove.raw.toString()
        );
      });

    await callWithGasPrice(
      tokenContract,
      "approve",
      [spender, useExact ? amountToApprove.raw.toString() : MaxUint256],
      {
        gasLimit: calculateGasMargin(estimatedGas),
      }
    ).catch((e) => {
      console.error("error", e);
    });
  };

  switch (getApprovalState()) {
    case ApprovalState.NOT_APPROVED:
      await approve();
      break;
    case ApprovalState.APPROVED:
      console.log("👌 already approve");
      return;
  }
}
