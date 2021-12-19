import { ChainId, Token } from '@pancakeswap/sdk';
const { MAINNET } = ChainId;

export const mainnetTokens = {
  pols: new Token(
    ChainId.MAINNET,
    "0x7e624fa0e1c4abfd309cc15719b7e2580887f570",
    18,
    "POLS",
    "polka-starter"
  ),
  dnxc: new Token(
    ChainId.MAINNET,
    "0x3c1748d647e6a56b37b66fcd2b5626d0461d3aa0",
    18,
    "DNXC",
    "Dinox Currency"
  ),
  wbnb: new Token(
    MAINNET,
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    18,
    "WBNB",
    "Wrapped BNB",
    "https://www.binance.com/"
  ),
  // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  bnb: new Token(
    MAINNET,
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    18,
    "BNB",
    "BNB",
    "https://www.binance.com/"
  ),
  cake: new Token(
    MAINNET,
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    18,
    "CAKE",
    "PancakeSwap Token",
    "https://pancakeswap.finance/"
  ),
  busd: new Token(
    MAINNET,
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    18,
    'BUSD',
    'Binance USD',
    'https://www.paxos.com/busd/',
  ),
  usdt: new Token(
    MAINNET,
    '0x55d398326f99059fF775485246999027B3197955',
    18,
    'USDT',
    'Tether USD',
    'https://tether.to/',
  ),
};
