import { mainnetTokens } from "./mainnetTokens";
import { testnetTokens } from "./testnetToken";

export default {
  multiCall: {
    56: "0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B",
    97: "0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576",
  },
  router: {
    56: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    97: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
  },
  weth: {
    56: mainnetTokens.wbnb.address,
    97: testnetTokens.wbnb.address,
  },
  ether: {
    56: mainnetTokens.bnb.address,
    97: testnetTokens.bnb.address,
  }
};
