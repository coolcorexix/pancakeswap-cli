import abiDecoder from "abi-decoder";

export function decodeTransactionInputData(
  hexTransactionDataInput: string,
  contractAbi: string
) {
    abiDecoder.addABI(contractAbi);
  return abiDecoder.decodeMethod(hexTransactionDataInput);
}
