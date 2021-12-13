import { JsonRpcSigner, JsonRpcProvider } from "@ethersproject/providers";
import { getSigner } from "./getSigner";

// account is optional
export function getProviderOrSigner(
  library: JsonRpcProvider,
  account?: string
): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}
