import { Currency, Token } from "@pancakeswap/sdk";
import { BASES_TO_CHECK_TRADES_AGAINST } from "constants/BASE_TRADE_PAIRS";
import { mainnetTokens } from "./constants/mainnetTokens";
import { chainId } from "./context";
import { trade } from "./feature/trade";

const POLS = new Token(
  chainId,
  "0x8d0a4e9a0e9b0dc478eb3f8fe7b0b2fcfc53f9df",
  18,
  "POLS",
  "polka-starter"
);

const DNXC = new Token(
    chainId,
    '0x3c1748d647e6a56b37b66fcd2b5626d0461d3aa0',
    18,
    "DNXC",
    "Dinox Currency"
);

trade(POLS, mainnetTokens.busd);
