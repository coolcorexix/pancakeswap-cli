import { JSBI, Percent, Router, Trade } from "@pancakeswap/sdk";
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from "constants/index";
import { getChainId, getRouterAddress, wallet } from "context";
import { getRouterContract } from "contract/getRouterContract";
import { getCurrentBlockTimestamp } from "feature/blockchain-state/getCurrentBlockTimestamp";
import { getTransactionDeadline } from "./getTransactionDeadline";
import { SwapCall } from "./types";

export async function getSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE // in bips
): Promise<SwapCall[]> {
    const recipient = wallet.address;
    const deadline = await getTransactionDeadline();
    if (!trade || !recipient || !getChainId() || !deadline) return [];
    
    const routerContract = getRouterContract();
    if (!routerContract) {
      return []
    }
    const swapMethods = [];

    swapMethods.push(Router.swapCallParameters(trade, {
      feeOnTransfer: false,
      allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
      deadline: deadline.toNumber(),
      recipient,
    }));

    

}
