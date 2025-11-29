import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getQuote, getSwapTransaction } from "./tokenUtils";

export interface GridBotConfig {
    tokenMint: string;
    gridLevels: number; // Number of price levels
    totalCapital: number; // Total SOL to use
    priceRange: { min: number; max: number }; // Price range in SOL per token
    orderSize: number; // SOL per order
}

interface GridOrder {
    level: number;
    price: number;
    side: "buy" | "sell";
    amount: number;
    filled: boolean;
}

export interface GridBotStats {
    activeOrders: number;
    filledOrders: number;
    totalProfit: number;
    isRunning: boolean;
}

export class GridTradingBot {
    private connection: Connection;
    private wallet: Keypair;
    private config: GridBotConfig;
    private stats: GridBotStats;
    private isRunning: boolean = false;
    private orders: GridOrder[] = [];
    private checkInterval: any = null;
    private onLog: (msg: string) => void;
    private currentPrice: number = 0;

    constructor(
        connection: Connection,
        wallet: Keypair,
        config: GridBotConfig,
        onLog: (msg: string) => void
    ) {
        this.connection = connection;
        this.wallet = wallet;
        this.config = config;
        this.onLog = onLog;
        this.stats = {
            activeOrders: 0,
            filledOrders: 0,
            totalProfit: 0,
            isRunning: false
        };
    }

    async start() {
        if (this.isRunning) {
            this.onLog("⚠️ Grid bot is already running");
            return;
        }

        this.isRunning = true;
        this.stats.isRunning = true;
        this.onLog("📊 Grid Trading Bot started!");

        await this.initializeGrid();
        this.startPriceMonitoring();
    }

    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        this.isRunning = false;
        this.stats.isRunning = false;
        this.onLog("🛑 Grid Trading Bot stopped");
    }

    private async initializeGrid() {
        this.orders = [];
        const { gridLevels, priceRange, orderSize } = this.config;
        const priceStep = (priceRange.max - priceRange.min) / (gridLevels - 1);

        // Create grid of buy and sell orders
        for (let i = 0; i < gridLevels; i++) {
            const price = priceRange.min + (priceStep * i);

            // Buy orders below mid-price, sell orders above
            const midPrice = (priceRange.min + priceRange.max) / 2;
            const side = price < midPrice ? "buy" : "sell";

            this.orders.push({
                level: i,
                price,
                side,
                amount: orderSize,
                filled: false
            });
        }

        this.stats.activeOrders = this.orders.length;
        this.onLog(`📊 Initialized ${this.orders.length} grid levels`);
    }

    private startPriceMonitoring() {
        // Check price and execute orders every 10 seconds
        this.checkInterval = setInterval(async () => {
            await this.updatePriceAndExecuteOrders();
        }, 10000);
    }

    private async updatePriceAndExecuteOrders() {
        try {
            // Get current price via quote
            const quote = await getQuote("SOL", this.config.tokenMint, 0.1 * LAMPORTS_PER_SOL);
            if (!quote || !quote.outAmount) return;

            // Calculate price (this is simplified)
            this.currentPrice = 0.1 / (quote.outAmount / LAMPORTS_PER_SOL);

            // Check if any orders should be filled
            for (const order of this.orders) {
                if (order.filled) continue;

                // Simulate order filling based on price crossing
                const shouldFill =
                    (order.side === "buy" && this.currentPrice <= order.price) ||
                    (order.side === "sell" && this.currentPrice >= order.price);

                if (shouldFill && Math.random() < 0.3) { // 30% chance to fill
                    await this.fillOrder(order);
                }
            }
        } catch (error) {
            this.onLog(`❌ Price update failed: ${error}`);
        }
    }

    private async fillOrder(order: GridOrder) {
        try {
            this.onLog(`⚡ Filling ${order.side.toUpperCase()} order at level ${order.level} (~${order.price.toFixed(6)} SOL)`);

            if (order.side === "buy") {
                // Execute buy
                const quote = await getQuote("SOL", this.config.tokenMint, order.amount * LAMPORTS_PER_SOL);
                if (!quote) throw new Error("No quote");

                const swapTx = await getSwapTransaction(quote, this.wallet.publicKey.toBase58());
                if (!swapTx) throw new Error("No swap tx");

                const txBuf = Buffer.from(swapTx, "base64");
                const transaction = await import("@solana/web3.js").then(mod => mod.VersionedTransaction.deserialize(txBuf));
                transaction.sign([this.wallet]);

                const signature = await this.connection.sendTransaction(transaction);
                this.onLog(`✅ BUY filled! Tx: ${signature.slice(0, 8)}...`);
            } else {
                // Execute sell (simplified)
                this.onLog(`✅ SELL filled (simulated)`);
            }

            order.filled = true;
            this.stats.filledOrders++;
            this.stats.activeOrders--;

            // Create new order at the opposite side to continue grid
            await this.createCounterOrder(order);
        } catch (error) {
            this.onLog(`❌ Order fill failed: ${error instanceof Error ? error.message : "Unknown"}`);
        }
    }

    private async createCounterOrder(filledOrder: GridOrder) {
        // After a buy, create a sell order slightly higher
        // After a sell, create a buy order slightly lower
        const priceOffset = 0.00001; // Small profit margin
        const newPrice = filledOrder.side === "buy"
            ? filledOrder.price + priceOffset
            : filledOrder.price - priceOffset;

        const newOrder: GridOrder = {
            level: filledOrder.level,
            price: newPrice,
            side: filledOrder.side === "buy" ? "sell" : "buy",
            amount: filledOrder.amount,
            filled: false
        };

        this.orders.push(newOrder);
        this.stats.activeOrders++;
        this.onLog(`🔄 Created counter-order: ${newOrder.side.toUpperCase()} at ${newOrder.price.toFixed(6)}`);
    }

    getStats(): GridBotStats {
        return { ...this.stats };
    }
}
