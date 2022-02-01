import { Contract } from "@ethersproject/contracts";
import { toCallState } from "multicall/toCallState";
import { CliCallState, ListenerOptions, OptionalMethodInputs } from "types";
import { Call } from "./callMultipleContractForSingleData";
import { transformCallsData } from "contract/transformCallsData";

export async function callSingleContractForMultipleData(
  contract: Contract | null | undefined,
  methodName: string,
  callInputs: OptionalMethodInputs[],
  options?: ListenerOptions
): Promise<CliCallState[]> {
  const fragment = contract?.interface?.getFunction(methodName);

  const calls =
    contract && fragment && callInputs && callInputs.length > 0
      ? callInputs.map<Call>((inputs) => {
          return {
            address: contract.address,
            callData: contract.interface.encodeFunctionData(fragment, inputs),
          };
        })
      : [];

  const results = await transformCallsData(calls, options);

  return results.map((result) =>
    toCallState(result, contract?.interface, fragment)
  );
}
