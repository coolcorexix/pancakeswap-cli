import { getContract } from "contract/getContract";
import { Web3Provider } from "@ethersproject/providers";
import { getMulticallAddress } from "utils/addressHelpers";
import MulticallAbi from "abi/Multicall.json";
import { chainId, getCurrentBlockNumber, provider } from "context";
import { simpleRpcProvider } from "utils/providers";
import { fetchChunk } from "./fetchChunk";
import chunkArray from "./chunkArray";
import { Call } from "feature/callMultipleContractForSingleData";
import { toCallKey } from "./actions";

// chunk calls so we do not exceed the gas limit
const CALL_CHUNK_SIZE = 500;

export async function getMulticallCallResults(calls: Call[]) {
  const multicallContract = getContract(
    getMulticallAddress(),
    MulticallAbi,
    provider
  );

  const [resultsBlockNumber, returnData] = await multicallContract.aggregate(
    calls.map((call) => [call.address, call.callData])
  );
  console.log(
    "🚀 ~ file: updater.ts ~ line 24 ~ getMulticallCallResults ~ returnData",
    returnData
  );
  return calls.reduce((acc, call, index) => {
    acc[chainId][toCallKey(call)] = {
      data: returnData[index],
      blockNumber: resultsBlockNumber,
    };
    return acc;
  },  {
    [chainId]: {}
  })

  //   /*? no matter how many chunks, it always reduce to one multicall result because we just run 1 command at a time,
  //   no caching also
  //   */
  //   const accumulator = chunkedCalls.reduce<any>(async (acc, chunk) => {
  //         const a = await fetchChunk(multicallContract, chunk, await getCurrentBlockNumber());
  //         acc[chainId][toCallKey] =
  //   }, {
  //     [chainId]: {},
  //   });
  //   chunkedCalls.map(async (chunk) => {
  //     return fetchChunk(multicallContract, chunk, await getCurrentBlockNumber());
  //   });
}
