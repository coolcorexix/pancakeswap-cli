import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseFixed } from "@ethersproject/bignumber";

const names = [
    "wei",
    "kwei",
    "mwei",
    "gwei",
    "szabo",
    "finney",
    "ether",
];

export function parseUnits(value: string, unitName?: BigNumberish): BigNumber {
    if (typeof(value) !== "string") {
        console.error("value must be a string", "value", value);
    }
    if (typeof(unitName) === "string") {
        const index = names.indexOf(unitName);
        if (index !== -1) { unitName = 3 * index; }
    }
    return parseFixed(value, (unitName != null) ? unitName: 18);
}
