import { ChainId } from "@pancakeswap/sdk";

const getNodeUrl = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.TESTNET:
      return "https://data-seed-prebsc-2-s3.binance.org:8545";
    case ChainId.MAINNET:
      return "https://bsc-dataseed.binance.org/";
  }
};

export default getNodeUrl;
