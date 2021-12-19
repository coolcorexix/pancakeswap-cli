import { ChainId, Token } from "@pancakeswap/sdk";
const { TESTNET } = ChainId;
export const testnetTokens = {
  wbnb: new Token(
    TESTNET,
    "0xae13d989dac2f0debff460ac112a837c89baa7cd",
    18,
    "WBNB",
    "Wrapped BNB",
    "https://www.binance.com/"
  ),
  // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  bnb: new Token(
    TESTNET,
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    18,
    "BNB",
    "BNB",
    "https://www.binance.com/"
  ),
  busd: new Token(
    TESTNET,
    "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7",
    18,
    "BUSD",
    "Binance USD",
    "https://www.paxos.com/busd/"
  ),
  usdt: new Token(
    TESTNET,
    "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684",
    18,
    "USDT",
    "Tether USD",
    "https://tether.to/"
  ),
};
