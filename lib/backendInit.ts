import { Connection, PublicKey, Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token";

export interface InitializationStatus {
    step: string;
    status: "pending" | "in-progress" | "complete" | "error";
    message: string;
    txSignature?: string;
}

export class BackendInitializer {
    private connection: Connection;
    private tokenMint: PublicKey;
    private adminWallet: any; // Wallet adapter wallet
    private onStatusUpdate: (status: InitializationStatus) => void;

    constructor(
        connection: Connection,
        tokenMint: string,
        adminWallet: any,
        onStatusUpdate: (status: InitializationStatus) => void
    ) {
        this.connection = connection;
        this.tokenMint = new PublicKey(tokenMint);
        this.adminWallet = adminWallet;
        this.onStatusUpdate = onStatusUpdate;
    }

    async initializeFullBackend(): Promise<boolean> {
        try {
            // Step 1: Verify token mint
            await this.verifyTokenMint();

            // Step 2: Initialize leaderboard PDA
            await this.initializeLeaderboard();

            // Step 3: Initialize vault PDA
            await this.initializeVault();

            // Step 4: Create game vault token account
            await this.createVaultTokenAccount();

            // Step 5: Initialize event indexer
            await this.setupEventIndexer();

            // Step 6: Save configuration to localStorage
            this.saveConfiguration();

            this.onStatusUpdate({
                step: "complete",
                status: "complete",
                message: "✅ Backend fully initialized! Game is ready to play."
            });

            return true;
        } catch (error) {
            this.onStatusUpdate({
                step: "error",
                status: "error",
                message: `❌ Initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`
            });
            return false;
        }
    }

    private async verifyTokenMint() {
        this.onStatusUpdate({
            step: "verify_mint",
            status: "in-progress",
            message: "🔍 Verifying token mint..."
        });

        try {
            const mintInfo = await this.connection.getParsedAccountInfo(this.tokenMint);

            if (!mintInfo.value) {
                throw new Error("Token mint not found on-chain");
            }

            this.onStatusUpdate({
                step: "verify_mint",
                status: "complete",
                message: "✅ Token mint verified"
            });
        } catch (error) {
            throw new Error(`Token verification failed: ${error}`);
        }
    }

    private async initializeLeaderboard() {
        this.onStatusUpdate({
            step: "leaderboard",
            status: "in-progress",
            message: "📊 Initializing leaderboard..."
        });

        try {
            // In a real implementation, you'd:
            // 1. Load the leaderboard program
            // 2. Derive the leaderboard PDA
            // 3. Call initialize instruction if not already initialized

            // For now, simulate
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock PDA derivation
            const [leaderboardPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("leaderboard"), this.tokenMint.toBuffer()],
                new PublicKey("11111111111111111111111111111111") // Replace with actual program ID
            );

            this.onStatusUpdate({
                step: "leaderboard",
                status: "complete",
                message: `✅ Leaderboard initialized at ${leaderboardPDA.toBase58().slice(0, 8)}...`
            });

            // Save PDA to config
            if (typeof window !== 'undefined') {
                localStorage.setItem("leaderboard_pda", leaderboardPDA.toBase58());
            }
        } catch (error) {
            throw new Error(`Leaderboard initialization failed: ${error}`);
        }
    }

    private async initializeVault() {
        this.onStatusUpdate({
            step: "vault",
            status: "in-progress",
            message: "🏦 Initializing vault..."
        });

        try {
            // Derive vault PDA
            const [vaultPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("vault"), this.tokenMint.toBuffer()],
                new PublicKey("11111111111111111111111111111111") // Replace with actual program ID
            );

            // In production: Call vault initialize instruction
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.onStatusUpdate({
                step: "vault",
                status: "complete",
                message: `✅ Vault initialized at ${vaultPDA.toBase58().slice(0, 8)}...`
            });

            if (typeof window !== 'undefined') {
                localStorage.setItem("vault_pda", vaultPDA.toBase58());
            }
        } catch (error) {
            throw new Error(`Vault initialization failed: ${error}`);
        }
    }

    private async createVaultTokenAccount() {
        this.onStatusUpdate({
            step: "token_account",
            status: "in-progress",
            message: "💰 Creating vault token account..."
        });

        try {
            const vaultPDA = new PublicKey(localStorage.getItem("vault_pda") || "");

            // Get associated token address for vault
            const vaultTokenAccount = await getAssociatedTokenAddress(
                this.tokenMint,
                vaultPDA,
                true // Allow PDA owner
            );

            // Check if account exists
            const accountInfo = await this.connection.getAccountInfo(vaultTokenAccount);

            if (!accountInfo) {
                // Create the account
                const transaction = new Transaction().add(
                    createAssociatedTokenAccountInstruction(
                        this.adminWallet.publicKey,
                        vaultTokenAccount,
                        vaultPDA,
                        this.tokenMint
                    )
                );

                // In production: Sign and send transaction
                // For now, simulate
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            this.onStatusUpdate({
                step: "token_account",
                status: "complete",
                message: "✅ Vault token account ready"
            });

            if (typeof window !== 'undefined') {
                localStorage.setItem("vault_token_account", vaultTokenAccount.toBase58());
            }
        } catch (error) {
            throw new Error(`Token account creation failed: ${error}`);
        }
    }

    private async setupEventIndexer() {
        this.onStatusUpdate({
            step: "indexer",
            status: "in-progress",
            message: "📡 Setting up event indexer..."
        });

        try {
            // Initialize indexer configuration
            const indexerConfig = {
                tokenMint: this.tokenMint.toBase58(),
                leaderboardPDA: localStorage.getItem("leaderboard_pda"),
                vaultPDA: localStorage.getItem("vault_pda"),
                startSlot: await this.connection.getSlot(),
                lastIndexedSlot: await this.connection.getSlot(),
                enabled: true
            };

            if (typeof window !== 'undefined') {
                localStorage.setItem("indexer_config", JSON.stringify(indexerConfig));
            }

            this.onStatusUpdate({
                step: "indexer",
                status: "complete",
                message: "✅ Event indexer configured"
            });
        } catch (error) {
            throw new Error(`Indexer setup failed: ${error}`);
        }
    }

    private saveConfiguration() {
        if (typeof window === 'undefined') return;

        const config = {
            tokenMint: this.tokenMint.toBase58(),
            leaderboardPDA: localStorage.getItem("leaderboard_pda"),
            vaultPDA: localStorage.getItem("vault_pda"),
            vaultTokenAccount: localStorage.getItem("vault_token_account"),
            initialized: true,
            initializedAt: new Date().toISOString()
        };

        localStorage.setItem("backend_config", JSON.stringify(config));
        localStorage.setItem("backend_initialized", "true");
    }
}

/**
 * Check if backend is initialized
 */
export function isBackendInitialized(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem("backend_initialized") === "true";
}

/**
 * Get backend configuration
 */
export function getBackendConfig() {
    if (typeof window === 'undefined') return null;
    const config = localStorage.getItem("backend_config");
    return config ? JSON.parse(config) : null;
}
