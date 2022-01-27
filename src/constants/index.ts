import { JSBI, Percent } from "@pancakeswap/sdk"

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))
// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
export const BIPS_BASE = JSBI.BigInt(10000)
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20