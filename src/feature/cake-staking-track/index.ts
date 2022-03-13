import { getTransactionsFromAccount } from "api/bscscan";

export async function cakeStakingTrack(address: string) {
  const transactions = await getTransactionsFromAccount(address);
}
