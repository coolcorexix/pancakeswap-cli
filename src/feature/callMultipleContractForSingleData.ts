import { CliCallState, ListenerOptions, OptionalMethodInputs } from "types";
import { Interface } from "@ethersproject/abi";
import { INVALID_RESULT, isValidMethodArgs } from "./multicall";
import { getMulticallCallResults } from "multicall/updater";
import { toCallKey } from "multicall/actions";
import { toCallState } from "multicall/toCallState";
import { transformCallsData } from "contract/transformCallsData";

export interface Call {
  address: string;
  callData: string;
}

interface CallResult {
  readonly valid: boolean;
  readonly data: string | undefined;
  readonly blockNumber: number | undefined;
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
