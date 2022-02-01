import { ETHER, WETH } from "constants/index";
import { getChainId } from "context";
import { wrap, WrapType } from "feature/wrap";

export async function wrapCommand(args: { depositValue: string }) {
  const toWrapToken = ETHER;
  const toWrapIntoToken = WETH[getChainId()];
  const wrapBundle = await wrap(toWrapToken, toWrapIntoToken, args.depositValue);

  switch (wrapBundle.wrapType) {
    case WrapType.NOT_APPLICABLE: {
      console.log("Wrap action not applicable");
      break;
    }
    default: {
      if ("execute" in wrapBundle) {
        if (wrapBundle.execute) {
          await wrapBundle.execute();
        } else {
          console.log(wrapBundle.inputError);
        }
      }
    }
  }
}
