import { ChainId, JSBI, Percent, Token } from '@pancakeswap/sdk'
import { mainnetTokens  } from './mainnetTokens'
import { testnetTokens } from './testnetToken'

export const ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
export const TESTNET_FACTORY_ADDRESS = '0x6725F303b657a9451d8BA641348b6761A6CC7a17'
export const TESTNET_INIT_CODEHASH = '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66'

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
    [ChainId.TESTNET]: [
      testnetTokens.wbnb,
      testnetTokens.busd,
      testnetTokens.usdt,
    ],
  }