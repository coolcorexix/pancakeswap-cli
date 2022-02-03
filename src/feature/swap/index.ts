import { Trade } from "@pancakeswap/sdk";
import { INITIAL_ALLOWED_SLIPPAGE } from "constants/index";
import { getSwapCallArguments } from "./getSwapCallArguments";
import { gasPrice, getChainId, provider, wallet } from "context";
import { SwapCallbackState } from "./types";
import { onSwapCallback } from "./onSwapCallback";
import { GAS_PRICE } from "constants/gasPrice";

export async function swap(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE // in bips
): Promise<{
  state: SwapCallbackState;
  callback: null | (() => Promise<string>);
  error: string | null;
}> {  
  const account = wallet.address;
  const recipient = account;
  const swapCalls = await getSwapCallArguments(trade, allowedSlippage);
  if (!trade || !provider || !account || !getChainId()) {
    return {
      state: SwapCallbackState.INVALID,
      callback: null,
      error: "Missing dependencies",
    };
  }
  if (!recipient) {
    return {
      state: SwapCallbackState.INVALID,
      callback: null,
      error: "Invalid recipient",
    };
  }
  return {
    state: SwapCallbackState.VALID,
    callback: onSwapCallback.bind(null,{
        swapCalls,
        trade,
        gasPrice: gasPrice as GAS_PRICE,
        recipient,
        account 
    }),
    error: null,
  }
}
