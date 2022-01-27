import { BigNumber } from "@ethersproject/bignumber";
import { DEFAULT_DEADLINE_FROM_NOW } from "constants/index";
import { getCurrentBlockTimestamp } from "feature/blockchain-state/getCurrentBlockTimestamp";

// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
export async function getTransactionDeadline(): Promise<BigNumber | undefined> {
  const ttl = DEFAULT_DEADLINE_FROM_NOW;
  const blockTimestamp = await getCurrentBlockTimestamp();

  if (blockTimestamp && ttl) return blockTimestamp.add(ttl);
  return undefined;
}
