import ethers from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { CallOverrides, Contract } from "@ethersproject/contracts";
import { gasPrice, provider, wallet } from "context";

/**
 * Perform a contract call with a gas price
 * @param contract Used to perform the call
 * @param methodName The name of the method called
 * @param methodArgs An array of arguments to pass to the method
 * @param overrides An overrides object to pass to the method. gasPrice passed in here will take priority over the price returned by useGasPrice
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const callWithGasPrice = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[] = [],
  overrides: CallOverrides = null
): Promise<TransactionResponse> => {
  const hasManualGasPriceOverride = overrides?.gasPrice;
  console.log('⏳ Please wait, calling the contract might take a little bit long...');

  const unsignedTx = await contract.populateTransaction[methodName](
    ...methodArgs,
    hasManualGasPriceOverride ? { ...overrides } : { ...overrides, gasPrice }
  );
  unsignedTx.nonce = await provider.getTransactionCount(wallet.address);

  const signedTx = await wallet.signTransaction(unsignedTx);
  const tx: TransactionResponse = await provider.sendTransaction(signedTx);
  await tx.wait(1);
  return tx;
};
