import { Currency, currencyEquals } from "@pancakeswap/sdk";
import { ETHER, WETH } from "constants/index";
import { gasPrice, getChainId, wallet } from "context";
import { callWithGasPrice } from "contract/callWithGasPrice";
import { getWETHContract } from "contract/getWETHContract";
import { getCurrencyBalance } from "feature/get-token-balances/getCurrencyBalance";
import { tryParseAmount } from "feature/tryParseAmount";

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };

/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export async function wrap(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
) {
  const account = wallet.address;
  const wethContract = getWETHContract();
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const balance = await getCurrencyBalance(account ?? undefined, inputCurrency);
  const inputAmount = tryParseAmount(typedValue, inputCurrency);

  if (!wethContract || !getChainId() || !inputCurrency || !outputCurrency)
    return NOT_APPLICABLE;

  const sufficientBalance =
    inputAmount && balance && !balance.lessThan(inputAmount);

  if (
    inputCurrency === ETHER &&
    currencyEquals(WETH[getChainId()], outputCurrency)
  ) {
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                const txReceipt = await callWithGasPrice(
                  wethContract,
                  "deposit",
                  undefined,
                  {
                    value: `0x${inputAmount.raw.toString(16)}`,
                    gasLimit: 500000,
                  }
                );
                console.log(
                  `🧾 Wrap ${inputAmount.toSignificant(
                    6
                  )} BNB to WBNB receipt: ${txReceipt.hash}`
                );
              } catch (error) {
                console.error("Could not deposit", error);
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : "Insufficient BNB balance",
    };
  }
  //! This code is untested
  if (
    currencyEquals(WETH[getChainId()], inputCurrency) &&
    outputCurrency === ETHER
  ) {
    return {
      wrapType: WrapType.UNWRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                const txReceipt = await callWithGasPrice(
                  wethContract,
                  "withdraw",
                  [`0x${inputAmount.raw.toString(16)}`, gasPrice]
                );
                console.log(
                  `🧾 Unwrap ${inputAmount.toSignificant(
                    6
                  )} WBNB to BNB receipt: ${txReceipt.hash}`
                );
              } catch (error) {
                console.error("Could not withdraw", error);
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : "Insufficient WBNB balance",
    };
  }
  return NOT_APPLICABLE;
}
function MaxUint256(spender: any, MaxUint256: any) {
  throw new Error("Function not implemented.");
}
