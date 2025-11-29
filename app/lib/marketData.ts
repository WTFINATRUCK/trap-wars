import { PublicKey } from "@solana/web3.js";
import { getTrapMint } from "./tokenUtils";

export interface MarketStats {
    solPrice: number;
    trapPrice: number;
    trapVolume24h: number;
    trapLiquidity: number;
    trapFdv: number;
    marketMultiplier: number;
    marketCondition: "BULL" | "BEAR" | "CRAB" | "MOON";
    lastUpdated: number;
}

// Reference values for "normal" market conditions
const REF_SOL_PRICE = 150; // Baseline SOL price
const REF_TRAP_VOLUME = 10000; // $10k daily volume is "normal"
const REF_TRAP_LIQ = 5000; // $5k liquidity is "normal"

export async function getMarketStats(): Promise<MarketStats> {
    try {
        // 1. Fetch SOL Price from Jupiter
        const solResponse = await fetch("https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112");
        const solData = await solResponse.json();
        const solPrice = parseFloat(solData?.data?.["So11111111111111111111111111111111111111112"]?.price || "0");

        // 2. Fetch TRAP Stats from DexScreener
        const trapMint = getTrapMint();
        let trapStats = {
            priceUsd: "0",
            volume: { h24: 0 },
            liquidity: { usd: 0 },
            fdv: 0
        };

        if (trapMint.toString() !== "TRAP_TOKEN_MINT_ADDRESS_HERE") {
            try {
                const dexResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${trapMint.toString()}`);
                const dexData = await dexResponse.json();
                if (dexData.pairs && dexData.pairs.length > 0) {
                    // Aggregate stats from all pairs (SOL, USDC, etc.)
                    const mainPair = dexData.pairs[0];
                    trapStats = {
                        priceUsd: mainPair.priceUsd,
                        volume: mainPair.volume,
                        liquidity: mainPair.liquidity,
                        fdv: mainPair.fdv
                    };
                }
            } catch (e) {
                console.error("Failed to fetch DexScreener data", e);
            }
        }

        // 3. Calculate Multiplier
        // SOL Impact: Direct correlation (SOL goes up, drug prices go up)
        const solFactor = solPrice > 0 ? solPrice / REF_SOL_PRICE : 1;

        // Volume Impact: High volume = High demand = Higher prices
        const volumeFactor = 1 + (trapStats.volume.h24 / REF_TRAP_VOLUME) * 0.2;

        // Liquidity Impact: High liquidity = Stability = Slightly higher prices (premium)
        const liqFactor = 1 + (trapStats.liquidity.usd / REF_TRAP_LIQ) * 0.1;

        let multiplier = solFactor * volumeFactor * liqFactor;

        // Cap multiplier to prevent game breaking (0.5x to 5x)
        multiplier = Math.max(0.5, Math.min(multiplier, 5.0));

        // Determine Market Condition
        let condition: MarketStats["marketCondition"] = "CRAB";
        if (multiplier > 2.5) condition = "MOON";
        else if (multiplier > 1.2) condition = "BULL";
        else if (multiplier < 0.8) condition = "BEAR";

        return {
            solPrice,
            trapPrice: parseFloat(trapStats.priceUsd),
            trapVolume24h: trapStats.volume.h24,
            trapLiquidity: trapStats.liquidity.usd,
            trapFdv: trapStats.fdv,
            marketMultiplier: multiplier,
            marketCondition: condition,
            lastUpdated: Date.now()
        };

    } catch (error) {
        console.error("Error fetching market stats:", error);
        return {
            solPrice: 0,
            trapPrice: 0,
            trapVolume24h: 0,
            trapLiquidity: 0,
            trapFdv: 0,
            marketMultiplier: 1,
            marketCondition: "CRAB",
            lastUpdated: Date.now()
        };
    }
}
