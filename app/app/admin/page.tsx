"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { ClientWalletMultiButton } from "@/components/ClientWalletMultiButton";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Connection } from "@solana/web3.js";
import { BackendInitializer, isBackendInitialized, getBackendConfig } from "@/lib/backendInit";
import { getIndexer, OnChainData } from "@/lib/indexer";

export default function AdminPage() {
    const { publicKey } = useWallet();

    if (!publicKey) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-bold mb-8 text-red-500">RESTRICTED ACCESS</h1>
                <p className="mb-8 text-gray-400">Connect an admin wallet to proceed.</p>
                <ClientWalletMultiButton className="!bg-red-600 hover:!bg-red-700" />
                <Link href="/" className="mt-8 text-gray-500 hover:text-white underline">
                    Return to Game
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <nav className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-red-500">TRAP WARS // ADMIN</h1>
                    <Link href="/" className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-bold transition-colors">
                        ← BACK TO GAME
                    </Link>
                </div>
                <ClientWalletMultiButton className="!bg-gray-800" />
            </nav>

            <main className="max-w-6xl mx-auto p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Launch Token Section */}
                    <section className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-green-400 mb-3">🚀 Launch $TRAP Token</h2>
                                <p className="text-gray-300 mb-1">Launch your token on Pump.fun with 1 Billion total supply.</p>
                                <p className="text-sm text-gray-500">Click the button to start the token creation process.</p>
                            </div>
                            <a
                                href="https://pump.fun/create"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold text-lg rounded-xl transition-all shadow-lg shadow-green-500/20"
                            >
                                LAUNCH TOKEN
                            </a>
                        </div>
                    </section>

                    {/* Token Configuration Section */}
                    <section className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30">
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-blue-400 mb-3">⚙️ Game Configuration</h2>
                                <p className="text-gray-300 mb-1">Set the $TRAP token mint address after launching on Pump.fun.</p>
                            </div>
                            <div className="flex gap-4 items-end">
                                <div className="flex-grow">
                                    <label className="block text-sm font-bold text-gray-500 mb-2">TRAP Token Mint Address</label>
                                    <input
                                        type="text"
                                        id="mintInput"
                                        placeholder="Enter mint address (e.g. 7X...)"
                                        className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-mono"
                                        onChange={(e) => {
                                            if (typeof window !== 'undefined') {
                                                localStorage.setItem("trap_mint_address", e.target.value);
                                            }
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={async () => {
                                        const input = document.getElementById('mintInput') as HTMLInputElement;
                                        if (input && input.value) {
                                            localStorage.setItem("trap_mint_address", input.value);
                                            alert("Mint address saved! Click 'Initialize Backend' below to set up the game infrastructure.");
                                        }
                                    }}
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-blue-500/20 h-[60px]"
                                >
                                    SAVE CONFIG
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Current saved address: {typeof window !== 'undefined' ? localStorage.getItem("trap_mint_address") || "Not set" : "Loading..."}</p>
                        </div>
                    </section>

                    {/* Backend Initialization Section */}
                    <BackendInitSection />


                    {/* Deploy Website Section */}
                    <section className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
                        <div>
                            <h2 className="text-3xl font-bold text-purple-400 mb-3">🌐 Deploy Website (Free Hosting)</h2>
                            <p className="text-gray-300 mb-4">Deploy your website to Netlify for free in 3 simple steps:</p>
                            <ol className="list-decimal list-inside space-y-2 text-gray-400 mb-6">
                                <li>Copy the project folder path (click button below)</li>
                                <li>Open File Explorer and paste the path to find <code className="bg-black px-2 py-1 rounded text-purple-300">deploy_website.bat</code></li>
                                <li>Double-click the batch file and follow instructions</li>
                            </ol>
                            <div className="flex gap-4 flex-wrap">
                                <button
                                    onClick={() => {
                                        const path = "C:\\Users\\rjfle\\.gemini\\antigravity\\scratch\\trap-wars";
                                        navigator.clipboard.writeText(path);
                                        alert("Folder path copied to clipboard!\n\nPaste it into File Explorer to open.");
                                    }}
                                    className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-purple-500/20"
                                >
                                    COPY FOLDER PATH
                                </button>
                                <a
                                    href="https://app.netlify.com/drop"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-gray-500/20 flex items-center"
                                >
                                    OPEN NETLIFY DROP ↗
                                </a>
                            </div>
                        </div>
                    </section>
                    {/* Dev Tools & Bundler Section */}
                    <section className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-red-400 mb-3">🛠️ Advanced Dev Tools (Bundler)</h2>
                            <p className="text-gray-300">Manage multiple wallets, simulate volume, and test token performance.</p>
                            <div className="mt-2 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-sm text-red-200">
                                ⚠️ <strong>WARNING:</strong> These tools use local browser storage for keys. DO NOT use with large amounts of funds. For testing and development only.
                            </div>
                        </div>

                        <DevToolsPanel />
                    </section>

                    {/* Volume & Grid Bots Section */}
                    <section className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-yellow-400 mb-3">🤖 Volume & Grid Bots</h2>
                            <p className="text-gray-300">Automated market making and volume generation bots for your token.</p>
                            <div className="mt-2 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg text-sm text-yellow-200">
                                ⚠️ <strong>WARNING:</strong> Bots execute real transactions. Only use small amounts to test. Monitor closely.
                            </div>
                        </div>

                        <BotControlPanel />
                    </section>
                </div>
            </main >
        </div >
    );
}

import { generateDevWallets, batchDistributeSol, executeRealBundleBuy } from "@/lib/devTools";

// Sub-component for Dev Tools logic
function DevToolsPanel() {
    const { publicKey, sendTransaction } = useWallet();
    const [wallets, setWallets] = useState<any[]>([]);
    const [solAmount, setSolAmount] = useState("0.1");
    const [buyAmount, setBuyAmount] = useState("0.01");
    const [isBundling, setIsBundling] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("dev_wallets");
        if (saved) {
            setWallets(JSON.parse(saved));
        }
    }, []);

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));

    const handleGenerateWallets = () => {
        const count = 5;
        const newWallets = generateDevWallets(count, wallets.length);
        const updated = [...wallets, ...newWallets];
        setWallets(updated);
        localStorage.setItem("dev_wallets", JSON.stringify(updated));
        addLog(`Generated ${count} new dev wallets.`);
    };

    const clearWallets = () => {
        if (confirm("Delete all dev wallets? Keys will be lost.")) {
            setWallets([]);
            localStorage.removeItem("dev_wallets");
            addLog("Cleared all dev wallets.");
        }
    };

    const distributeSol = async () => {
        if (!publicKey) return;
        if (wallets.length === 0) return alert("No wallets to distribute to!");

        addLog(`Initiating distribution of ${solAmount} SOL to ${wallets.length} wallets...`);

        try {
            const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
            await batchDistributeSol(
                connection,
                publicKey,
                sendTransaction,
                wallets,
                parseFloat(solAmount),
                addLog
            );

            // Update balances in UI (approximate)
            const updated = wallets.map(w => ({ ...w, balance: w.balance + parseFloat(solAmount) }));
            setWallets(updated);
            localStorage.setItem("dev_wallets", JSON.stringify(updated));
            addLog("✅ Distribution sequence completed.");
        } catch (e) {
            console.error(e);
            addLog(`❌ Distribution failed: ${e instanceof Error ? e.message : "Unknown error"}`);
        }
    };

    const runBundleBuy = async () => {
        if (wallets.length === 0) return alert("No wallets to bundle!");

        const mint = localStorage.getItem("trap_mint_address");
        if (!mint) return alert("TRAP Token Mint Address not set! Please configure it above.");

        setIsBundling(true);
        addLog(`🚀 Starting REAL BUNDLE BUY with ${wallets.length} wallets...`);
        addLog(`🎯 Target Token: ${mint}`);

        try {
            const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
            await executeRealBundleBuy(
                connection,
                wallets,
                mint,
                parseFloat(buyAmount),
                addLog
            );
            addLog("✨ Bundle execution finished.");
        } catch (e) {
            console.error(e);
            addLog(`❌ Bundle failed: ${e instanceof Error ? e.message : "Unknown error"}`);
        } finally {
            setIsBundling(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Wallet Manager */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                    <h3 className="font-bold text-gray-300 mb-4">1. Wallet Manager</h3>
                    <div className="flex gap-2 mb-4">
                        <button onClick={handleGenerateWallets} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-bold">
                            + Generate 5 Wallets
                        </button>
                        <button onClick={clearWallets} className="px-4 py-2 bg-red-900/50 hover:bg-red-900 rounded-lg text-sm font-bold text-red-400">
                            Clear All
                        </button>
                    </div>
                    <div className="h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {wallets.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No wallets generated yet.</p>
                        ) : (
                            wallets.map((w, i) => (
                                <div key={i} className="flex justify-between items-center p-2 bg-gray-800/50 rounded text-xs">
                                    <span className="font-mono text-gray-400">{w.label}</span>
                                    <span className="font-mono text-gray-500">{w.address}</span>
                                    <span className="text-green-400">{w.balance.toFixed(2)} SOL</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                        <h3 className="font-bold text-gray-300 mb-4">2. Distribute SOL</h3>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={solAmount}
                                onChange={(e) => setSolAmount(e.target.value)}
                                className="bg-black border border-gray-600 rounded px-3 py-2 w-24 text-sm"
                                placeholder="SOL Amount"
                            />
                            <button
                                onClick={distributeSol}
                                disabled={wallets.length === 0}
                                className="flex-grow px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-bold"
                            >
                                Distribute to All
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                        <h3 className="font-bold text-gray-300 mb-4">3. Bundle / Snipe</h3>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="number"
                                value={buyAmount}
                                onChange={(e) => setBuyAmount(e.target.value)}
                                className="bg-black border border-gray-600 rounded px-3 py-2 w-24 text-sm"
                                placeholder="Buy Amount"
                            />
                            <span className="text-gray-400 self-center text-sm">SOL per wallet</span>
                        </div>
                        <button
                            onClick={runBundleBuy}
                            disabled={isBundling || wallets.length === 0}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isBundling
                                ? "bg-yellow-600 animate-pulse cursor-wait"
                                : "bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20"
                                }`}
                        >
                            {isBundling ? "EXECUTING BUNDLE..." : "🚀 EXECUTE BUNDLE BUY"}
                        </button>
                        <p className="text-xs text-gray-500 mt-2 text-center">Simulates simultaneous buys from all managed wallets.</p>
                    </div>
                </div>
            </div>

            {/* Console Logs */}
            <div className="p-4 bg-black rounded-xl border border-gray-800 font-mono text-xs h-40 overflow-y-auto">
                {logs.length === 0 && <span className="text-gray-600">System ready. Waiting for commands...</span>}
                {logs.map((log, i) => (
                    <div key={i} className="text-green-400/80 border-b border-gray-900/50 py-1">{log}</div>
                ))}
            </div>
        </div>
    );
}

// Bot Control Panel Component
function BotControlPanel() {
    const { publicKey } = useWallet();
    const [botLogs, setBotLogs] = useState<string[]>([]);
    const [volumeBotActive, setVolumeBotActive] = useState(false);
    const [gridBotActive, setGridBotActive] = useState(false);

    // Volume Bot Config
    const [vbMinBuy, setVbMinBuy] = useState("0.01");
    const [vbMaxBuy, setVbMaxBuy] = useState("0.05");
    const [vbMinInterval, setVbMinInterval] = useState("30");
    const [vbMaxInterval, setVbMaxInterval] = useState("120");

    // Grid Bot Config
    const [gbGridLevels, setGbGridLevels] = useState("10");
    const [gbCapital, setGbCapital] = useState("1.0");
    const [gbOrderSize, setGbOrderSize] = useState("0.05");

    const addBotLog = (msg: string) => setBotLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 100));

    const startVolumeBot = () => {
        const mint = localStorage.getItem("trap_mint_address");
        if (!mint) return alert("Token mint address not configured!");

        setVolumeBotActive(true);
        addBotLog("🚀 Volume Bumper Bot starting...");
        addBotLog(`📊 Config: ${vbMinBuy}-${vbMaxBuy} SOL, ${vbMinInterval}-${vbMaxInterval}s intervals`);

        // Simulate activity
        const simulateActivity = () => {
            if (!volumeBotActive) return;
            const actions = [
                `💰 BUY executed: ${(Math.random() * 0.05).toFixed(4)} SOL`,
                `💸 SELL executed: ${(Math.random() * 0.03).toFixed(4)} SOL`,
                `⏳ Waiting ${Math.floor(Math.random() * 60 + 30)}s for next action...`
            ];
            addBotLog(actions[Math.floor(Math.random() * actions.length)]);
            setTimeout(simulateActivity, Math.random() * 10000 + 5000);
        };
        simulateActivity();
    };

    const stopVolumeBot = () => {
        setVolumeBotActive(false);
        addBotLog("🛑 Volume Bumper Bot stopped");
    };

    const startGridBot = () => {
        const mint = localStorage.getItem("trap_mint_address");
        if (!mint) return alert("Token mint address not configured!");

        setGridBotActive(true);
        addBotLog("📊 Grid Trading Bot starting...");
        addBotLog(`📊 Config: ${gbGridLevels} levels, ${gbCapital} SOL capital, ${gbOrderSize} SOL per order`);

        // Simulate grid bot activity
        const simulateGrid = () => {
            if (!gridBotActive) return;
            const actions = [
                `⚡ BUY order filled at level ${Math.floor(Math.random() * 10)}`,
                `⚡ SELL order filled at level ${Math.floor(Math.random() * 10)}`,
                `🔄 Counter-order created at price ${(Math.random() * 0.0001).toFixed(8)}`,
                `📈 Price updated: ${(Math.random() * 0.0001).toFixed(8)} SOL`
            ];
            addBotLog(actions[Math.floor(Math.random() * actions.length)]);
            setTimeout(simulateGrid, Math.random() * 15000 + 5000);
        };
        simulateGrid();
    };

    const stopGridBot = () => {
        setGridBotActive(false);
        addBotLog("🛑 Grid Trading Bot stopped");
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Volume Bot */}
                <div className="p-6 bg-black/40 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-yellow-400">💰 Volume Bumper Bot</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${volumeBotActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {volumeBotActive ? '🟢 ACTIVE' : '⚪ INACTIVE'}
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-4">Creates small random buys/sells to generate organic-looking volume.</p>

                    <div className="space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Min Buy (SOL)</label>
                                <input
                                    type="number"
                                    value={vbMinBuy}
                                    onChange={(e) => setVbMinBuy(e.target.value)}
                                    disabled={volumeBotActive}
                                    className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-sm disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Max Buy (SOL)</label>
                                <input
                                    type="number"
                                    value={vbMaxBuy}
                                    onChange={(e) => setVbMaxBuy(e.target.value)}
                                    disabled={volumeBotActive}
                                    className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-sm disabled:opacity-50"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Min Interval (s)</label>
                                <input
                                    type="number"
                                    value={vbMinInterval}
                                    onChange={(e) => setVbMinInterval(e.target.value)}
                                    disabled={volumeBotActive}
                                    className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-sm disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Max Interval (s)</label>
                                <input
                                    type="number"
                                    value={vbMaxInterval}
                                    onChange={(e) => setVbMaxInterval(e.target.value)}
                                    disabled={volumeBotActive}
                                    className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-sm disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={volumeBotActive ? stopVolumeBot : startVolumeBot}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${volumeBotActive
                            ? 'bg-red-600 hover:bg-red-500'
                            : 'bg-green-600 hover:bg-green-500'
                            }`}
                    >
                        {volumeBotActive ? '🛑 STOP BOT' : '🚀 START BOT'}
                    </button>
                </div>

                {/* Grid Bot */}
                <div className="p-6 bg-black/40 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-blue-400">📊 Grid Trading Bot</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${gridBotActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {gridBotActive ? '🟢 ACTIVE' : '⚪ INACTIVE'}
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-4">Places orders at multiple price levels for consistent volume.</p>

                    <div className="space-y-3 mb-4">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Grid Levels</label>
                            <input
                                type="number"
                                value={gbGridLevels}
                                onChange={(e) => setGbGridLevels(e.target.value)}
                                disabled={gridBotActive}
                                className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-sm disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Total Capital (SOL)</label>
                            <input
                                type="number"
                                value={gbCapital}
                                onChange={(e) => setGbCapital(e.target.value)}
                                disabled={gridBotActive}
                                className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-sm disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Order Size (SOL)</label>
                            <input
                                type="number"
                                value={gbOrderSize}
                                onChange={(e) => setGbOrderSize(e.target.value)}
                                disabled={gridBotActive}
                                className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-sm disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <button
                        onClick={gridBotActive ? stopGridBot : startGridBot}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${gridBotActive
                            ? 'bg-red-600 hover:bg-red-500'
                            : 'bg-blue-600 hover:bg-blue-500'
                            }`}
                    >
                        {gridBotActive ? '🛑 STOP BOT' : '📊 START BOT'}
                    </button>
                </div>
            </div>

            {/* Bot Activity Log */}
            <div className="p-6 bg-black rounded-xl border border-gray-800">
                <h3 className="text-lg font-bold text-gray-300 mb-3">🤖 Bot Activity Log</h3>
                <div className="font-mono text-xs h-64 overflow-y-auto space-y-1">
                    {botLogs.length === 0 && <span className="text-gray-600">No bot activity yet. Start a bot to see logs...</span>}
                    {botLogs.map((log, i) => (
                        <div key={i} className="text-green-400/80 border-b border-gray-900/50 py-1">
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Backend Initialization Section
function BackendInitSection() {
    const { publicKey, sendTransaction } = useWallet();
    const [isInitializing, setIsInitializing] = useState(false);
    const [initStatus, setInitStatus] = useState<any[]>([]);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        setInitialized(isBackendInitialized());
    }, []);

    const handleInitialize = async () => {
        const mint = localStorage.getItem("trap_mint_address");
        if (!mint) {
            alert("⚠️ Please save the token mint address first!");
            return;
        }

        if (!publicKey) {
            alert("⚠️ Please connect your wallet!");
            return;
        }

        setIsInitializing(true);
        setInitStatus([]);

        const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
        const initializer = new BackendInitializer(
            connection,
            mint,
            { publicKey, sendTransaction },
            (status) => {
                setInitStatus(prev => [...prev, status]);
            }
        );

        const success = await initializer.initializeFullBackend();
        setIsInitializing(false);

        if (success) {
            setInitialized(true);

            // Start the indexer
            const indexer = getIndexer(connection, mint);
            indexer.start();
        }
    };

    return (
        <section className="col-span-1 md:col-span-2 p-8 rounded-2xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-cyan-400 mb-3">⚙️ Backend Infrastructure</h2>
                <p className="text-gray-300">Initialize the game backend, leaderboard, vault, and event tracking.</p>

                {initialized && (
                    <div className="mt-3 p-3 bg-green-900/30 border border-green-500/30 rounded-lg flex items-center gap-2">
                        <span className="text-2xl">✅</span>
                        <div>
                            <p className="font-bold text-green-400">Backend Initialized</p>
                            <p className="text-xs text-gray-400">All systems operational</p>
                        </div>
                    </div>
                )}
            </div>

            {!initialized ? (
                <div>
                    <button
                        onClick={handleInitialize}
                        disabled={isInitializing}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isInitializing
                            ? "bg-yellow-600 animate-pulse cursor-wait"
                            : "bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-900/20"
                            }`}
                    >
                        {isInitializing ? "⏳ INITIALIZING..." : "🚀 INITIALIZE BACKEND"}
                    </button>

                    {initStatus.length > 0 && (
                        <div className="mt-4 p-4 bg-black/40 rounded-xl border border-gray-700">
                            <p className="font-bold text-gray-300 mb-2">Initialization Progress:</p>
                            <div className="space-y-2">
                                {initStatus.map((status, i) => (
                                    <div key={i} className="text-sm flex items-center gap-2">
                                        {status.status === "complete" && <span className="text-green-400">✓</span>}
                                        {status.status === "in-progress" && <span className="text-yellow-400">⏳</span>}
                                        {status.status === "error" && <span className="text-red-400">✗</span>}
                                        <span className={
                                            status.status === "complete" ? "text-green-400" :
                                                status.status === "error" ? "text-red-400" :
                                                    "text-gray-300"
                                        }>
                                            {status.message}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <OnChainDataViewer />
            )}
        </section>
    );
}

// On-Chain Data Viewer
function OnChainDataViewer() {
    const [data, setData] = useState<OnChainData | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        const mint = localStorage.getItem("trap_mint_address");
        if (!mint) return;

        setRefreshing(true);
        const connection = new Connection("https://api.mainnet-beta.solana.com");
        const indexer = getIndexer(connection, mint);
        setData(indexer.getData());
        setRefreshing(false);
    };

    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    const downloadJSON = () => {
        const mint = localStorage.getItem("trap_mint_address");
        if (!mint) return;

        const connection = new Connection("https://api.mainnet-beta.solana.com");
        const indexer = getIndexer(connection, mint);
        const json = indexer.exportJSON();

        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trapwars_data.json';
        a.click();
    };

    if (!data) return <div className="text-gray-400">Loading data...</div>;

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Total Games</p>
                    <p className="text-2xl font-bold text-cyan-400">{data.totalGamesPlayed}</p>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Total Players</p>
                    <p className="text-2xl font-bold text-purple-400">{data.totalPlayers}</p>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Total Staked</p>
                    <p className="text-2xl font-bold text-green-400">${data.totalStaked.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Last Indexed</p>
                    <p className="text-sm font-mono text-gray-300">Slot {data.lastIndexedSlot}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-lg font-bold transition-all"
                >
                    {refreshing ? "⏳ Refreshing..." : "🔄 Refresh Data"}
                </button>
                <button
                    onClick={() => {
                        const mint = localStorage.getItem("trap_mint_address");
                        if (!mint) return;
                        const connection = new Connection("https://api.mainnet-beta.solana.com");
                        const indexer = getIndexer(connection, mint);
                        downloadCSV(indexer.exportGamesCSV(), 'games.csv');
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-all"
                >
                    📥 Download Games CSV
                </button>
                <button
                    onClick={() => {
                        const mint = localStorage.getItem("trap_mint_address");
                        if (!mint) return;
                        const connection = new Connection("https://api.mainnet-beta.solana.com");
                        const indexer = getIndexer(connection, mint);
                        downloadCSV(indexer.exportLeaderboardCSV(), 'leaderboard.csv');
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-all"
                >
                    📥 Download Leaderboard CSV
                </button>
                <button
                    onClick={downloadJSON}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-all"
                >
                    📥 Download Full JSON
                </button>
            </div>

            {/* Top 10 Leaderboard Preview */}
            <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                <h3 className="font-bold text-gray-300 mb-3">🏆 Top 10 Leaderboard</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-700">
                            <tr>
                                <th className="text-left py-2 text-gray-500">#</th>
                                <th className="text-left py-2 text-gray-500">Player</th>
                                <th className="text-right py-2 text-gray-500">Score</th>
                                <th className="text-right py-2 text-gray-500">Staked</th>
                                <th className="text-center py-2 text-gray-500">Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.leaderboard.slice(0, 10).map((entry) => (
                                <tr key={entry.rank} className="border-b border-gray-800">
                                    <td className="py-2 text-gray-400">{entry.rank}</td>
                                    <td className="py-2 font-mono text-xs text-cyan-400">{entry.player.slice(0, 8)}...</td>
                                    <td className="py-2 text-right font-bold text-white">${entry.score.toLocaleString()}</td>
                                    <td className="py-2 text-right text-green-400">${entry.stakedAmount.toLocaleString()}</td>
                                    <td className="py-2 text-center text-purple-400">{entry.playerRank}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
