import { CliCallState, ListenerOptions, OptionalMethodInputs } from "types";
import { Contract } from "@ethersproject/contracts";
import { isValidMethodArgs } from "feature/multicall";
import { transformCallsData } from "./transformCallsData";
import { toCallState } from "multicall/toCallState";

export async function getSingleCallResult(
  contract: Contract | null | undefined,
  methodName: string,
  inputs?: OptionalMethodInputs,
  options?: ListenerOptions
): Promise<CliCallState> {
  const fragment = contract?.interface?.getFunction(methodName);
  const calls =
    contract && fragment && isValidMethodArgs(inputs)
      ? [
          {
            address: contract.address,
            callData: contract.interface.encodeFunctionData(fragment, inputs),
          },
        ]
      : [];
  const result = (await transformCallsData(calls, options))[0];
  return toCallState(result, contract?.interface, fragment);
}
