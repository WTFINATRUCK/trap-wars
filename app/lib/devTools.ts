import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, VersionedTransaction } from "@solana/web3.js";
import { getQuote, getSwapTransaction } from "./tokenUtils";

// Dev/Test Wallet Interface
export interface DevWallet {
    publicKey: string;
    secretKey: string; // JSON string of number[]
    balance: number;
    label: string;
}

// Helper to generate N wallets
export const generateDevWallets = (count: number, startIndex: number = 0): DevWallet[] => {
    const wallets: DevWallet[] = [];
    for (let i = 0; i < count; i++) {
        const kp = Keypair.generate();
        wallets.push({
            publicKey: kp.publicKey.toBase58(),
            secretKey: JSON.stringify(Array.from(kp.secretKey)),
            balance: 0,
            label: `Wallet #${startIndex + i + 1}`
        });
    }
    return wallets;
};

// Batch Distribute SOL (Handles Tx Size Limits)
export const batchDistributeSol = async (
    connection: Connection,
    senderPublicKey: PublicKey,
    sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
    wallets: DevWallet[],
    amountPerWallet: number,
    onLog: (msg: string) => void
) => {
    const BATCH_SIZE = 15; // Safe limit for instructions per tx
    const batches = [];

    for (let i = 0; i < wallets.length; i += BATCH_SIZE) {
        batches.push(wallets.slice(i, i + BATCH_SIZE));
    }

    onLog(`📦 Splitting ${wallets.length} transfers into ${batches.length} transactions...`);

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const transaction = new Transaction();

        batch.forEach(wallet => {
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: senderPublicKey,
                    toPubkey: new PublicKey(wallet.publicKey),
                    lamports: Math.floor(amountPerWallet * LAMPORTS_PER_SOL)
                })
            );
        });

        try {
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "confirmed");
            onLog(`✅ Batch ${i + 1}/${batches.length} confirmed! (Tx: ${signature.slice(0, 8)}...)`);
        } catch (error) {
            console.error(error);
            onLog(`❌ Batch ${i + 1} failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
};

// Execute Real Bundle Buy (Jupiter Swaps)
export const executeRealBundleBuy = async (
    connection: Connection,
    wallets: DevWallet[],
    tokenMint: string,
    amountSol: number,
    onLog: (msg: string) => void
) => {
    const CONCURRENCY = 5; // Process 5 wallets at a time to respect rate limits

    // Helper to process a single wallet
    const processWallet = async (wallet: DevWallet) => {
        try {
            const kp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(wallet.secretKey)));

            // 1. Get Quote
            const quote = await getQuote("SOL", tokenMint, amountSol * LAMPORTS_PER_SOL);
            if (!quote) throw new Error("No quote found");

            // 2. Get Swap Tx
            const swapTxBase64 = await getSwapTransaction(quote, wallet.publicKey);
            if (!swapTxBase64) throw new Error("Failed to build swap tx");

            // 3. Deserialize & Sign
            const swapTxBuf = Buffer.from(swapTxBase64, "base64");
            const transaction = VersionedTransaction.deserialize(swapTxBuf);
            transaction.sign([kp]);

            // 4. Send
            const signature = await connection.sendTransaction(transaction);
            // Don't await confirmation strictly for speed, just send
            onLog(`🚀 ${wallet.label} bought! (Tx: ${signature.slice(0, 8)}...)`);
            return { status: "success", signature };
        } catch (error) {
            onLog(`❌ ${wallet.label} failed: ${error instanceof Error ? error.message : "Unknown error"}`);
            return { status: "error", error };
        }
    };

    // Process in chunks
    for (let i = 0; i < wallets.length; i += CONCURRENCY) {
        const chunk = wallets.slice(i, i + CONCURRENCY);
        onLog(`Processing batch ${Math.floor(i / CONCURRENCY) + 1}...`);
        await Promise.all(chunk.map(w => processWallet(w)));
        // Small delay to be nice to RPC
        await new Promise(resolve => setTimeout(resolve, 500));
    }
};
