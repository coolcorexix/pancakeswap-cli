import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";

export interface ListenerOptions {
  // how often this data should be fetched, by default 1
  readonly blocksPerFetch?: number;
}

export type MethodArg = string | number | BigNumber;
export type MethodArgs = Array<MethodArg | MethodArg[]>;
export type OptionalMethodInputs =
  | Array<MethodArg | MethodArg[] | undefined>
  | undefined;

export interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any;
}

// adapted from CallState of Pancake UI
export interface CliCallState {
  readonly valid: boolean;
  // the result, or undefined if loading or errored/no data
  readonly result: Result | undefined;
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean;
}

export interface BscScanApiTransaction {
  blockNumber: string;
  /**unix epoch format */
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}
