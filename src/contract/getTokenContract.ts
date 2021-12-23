import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract } from "@ethersproject/contracts";
import ERC20_ABI from "abi/ERC20.json";
import { getProviderOrSigner } from "./getProviderOrSigner";

export function getTokenContract(
    tokenAddress: string,
    library: JsonRpcProvider,
    account?: string
): Contract | null {
  return new Contract(
    tokenAddress,
    ERC20_ABI,
    getProviderOrSigner(library, account) as any
  );
}
