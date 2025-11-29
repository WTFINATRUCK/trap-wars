import { Connection, PublicKey } from "@solana/web3.js";

export interface GameCompletionEvent {
    player: string;
    score: number;
    stakedAmount: number;
    rank: string;
    timestamp: number;
    slot: number;
    signature: string;
}

export interface StakingEvent {
    player: string;
    amount: number;
    action: "stake" | "unstake";
    timestamp: number;
    slot: number;
    signature: string;
}

export interface LeaderboardEntry {
    rank: number;
    player: string;
    score: number;
    stakedAmount: number;
    playerRank: string;
    lastUpdated: number;
}

export interface OnChainData {
    games: GameCompletionEvent[];
    stakes: StakingEvent[];
    leaderboard: LeaderboardEntry[];
    totalGamesPlayed: number;
    totalStaked: number;
    totalPlayers: number;
    lastIndexedSlot: number;
}

export class OnChainIndexer {
    private connection: Connection;
    private tokenMint: PublicKey;
    private isRunning: boolean = false;
    private data: OnChainData;
    private pollInterval: any = null;

    constructor(connection: Connection, tokenMint: string) {
        this.connection = connection;
        this.tokenMint = new PublicKey(tokenMint);
        this.data = this.loadFromStorage() || {
            games: [],
            stakes: [],
            leaderboard: [],
            totalGamesPlayed: 0,
            totalStaked: 0,
            totalPlayers: 0,
            lastIndexedSlot: 0
        };
    }

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log("🔍 On-chain indexer started");

        // Index historical data first
        await this.indexHistoricalData();

        // Then poll for new data every 30 seconds
        this.pollInterval = setInterval(() => {
            this.indexNewData();
        }, 30000);
    }

    stop() {
        this.isRunning = false;
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
        console.log("⏸️ On-chain indexer stopped");
    }

    private async indexHistoricalData() {
        console.log("📚 Indexing historical data...");

        try {
            // Get current slot
            const currentSlot = await this.connection.getSlot();

            // In production, you'd:
            // 1. Query program accounts
            // 2. Parse transaction logs
            // 3. Build game/stake events from on-chain data

            // For now, load from localStorage game saves
            if (typeof window !== 'undefined') {
                const players = this.getAllPlayers();

                players.forEach(player => {
                    const gameData = localStorage.getItem(`trapwars_${player}`);
                    if (gameData) {
                        const parsed = JSON.parse(gameData);

                        // Add to leaderboard if game was completed
                        if (parsed.gameOver) {
                            this.addGameCompletion(player, parsed);
                        }

                        // Track staking
                        if (parsed.stakedAmount > 0) {
                            this.addStakeEvent(player, parsed.stakedAmount);
                        }
                    }
                });
            }

            this.data.lastIndexedSlot = currentSlot;
            this.saveToStorage();

            console.log(`✅ Indexed ${this.data.games.length} games, ${this.data.stakes.length} stake events`);
        } catch (error) {
            console.error("❌ Historical indexing failed:", error);
        }
    }

    private async indexNewData() {
        if (!this.isRunning) return;

        try {
            const currentSlot = await this.connection.getSlot();

            // In production: Query for transactions since lastIndexedSlot
            // Parse new game completions, stakes, etc.

            this.data.lastIndexedSlot = currentSlot;
            this.saveToStorage();
        } catch (error) {
            console.error("❌ Indexing error:", error);
        }
    }

    private addGameCompletion(player: string, gameState: any) {
        const existing = this.data.games.find(g => g.player === player);

        if (!existing || existing.score < gameState.finalScore) {
            if (existing) {
                // Remove old entry
                this.data.games = this.data.games.filter(g => g.player !== player);
            }

            this.data.games.push({
                player,
                score: gameState.finalScore,
                stakedAmount: gameState.stakedAmount || 0,
                rank: gameState.rank || "NONE",
                timestamp: Date.now(),
                slot: this.data.lastIndexedSlot,
                signature: "local_" + Math.random().toString(36)
            });

            this.updateLeaderboard();
        }
    }

    private addStakeEvent(player: string, amount: number) {
        this.data.stakes.push({
            player,
            amount,
            action: "stake",
            timestamp: Date.now(),
            slot: this.data.lastIndexedSlot,
            signature: "local_" + Math.random().toString(36)
        });

        this.data.totalStaked += amount;
    }

    private updateLeaderboard() {
        // Sort games by score
        const sorted = [...this.data.games].sort((a, b) => b.score - a.score);

        this.data.leaderboard = sorted.slice(0, 100).map((game, index) => ({
            rank: index + 1,
            player: game.player,
            score: game.score,
            stakedAmount: game.stakedAmount,
            playerRank: game.rank,
            lastUpdated: game.timestamp
        }));

        this.data.totalGamesPlayed = this.data.games.length;
        this.data.totalPlayers = new Set(this.data.games.map(g => g.player)).size;
    }

    private getAllPlayers(): string[] {
        if (typeof window === 'undefined') return [];

        const players: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('trapwars_')) {
                players.push(key.replace('trapwars_', ''));
            }
        }
        return players;
    }

    private saveToStorage() {
        if (typeof window === 'undefined') return;
        localStorage.setItem('onchain_data', JSON.stringify(this.data));
    }

    private loadFromStorage(): OnChainData | null {
        if (typeof window === 'undefined') return null;
        const stored = localStorage.getItem('onchain_data');
        return stored ? JSON.parse(stored) : null;
    }

    /**
     * Get current indexed data
     */
    getData(): OnChainData {
        return { ...this.data };
    }

    /**
     * Export data as CSV
     */
    exportGamesCSV(): string {
        const headers = "Player,Score,Staked Amount,Rank,Timestamp,Slot,Signature\n";
        const rows = this.data.games.map(g =>
            `${g.player},${g.score},${g.stakedAmount},${g.rank},${new Date(g.timestamp).toISOString()},${g.slot},${g.signature}`
        ).join("\n");
        return headers + rows;
    }

    /**
     * Export data as JSON
     */
    exportJSON(): string {
        return JSON.stringify(this.data, null, 2);
    }

    /**
     * Export leaderboard as CSV
     */
    exportLeaderboardCSV(): string {
        const headers = "Rank,Player,Score,Staked Amount,Player Rank,Last Updated\n";
        const rows = this.data.leaderboard.map(l =>
            `${l.rank},${l.player},${l.score},${l.stakedAmount},${l.playerRank},${new Date(l.lastUpdated).toISOString()}`
        ).join("\n");
        return headers + rows;
    }
}

// Singleton instance
let indexerInstance: OnChainIndexer | null = null;

export function getIndexer(connection: Connection, tokenMint: string): OnChainIndexer {
    if (!indexerInstance) {
        indexerInstance = new OnChainIndexer(connection, tokenMint);
    }
    return indexerInstance;
}

export function startIndexer(connection: Connection, tokenMint: string) {
    const indexer = getIndexer(connection, tokenMint);
    indexer.start();
}

export function stopIndexer() {
    if (indexerInstance) {
        indexerInstance.stop();
    }
}
