import { FunctionFragment, Interface } from "@ethersproject/abi"
import { CallResult } from "feature/multicall"
import { CliCallState, Result } from "types"

const INVALID_CALL_STATE: CliCallState = { valid: false, result: undefined, error: false }

export function toCallState(
    callResult: CallResult | undefined,
    contractInterface: Interface | undefined,
    fragment: FunctionFragment | undefined,
  ): CliCallState {
    if (!callResult) return INVALID_CALL_STATE
    const { valid, data, blockNumber } = callResult
    if (!valid) return INVALID_CALL_STATE
    const success = data && data.length > 2
    let result: Result | undefined
    if (success && data) {
      try {
        result = contractInterface.decodeFunctionResult(fragment, data)
      } catch (error) {
        console.debug('Result data parsing failed', fragment, data)
        return {
          valid: true,
          error: true,
          result,
        }
      }
    }
    return {
      valid: true,
      result,
      error: !success,
    }
  }