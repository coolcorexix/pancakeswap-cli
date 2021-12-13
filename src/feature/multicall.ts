import { MethodArg, MethodArgs } from "types";

function isMethodArg(x: unknown): x is MethodArg {
  return ["string", "number"].indexOf(typeof x) !== -1;
}

export function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
  return (
    x === undefined ||
    (Array.isArray(x) &&
      x.every(
        (xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))
      ))
  );
}
export interface CallResult {
  readonly valid: boolean;
  readonly data: string | undefined;
  readonly blockNumber: number | undefined;
}
export const INVALID_RESULT: CallResult = {
  valid: false,
  blockNumber: undefined,
  data: undefined,
};
