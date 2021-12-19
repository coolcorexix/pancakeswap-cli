import { getContract } from "contract/getContract";
import { getMulticallAddress } from "utils/addressHelpers";
import MulticallAbi from "abi/Multicall.json";
import { getChainId, provider } from "context";
import { Call } from "feature/callMultipleContractForSingleData";
import { toCallKey } from "./actions";

export async function getMulticallCallResults(calls: Call[]) {
  const multicallContract = getContract(
    getMulticallAddress(),
    MulticallAbi,
    provider
  );
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
