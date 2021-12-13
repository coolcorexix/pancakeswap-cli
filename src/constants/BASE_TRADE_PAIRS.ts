import { ChainId, JSBI, Percent, Token } from '@pancakeswap/sdk'
import { mainnetTokens  } from './mainnetTokens'

export const ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
    [ChainId.MAINNET]: [
      mainnetTokens.wbnb,
      mainnetTokens.cake,
      mainnetTokens.busd,
      mainnetTokens.usdt,
    ],
    [ChainId.TESTNET]: [],
  }