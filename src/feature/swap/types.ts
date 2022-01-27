import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from "@ethersproject/contracts";
import { SwapParameters } from "@pancakeswap/sdk";

export interface SwapCall {
  contract: Contract;
  parameters: SwapParameters;
}

export enum SwapCallbackState {
  INVALID,
  VALID,
}

export interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

export interface FailedCall {
  call: SwapCall
  error: Error
}

export type EstimatedSwapCall = SuccessfulCall | FailedCall