import { getChainId } from "context";
import { Call } from "feature/callMultipleContractForSingleData";
import { CallResult, INVALID_RESULT } from "feature/multicall";
import { toCallKey } from "multicall/actions";
import { getMulticallCallResults } from "multicall/updater";
import { ListenerOptions } from "types";

export async function transformCallsData(
    calls: (Call | undefined)[],
    options?: ListenerOptions
  ): Promise<CallResult[]> {
    const callResults = await getMulticallCallResults(calls);
    return calls.map<CallResult>((call) => {
      if (!getChainId() || !call) return INVALID_RESULT;
      const result = callResults[getChainId()]?.[toCallKey(call)];
      let data;
      if (result?.data && result?.data !== "0x") {
        // eslint-disable-next-line prefer-destructuring
        data = result.data;
      }
  
      return { valid: true, data: result.data, blockNumber: result?.blockNumber };
    });
  }