import { Contract } from '@ethersproject/contracts'
import { Call } from 'feature/callMultipleContractForSingleData';

/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param multicallContract multicall contract to fetch against
 * @param chunk chunk of calls to make
 * @param minBlockNumber minimum block number of the result set
 */
export async function fetchChunk(
  multicallContract: Contract,
  chunk: Call[],
  minBlockNumber: number
): Promise<{ results: string[]; blockNumber: number }> {
  console.debug("Fetching chunk", multicallContract, chunk, minBlockNumber);
  let resultsBlockNumber;
  let returnData;
  try {
    // prettier-ignore
    [resultsBlockNumber, returnData] = await multicallContract.aggregate(
        chunk.map((obj) => [obj.address, obj.callData])
      )
  } catch (error) {
    console.debug("Failed to fetch chunk inside retry", error);
    throw error;
  }
  if (resultsBlockNumber.toNumber() < minBlockNumber) {
    console.debug(
      `Fetched results for old block number: ${resultsBlockNumber.toString()} vs. ${minBlockNumber}`
    );
    throw new Error("Fetched for old block number");
  }
  return { results: returnData, blockNumber: resultsBlockNumber.toNumber() };
}
