import { Trade } from "@pancakeswap/sdk";
import { BigNumber } from "@ethersproject/bignumber";
import { GAS_PRICE } from "constants/gasPrice";
import { wallet } from "context";
import { callWithGasPrice } from "contract/callWithGasPrice";
import { calculateGasMargin } from "utils/calculateGasMargin";
import isZero from "utils/isZero";
import truncateHash from "utils/truncateHash";
import {
  EstimatedSwapCall,
  FailedCall,
  SuccessfulCall,
  SwapCall,
} from "./types";

export async function onSwapCallback(input: {
  swapCalls: SwapCall[];
  trade: Trade;
  recipient: string;
  account: string;
  gasPrice: GAS_PRICE;
}): Promise<string> {
  const { gasPrice, swapCalls, trade, recipient, account } = input;
  const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
    swapCalls.map((call) => {
      const {
        parameters: { methodName, args, value },
        contract,
      } = call;
      const options =
        !value || isZero(value)
          ? {
              from: account,
            }
          : {
              value,
              from: account,
            };

      return contract.estimateGas[methodName](...args, options)
        .then((gasEstimate) => {
          return { call, gasEstimate };
        })
        .catch((gasError) => {
          // console.error("Gas estimate failed, trying eth_call to extract error", call);

          return contract.callStatic[methodName](...args, options)
            .then((result) => {
              // console.error("Unexpected successful call after failed estimate gas", call, gasError, result);
              return {
                call,
                error: new Error(
                  "Unexpected issue with estimating the gas. Please try again."
                ),
              };
            })
            .catch((callError) => {
              // console.error("Call threw error", call, callError);
              const reason: string =
                callError.reason ||
                callError.data?.message ||
                callError.message;
              const errorMessage = `The transaction cannot succeed due to error: ${
                reason ?? "Unknown error, check the logs"
              }.`;

              return { call, error: new Error(errorMessage) };
            });
        });
    })
  );

  // a successful estimation is a bignumber gas estimate and the next call is also
  // a bignumber gas estimate
  const successfulEstimation = estimatedCalls.find(
    (el, ix, list): el is SuccessfulCall => {
      // array have at most 2 values
      return (
        "gasEstimate" in el &&
        (ix === list.length - 1 || "gasEstimate" in list[ix + 1])
      );
    }
  );
  if (!successfulEstimation) {
    const errorCalls = estimatedCalls.filter(
      (call): call is FailedCall => "error" in call
    );
    if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error;
    throw new Error(
      "Unexpected error. Please contact support: none of the calls threw an error"
    );
  }
  const {
    call: {
      contract,
      parameters: { methodName, args, value },
    },
    gasEstimate,
  } = successfulEstimation;
  return callWithGasPrice(contract, methodName, [...(args as any[])], {
    gasLimit: calculateGasMargin(gasEstimate),
    gasPrice: BigNumber.from(gasPrice),
    ...(value && !isZero(value)
      ? {
          value,
          from: account,
        }
      : {
          from: account,
        }),
  })
    .then((response: any) => {
      const inputSymbol = trade.inputAmount.currency.symbol;
      const outputSymbol = trade.outputAmount.currency.symbol;
      const inputAmount = trade.inputAmount.toSignificant(3);
      const outputAmount = trade.outputAmount.toSignificant(3);

      const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
      const summaryMessage = `${base} to ${truncateHash(
        recipient
      )}, transaction hash: ${response.hash}`;

      return summaryMessage;
    })
    .catch((error: any) => {
      // if the user rejected the tx, pass this along
      if (error?.code === 4001) {
        throw new Error("Transaction rejected.");
      } else {
        // otherwise, the error was unexpected and we need to convey that
        console.error(`Swap failed`, error, methodName, args, value);
        throw new Error(`Swap failed: ${error.message}`);
      }
    });
}
