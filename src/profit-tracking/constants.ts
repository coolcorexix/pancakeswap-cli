import { ERC20_INTERFACE } from "contract/interface/erc20";

export const DECIMALS = 18;
export const DEPOSIT_METHOD = "deposit";
export const DEPOSIT_ALL_METHOD = "depositAll";
export const WITHDRAW_METHOD = "withdraw";
export const WITHDRAW_ALL_METHOD = "withdrawAll";
export const ENTER_STAKING_METHOD = "enterStaking";
export const LEAVE_STAKING_METHOD = "leaveStaking";
export const HARVEST_METHOD = "harvest";

export const ADD_LIQUIDITY_ETH_METHOD = "addLiquidityETH";

export const TRANSFER_TOPIC = ERC20_INTERFACE.getEventTopic("Transfer");

export const inflowMethods = [DEPOSIT_METHOD, ENTER_STAKING_METHOD];
export const outflowMethods = [
  WITHDRAW_METHOD,
  WITHDRAW_ALL_METHOD,
  LEAVE_STAKING_METHOD,
  HARVEST_METHOD,
];

export const addLiquidityMethods = [ADD_LIQUIDITY_ETH_METHOD];