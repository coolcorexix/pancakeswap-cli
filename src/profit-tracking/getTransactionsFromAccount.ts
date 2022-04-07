import axios from "axios";
import { ScanServiceApiTransaction } from "types";

export async function getTransactionsFromAccount(args: {
  scanServiceApi: string;
  apiKey: string;
  inputAddress: string;
}) {
  const response = await axios.get(args.scanServiceApi, {
    params: {
      module: "account",
      action: "txlist",
      address: args.inputAddress,
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "1000",
      sort: "asc",
      apikey: args.apiKey,
    },
  });
  if (!response.status || !Number(response.data.status)) {
    throw new Error(response.data.message);
  }
  return response.data.result as ScanServiceApiTransaction[];
}
