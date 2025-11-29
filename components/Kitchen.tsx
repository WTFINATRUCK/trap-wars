"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { ClientWalletMultiButton } from "./ClientWalletMultiButton";
import { useState, useEffect } from "react";
import Link from "next/link";
import DopeWarsGame from "./DopeWarsGame";
import InstructionsModal from "./InstructionsModal";
import { getReferralStats, getReferralLink, checkAndRegisterReferralFromUrl } from "@/lib/referralUtils";

interface KitchenProps {
    initialTab?: "game" | "leaderboard" | "vault";
}

export default function Kitchen({ initialTab = "game" }: KitchenProps) {
    const { publicKey } = useWallet();
    const [activeTab, setActiveTab] = useState<"game" | "leaderboard" | "vault">(initialTab);
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const [stakedAmount, setStakedAmount] = useState(0);
    const [showInstructions, setShowInstructions] = useState(false);
    const [referralStats, setReferralStats] = useState<any>(null);

    useEffect(() => {
        if (publicKey) {
            const saved = localStorage.getItem(`trapwars_${publicKey.toString()}`);
            setHasSavedGame(!!saved);
            if (saved) {
                const parsed = JSON.parse(saved);
                setStakedAmount(parsed.stakedAmount || 0);
            }

            // Check for referral code in URL
            checkAndRegisterReferralFromUrl(publicKey.toString());

            // Load referral stats
            const stats = getReferralStats(publicKey.toString());
            setReferralStats(stats);
        }
    }, [publicKey, activeTab]); // Re-read when tab changes to ensure fresh data

    const handleGameOver = (score: number) => {
        // Refresh staked amount after game over
        if (publicKey) {
            const saved = localStorage.getItem(`trapwars_${publicKey.toString()}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                setStakedAmount(parsed.stakedAmount || 0);
            }
        }
    };

    // Mock leaderboard data
    const leaderboard = [
        { rank: 1, address: "7X...3f", score: 15000 },
        { rank: 2, address: "9A...2b", score: 12400 },
        { rank: 3, address: "3C...1a", score: 9800 },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
            <nav className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        TRAP WARS
                    </h1>
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-colors uppercase tracking-wide"
                    >
                        📖 How to Play
                    </button>
                    <Link href="/admin" className="text-xs text-gray-600 hover:text-purple-400 transition-colors uppercase tracking-widest">
                        [Admin]
                    </Link>
                </div>
                <ClientWalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-all" />
            </nav>

            <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />

            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {!publicKey ? (
                    <div className="min-h-[600px] flex items-center justify-center">
                        <div className="text-center space-y-6 p-12 rounded-3xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30">
                            <h2 className="text-5xl font-bold mb-4">🎮 Welcome to Trap Wars</h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                                The classic Dope Wars game reimagined on Solana. Travel the streets, hustle products, dodge the cops, and climb the leaderboard!
                            </p>
                            <div className="text-gray-400 space-y-2 mb-8">
                                <p>💰 30 days to make your fortune</p>
                                <p>🚕 Travel between 6 NYC boroughs</p>
                                <p>📦 Buy low, sell high, manage inventory</p>
                                <p>🎲 Random events keep you on your toes</p>
                            </div>
                            <div className="p-6 bg-black/50 rounded-xl border border-yellow-500/30">
                                <p className="text-yellow-400 font-bold mb-3">👆 Connect your wallet to start playing</p>
                                <p className="text-sm text-gray-500">Your game progress is saved to your wallet address</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <section>
                            <div className="flex justify-between items-end mb-6 border-b border-gray-800">
                                <div className="flex gap-6">
                                    <h2
                                        onClick={() => setActiveTab("game")}
                                        className={`text-2xl font-bold pb-2 border-b-2 cursor-pointer transition-colors ${activeTab === "game"
                                            ? "border-purple-500 text-white"
                                            : "border-transparent text-gray-500 hover:text-white hover:border-purple-500"
                                            }`}
                                    >
                                        🎮 {hasSavedGame ? "Resume Game" : "Start Game"}
                                    </h2>
                                    <h2
                                        onClick={() => setActiveTab("leaderboard")}
                                        className={`text-2xl font-bold pb-2 border-b-2 cursor-pointer transition-colors ${activeTab === "leaderboard"
                                            ? "border-purple-500 text-white"
                                            : "border-transparent text-gray-500 hover:text-white hover:border-purple-500"
                                            }`}
                                    >
                                        🏆 Leaderboard
                                    </h2>
                                    <h2
                                        onClick={() => setActiveTab("vault")}
                                        className={`text-2xl font-bold pb-2 border-b-2 cursor-pointer transition-colors ${activeTab === "vault"
                                            ? "border-purple-500 text-white"
                                            : "border-transparent text-gray-500 hover:text-white hover:border-purple-500"
                                            }`}
                                    >
                                        💰 Vault
                                    </h2>
                                </div>
                            </div>

                            {/* Game Tab */}
                            {activeTab === "game" && (
                                <DopeWarsGame wallet={publicKey.toString()} onGameOver={handleGameOver} />
                            )}

                            {/* Leaderboard Tab */}
                            {activeTab === "leaderboard" && (
                                <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-900 text-gray-400 text-sm uppercase">
                                            <tr>
                                                <th className="p-4 font-medium">Rank</th>
                                                <th className="p-4 font-medium">Player</th>
                                                <th className="p-4 font-medium text-right">High Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {leaderboard.map((player) => (
                                                <tr key={player.rank} className="hover:bg-gray-800/50 transition-colors">
                                                    <td className="p-4 font-bold text-purple-400">#{player.rank}</td>
                                                    <td className="p-4 font-mono text-gray-300">{player.address}</td>
                                                    <td className="p-4 text-right font-mono font-bold text-green-400">${player.score.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Vault Tab */}
                            {activeTab === "vault" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
                                        <h3 className="text-xl font-bold mb-4">Stake $TRAP</h3>
                                        <div className="flex justify-between mb-4">
                                            <span className="text-gray-400">Wallet Balance</span>
                                            <span className="font-mono">1,000 $TRAP</span>
                                        </div>
                                        <div className="flex gap-2 mb-4">
                                            <input type="number" placeholder="Amount" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
                                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-lg font-bold transition-all">STAKE</button>
                                        </div>
                                        <p className="text-xs text-gray-500">Lock your $TRAP to earn daily yield.</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
                                        <h3 className="text-xl font-bold mb-4">Your Vault</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Total Staked</span>
                                                <span className="font-mono text-xl text-white">${stakedAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Unclaimed Yield</span>
                                                <span className="font-mono text-xl text-green-400">0.00 $TRAP</span>
                                            </div>
                                            <button className="w-full py-3 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all font-bold">
                                                CLAIM REWARDS
                                            </button>
                                        </div>
                                    </div>

                                    {/* Referral Panel */}
                                    {referralStats && (
                                        <div className="col-span-1 md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30">
                                            <h3 className="text-2xl font-bold mb-4 text-green-400">🤝 Your Referral Program</h3>
                                            <p className="text-sm text-gray-400 mb-4">Earn 0.5% of your referred players' activity when they stake $100+</p>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                                                    <p className="text-xs text-gray-500 mb-1">Total Referrals</p>
                                                    <p className="text-2xl font-bold text-white">{referralStats.totalReferrals}</p>
                                                </div>
                                                <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                                                    <p className="text-xs text-gray-500 mb-1">Active Referrals</p>
                                                    <p className="text-2xl font-bold text-green-400">{referralStats.activeReferrals}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Staking $100+</p>
                                                </div>
                                                <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                                                    <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                                                    <p className="text-2xl font-bold text-yellow-400">${referralStats.totalEarnings.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-black/40 rounded-xl border border-gray-700">
                                                <p className="text-sm font-bold text-gray-300 mb-2">Your Referral Link</p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={getReferralLink(referralStats.referralCode)}
                                                        readOnly
                                                        className="flex-grow bg-black border border-gray-600 rounded-lg px-3 py-2 text-sm font-mono text-gray-300"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(getReferralLink(referralStats.referralCode));
                                                            alert("Referral link copied to clipboard!");
                                                        }}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-all"
                                                    >
                                                        📋 Copy
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">Share this link to earn 0.5% of your friends' game activity!</p>
                                            </div>

                                            {referralStats.referredBy && (
                                                <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                                                    <p className="text-xs text-purple-400">
                                                        👥 You were referred by: <span className="font-mono">{referralStats.referredBy.slice(0, 8)}...</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
