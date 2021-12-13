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
