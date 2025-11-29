import { Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token";

// Token addresses
export const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // USDC mainnet

// Dynamic TRAP Mint Management
export const DEFAULT_TRAP_MINT = "TRAP_TOKEN_MINT_ADDRESS_HERE";

export function getTrapMint(): PublicKey {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem("trap_mint_address");
        if (stored) {
            try {
                return new PublicKey(stored);
            } catch (e) {
                console.error("Invalid stored mint address", e);
            }
        }
    }
    // Fallback or placeholder if not set
    try {
        return new PublicKey(DEFAULT_TRAP_MINT);
    } catch {
        return PublicKey.default; // Return default if placeholder is invalid
    }
}

export function saveTrapMint(address: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem("trap_mint_address", address);
    }
}

// Game constants
export const HOUSE_EDGE = 0.05; // 5% fee on sells
export const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com"; // Use your RPC

export interface SwapQuote {
    inputAmount: number;
    outputAmount: number;
    priceImpact: number;
}

/**
 * Get swap quote from Jupiter
 */
/**
 * Get swap quote from Jupiter (Raw Response)
 */
export async function getQuote(
    inputMint: string,
    outputMint: string,
    amount: number
): Promise<any> {
    const input = inputMint === "SOL" ? "So11111111111111111111111111111111111111112" : inputMint;
    const output = outputMint === "SOL" ? "So11111111111111111111111111111111111111112" : outputMint;

    try {
        const response = await fetch(
            `https://quote-api.jup.ag/v6/quote?inputMint=${input}&outputMint=${output}&amount=${amount}&slippageBps=50`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting swap quote:", error);
        return null;
    }
}

/**
 * Get Swap Transaction Base64 (for signing)
 */
export async function getSwapTransaction(
    quoteResponse: any,
    userPublicKey: string
): Promise<string | null> {
    try {
        const response = await fetch("https://quote-api.jup.ag/v6/swap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey,
                wrapAndUnwrapSol: true,
            }),
        });
        const data = await response.json();
        return data.swapTransaction;
    } catch (error) {
        console.error("Error getting swap transaction:", error);
        return null;
    }
}

/**
 * Execute swap via Jupiter (Wallet Adapter)
 */
export async function executeSwap(
    connection: Connection,
    wallet: any,
    inputMint: PublicKey,
    outputMint: PublicKey,
    amount: number
): Promise<string> {
    try {
        // Get quote
        const quoteData = await getQuote(inputMint.toString(), outputMint.toString(), amount);
        if (!quoteData) throw new Error("Failed to get quote");

        // Get swap transaction
        const swapTransactionBase64 = await getSwapTransaction(quoteData, wallet.publicKey.toString());
        if (!swapTransactionBase64) throw new Error("Failed to get swap transaction");

        // Deserialize and sign transaction
        const swapTransactionBuf = Buffer.from(swapTransactionBase64, "base64");
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        const signed = await wallet.signTransaction(transaction);

        // Send transaction
        const txid = await connection.sendRawTransaction(signed.serialize());
        await connection.confirmTransaction(txid);

        return txid;
    } catch (error) {
        console.error("Error executing swap:", error);
        throw new Error("Swap failed");
    }
}

/**
 * Transfer SPL tokens (for TRAP/USDC)
 */
export async function transferTokens(
    connection: Connection,
    wallet: any,
    mint: PublicKey,
    recipient: PublicKey,
    amount: number
): Promise<string> {
    try {
        const fromTokenAccount = await getAssociatedTokenAddress(mint, wallet.publicKey);
        const toTokenAccount = await getAssociatedTokenAddress(mint, recipient);

        const transaction = new Transaction().add(
            createTransferInstruction(
                fromTokenAccount,
                toTokenAccount,
                wallet.publicKey,
                amount
            )
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;

        const signed = await wallet.signTransaction(transaction);
        const txid = await connection.sendRawTransaction(signed.serialize());
        await connection.confirmTransaction(txid);

        return txid;
    } catch (error) {
        console.error("Error transferring tokens:", error);
        throw new Error("Transfer failed");
    }
}

/**
 * Get token balance
 */
export async function getTokenBalance(
    connection: Connection,
    wallet: PublicKey,
    mint: PublicKey
): Promise<number> {
    try {
        const tokenAccount = await getAssociatedTokenAddress(mint, wallet);
        const balance = await connection.getTokenAccountBalance(tokenAccount);
        return parseInt(balance.value.amount);
    } catch (error) {
        console.error("Error getting token balance:", error);
        return 0;
    }
}

/**
 * Get SOL balance
 */
export async function getSolBalance(
    connection: Connection,
    wallet: PublicKey
): Promise<number> {
    try {
        const balance = await connection.getBalance(wallet);
        return balance;
    } catch (error) {
        console.error("Error getting SOL balance:", error);
        return 0;
    }
}
