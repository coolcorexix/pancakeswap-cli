import { JSBI, Percent } from "@pancakeswap/sdk";
import { ETHER as PCS_ETHER } from "@pancakeswap/sdk";
import { mainnetTokens } from "./mainnetTokens";
import { testnetTokens } from "./testnetToken";

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))
// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
export const BIPS_BASE = JSBI.BigInt(10000)
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20
export const DEFAULT_GAS_LIMIT = 200000

export const ETHER = PCS_ETHER;
export const WETH = {
    56: mainnetTokens.wbnb,
    97: testnetTokens.wbnb,
}
