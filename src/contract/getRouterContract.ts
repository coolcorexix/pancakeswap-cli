import { Contract } from "@ethersproject/contracts";
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { getContract } from "./getContract";
import { provider } from "context";
import { ChainId } from "@pancakeswap/sdk";
import { getAddress, getRouterAddress } from "utils/addressHelpers";

export function getRouterContract(): Contract {
    return getContract(getRouterAddress(), IUniswapV2Router02ABI, provider); 
}