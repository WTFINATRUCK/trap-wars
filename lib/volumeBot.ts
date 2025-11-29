import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getQuote, getSwapTransaction } from "./tokenUtils";

export interface BotConfig {
    tokenMint: string;
    minBuyAmount: number; // in SOL
    maxBuyAmount: number; // in SOL
    minInterval: number; // seconds
    maxInterval: number; // seconds
    maxSlippage: number; // percentage
    profitMargin: number; // percentage to aim for on sells
}

export interface BotStats {
    totalBuys: number;
    totalSells: number;
    totalVolume: number; // in USD equivalent
    netProfit: number; // in SOL
    isRunning: boolean;
    currentBalance: number; // SOL balance
}

export class VolumeBumperBot {
    private connection: Connection;
    private wallet: Keypair;
    private config: BotConfig;
    private stats: BotStats;
    private isRunning: boolean = false;
    private intervalId: any = null;
    private onLog: (msg: string) => void;

    constructor(
        connection: Connection,
        wallet: Keypair,
        config: BotConfig,
        onLog: (msg: string) => void
    ) {
        this.connection = connection;
        this.wallet = wallet;
        this.config = config;
        this.onLog = onLog;
        this.stats = {
            totalBuys: 0,
            totalSells: 0,
            totalVolume: 0,
            netProfit: 0,
            isRunning: false,
            currentBalance: 0
        };
    }

    async start() {
        if (this.isRunning) {
            this.onLog("⚠️ Bot is already running");
            return;
        }

        this.isRunning = true;
        this.stats.isRunning = true;
        this.onLog("🚀 Volume Bumper Bot started!");

        await this.updateBalance();
        this.scheduleNextAction();
    }

    stop() {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
        }
        this.isRunning = false;
        this.stats.isRunning = false;
        this.onLog("🛑 Volume Bumper Bot stopped");
    }

    private async updateBalance() {
        try {
            const balance = await this.connection.getBalance(this.wallet.publicKey);
            this.stats.currentBalance = balance / LAMPORTS_PER_SOL;
        } catch (error) {
            this.onLog(`❌ Failed to update balance: ${error}`);
        }
    }

    private scheduleNextAction() {
        if (!this.isRunning) return;

        // Random interval between min and max
        const interval = Math.random() * (this.config.maxInterval - this.config.minInterval) + this.config.minInterval;

        this.intervalId = setTimeout(async () => {
            await this.executeAction();
            this.scheduleNextAction();
        }, interval * 1000);
    }

    private async executeAction() {
        await this.updateBalance();

        // Decide: buy or sell (70% buy, 30% sell to create net buying pressure)
        const action = Math.random() < 0.7 ? "buy" : "sell";

        if (action === "buy") {
            await this.executeBuy();
        } else {
            await this.executeSell();
        }
    }

    private async executeBuy() {
        try {
            // Random buy amount
            const buyAmount = Math.random() * (this.config.maxBuyAmount - this.config.minBuyAmount) + this.config.minBuyAmount;

            if (this.stats.currentBalance < buyAmount + 0.01) { // Keep 0.01 SOL for fees
                this.onLog(`⚠️ Insufficient balance for buy (${buyAmount.toFixed(4)} SOL)`);
                return;
            }

            this.onLog(`💰 Executing BUY: ${buyAmount.toFixed(4)} SOL...`);

            // Get quote
            const quote = await getQuote("SOL", this.config.tokenMint, buyAmount * LAMPORTS_PER_SOL);
            if (!quote) throw new Error("No quote available");

            // Get swap transaction
            const swapTx = await getSwapTransaction(quote, this.wallet.publicKey.toBase58());
            if (!swapTx) throw new Error("Failed to build swap");

            // Sign and send
            const txBuf = Buffer.from(swapTx, "base64");
            const transaction = await import("@solana/web3.js").then(mod => mod.VersionedTransaction.deserialize(txBuf));
            transaction.sign([this.wallet]);

            const signature = await this.connection.sendTransaction(transaction);

            this.stats.totalBuys++;
            this.stats.totalVolume += buyAmount;
            this.onLog(`✅ BUY executed! Tx: ${signature.slice(0, 8)}...`);
        } catch (error) {
            this.onLog(`❌ BUY failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    private async executeSell() {
        try {
            // For sells, we need to check token balance first
            // This is simplified - in production you'd query actual token balance

            const sellAmount = Math.random() * (this.config.maxBuyAmount - this.config.minBuyAmount) + this.config.minBuyAmount;

            this.onLog(`💸 Executing SELL: ~${sellAmount.toFixed(4)} SOL worth...`);

            // In a real implementation:
            // 1. Get current token balance
            // 2. Calculate how much to sell based on profit margin
            // 3. Execute swap from TOKEN -> SOL

            // Placeholder for now
            this.stats.totalSells++;
            this.onLog(`✅ SELL executed (simulated)`);
        } catch (error) {
            this.onLog(`❌ SELL failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    getStats(): BotStats {
        return { ...this.stats };
    }
}
