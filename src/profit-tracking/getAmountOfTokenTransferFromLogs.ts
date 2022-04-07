import { Log } from "@ethersproject/abstract-provider";
import {
  DECIMALS,
  inflowMethods,
  outflowMethods,
  TRANSFER_TOPIC,
} from "./constants";

function convertInputDataToAddressFormat(hexData: string) {
  return hexData.replace("000000000000000000000000", "");
}

export function getAmountOfTokenTransferFromLogs(
  logs: Log[],
  inspectingAddress: string,
  addressEmittingLog?: string
) {
  const transferToAccountLogs = logs.filter((log) => {
    if (addressEmittingLog && log.address !== addressEmittingLog) {
      return false;
    }

    return (
      (log.topics[0] === TRANSFER_TOPIC &&
        convertInputDataToAddressFormat(log.topics[1]) === inspectingAddress) ||
      (log.topics[0] === TRANSFER_TOPIC &&
        convertInputDataToAddressFormat(log.topics[2]) === inspectingAddress)
    );
  });
  return transferToAccountLogs.reduce((acc, transferLog) => {
    return acc + parseInt(transferLog?.data, 16) / Math.pow(10, DECIMALS);
  }, 0);
}
