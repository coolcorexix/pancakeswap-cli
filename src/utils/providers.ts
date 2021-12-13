import { JsonRpcProvider } from "@ethersproject/providers";
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()

export const simpleRpcProvider = new JsonRpcProvider(RPC_URL);

export default null
