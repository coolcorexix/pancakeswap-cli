import WETH_ABI from 'abi/weth.json';
import { provider } from 'context';
import { getWethAddress } from "utils/addressHelpers";
import { getContract } from "./getContract";

export function getWETHContract() {
    return getContract(getWethAddress(), WETH_ABI, provider);
}