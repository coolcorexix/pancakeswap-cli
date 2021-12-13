import { JsonRpcSigner, JsonRpcProvider } from '@ethersproject/providers'

// account is not optional
export function getSigner(library: JsonRpcProvider, account: string): JsonRpcSigner {
    return library.getSigner(account).connectUnchecked()
  }