import { CoinGeckoClient } from "coingecko-api-v3";

export async function getTokenPriceAtTheTime(args: {
  unixEpochtimeStamp: number;
  tokenContractAddress: string;
  platformId: "binance-smart-chain";
}) {
  try {
    const client = new CoinGeckoClient();
    // 1 hours, probing until we get a valid price up to 5 hours
    const timeGap = 60 * 60;
    for (let i = 0; i < 5; i++) {
      const response = await client.contractMarketChartRange({
        id: args.platformId as any,
        contract_address: args.tokenContractAddress,
        vs_currency: "usd",
        from: args.unixEpochtimeStamp - timeGap * (i + 1),
        to: args.unixEpochtimeStamp,
      });
      if (!response.prices.length) {
        continue;
      }
      return response.prices[0][1];
    }
  } catch {
    console.log("timestamp with error: ", args.unixEpochtimeStamp);
  }
}
