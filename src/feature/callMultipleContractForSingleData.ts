import { CliCallState, ListenerOptions, OptionalMethodInputs } from "types";
import { getChainId, getCurrentBlockNumber } from "context";
import { Interface } from "@ethersproject/abi";
import { INVALID_RESULT, isValidMethodArgs } from "./multicall";
import { getMulticallCallResults } from "multicall/updater";
import { toCallKey } from "multicall/actions";
import { toCallState } from "multicall/toCallState";

export interface Call {
  address: string;
  callData: string;
}

interface CallResult {
  readonly valid: boolean;
  readonly data: string | undefined;
  readonly blockNumber: number | undefined;
}

async function transformCallsData(
  calls: (Call | undefined)[],
  options?: ListenerOptions
): Promise<CallResult[]> {
  const callResults = await getMulticallCallResults(calls);
  return calls.map<CallResult>((call) => {
    if (!getChainId || !call) return INVALID_RESULT;
    const result = callResults[getChainId()]?.[toCallKey(call)];
    let data;
    if (result?.data && result?.data !== "0x") {
      // eslint-disable-next-line prefer-destructuring
      data = result.data;
    }

    return { valid: true, data: result.data, blockNumber: result?.blockNumber };
  });
}

export async function callMultipleContractForSingleData(
  addresses: (string | undefined)[],
  contractInterface: Interface,
  methodName: string,
  callInputs?: OptionalMethodInputs,
  options?: ListenerOptions
): Promise<CliCallState[]> {
  const fragment = contractInterface.getFunction(methodName);
  const callData: string | undefined =
    fragment && isValidMethodArgs(callInputs)
      ? contractInterface.encodeFunctionData(fragment, callInputs)
      : undefined;

  const calls =
    fragment && addresses && addresses.length > 0 && callData
      ? addresses.map<Call | undefined>((address) => {
          return address && callData
            ? {
                address,
                callData,
              }
            : undefined;
        })
      : [];

  const callResults = await transformCallsData(calls, options);
  return callResults.map((result) => toCallState(result, contractInterface, fragment))
}
