export interface ContractInfo {
  name: string;
  address: string;
  abi: string;
}
export interface YieldFarmingContractInfo extends ContractInfo {
  stakingMethods: string[];
}

export interface DecodedMethodInfo {
  name: string;
  params: {
    name: string;
    value: string;
    type: string;
  }[];
}