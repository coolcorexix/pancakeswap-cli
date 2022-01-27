import { getChainId } from "context";
import { Call } from "feature/callMultipleContractForSingleData";
import { toCallKey } from "./actions";
import { getMulticallContract } from "./getMulticallContract";

export async function getMulticallCallResults(calls: Call[]) {
  const multicallContract = getMulticallContract();
    try {
      const [resultsBlockNumber, returnData] = await multicallContract.aggregate(
        calls.map((call) => [call.address, call.callData])
      );
      return calls.reduce((acc, call, index) => {
        acc[getChainId()][toCallKey(call)] = {
          data: returnData[index],
          blockNumber: resultsBlockNumber,
        };
        return acc;
      },  {
        [getChainId()]: {}
      })
    } catch (e) {
      throw new Error(JSON.stringify(e));
    }
}
