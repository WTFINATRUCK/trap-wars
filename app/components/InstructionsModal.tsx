import { useState } from "react";

interface InstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
    const [currentPage, setCurrentPage] = useState(0);

    if (!isOpen) return null;

    const pages = [
        {
            title: "🎮 Welcome to TRAP WARS",
            content: (
                <div className="space-y-4">
                    <p className="text-lg">The classic Dope Wars game, reimagined on Solana with real $TRAP token rewards!</p>
                    <div className="space-y-2 text-left">
                        <p><strong>Goal:</strong> Make as much money as possible in 30 days</p>
                        <p><strong>How:</strong> Buy low, sell high, travel between boroughs</p>
                        <p><strong>Win:</strong> Stake your earnings and climb the leaderboard</p>
                    </div>
                </div>
            )
        },
        {
            title: "💰 How to Play",
            content: (
                <div className="space-y-3 text-left">
                    <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                        <p className="font-bold text-purple-400 mb-2">1. Buy Products</p>
                        <p className="text-sm">Purchase products at low prices. Watch for deals!</p>
                    </div>
                    <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                        <p className="font-bold text-blue-400 mb-2">2. Travel</p>
                        <p className="text-sm">Move to different NYC boroughs where prices vary</p>
                    </div>
                    <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                        <p className="font-bold text-green-400 mb-2">3. Sell High</p>
                        <p className="text-sm">Sell your inventory for maximum profit</p>
                    </div>
                    <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                        <p className="font-bold text-yellow-400 mb-2">4. Manage Inventory</p>
                        <p className="text-sm">Your coat has limited space (100 items max)</p>
                    </div>
                </div>
            )
        },
        {
            title: "🎲 Random Events",
            content: (
                <div className="space-y-3 text-left">
                    <p>As you travel, you'll encounter random events:</p>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="text-2xl">💎</span>
                            <div>
                                <p className="font-bold">Find Stash</p>
                                <p className="text-sm text-gray-400">Free products added to inventory!</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-2xl">🚔</span>
                            <div>
                                <p className="font-bold">Police Raid</p>
                                <p className="text-sm text-gray-400">You lose inventory (unless protected by rank)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-2xl">🔫</span>
                            <div>
                                <p className="font-bold">Mugger</p>
                                <p className="text-sm text-gray-400">Lose 15% of cash (unless protected)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-2xl">🔥</span>
                            <div>
                                <p className="font-bold">Market Events</p>
                                <p className="text-sm text-gray-400">Sales (50% off) or demand spikes (2x price)</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "⭐ Rank System",
            content: (
                <div className="space-y-3 text-left">
                    <p>Stake your earnings to unlock ranks and benefits:</p>
                    <div className="space-y-2">
                        <div className="p-2 bg-gray-800 rounded">
                            <p className="font-bold">🐀 Street Rat</p>
                            <p className="text-sm text-gray-400">Stake $100+ • 1.02x sell multiplier • Protect 1 area</p>
                        </div>
                        <div className="p-2 bg-gray-800 rounded">
                            <p className="font-bold">💼 Hustler</p>
                            <p className="text-sm text-gray-400">Stake $500+ • 1.05x sell multiplier • Protect 2 areas</p>
                        </div>
                        <div className="p-2 bg-gray-800 rounded">
                            <p className="font-bold">👑 Kingpin</p>
                            <p className="text-sm text-gray-400">Stake $1,000+ • 1.10x sell multiplier • Protect 3 areas</p>
                        </div>
                        <div className="p-2 bg-gradient-to-r from-purple-900 to-pink-900 rounded">
                            <p className="font-bold">💎 Godfather</p>
                            <p className="text-sm text-gray-300">Stake $5,000+ • 1.20x sell multiplier • Protect 4 areas</p>
                        </div>
                    </div>
                    <p className="text-sm text-yellow-400 mt-4">💡 Higher ranks protect you from police and muggers in specific areas!</p>
                </div>
            )
        },
        {
            title: "🤝 Referral Program",
            content: (
                <div className="space-y-4 text-left">
                    <p className="text-lg font-bold text-green-400">Earn passive income by referring friends!</p>
                    <div className="space-y-3">
                        <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                            <p className="font-bold text-green-400 mb-2">How It Works</p>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                                <li>Share your unique referral link</li>
                                <li>When friends play and stake, you earn 0.5% of their activity</li>
                                <li>Your friend must stake minimum $100 for referral to activate</li>
                                <li>Earnings are paid automatically as they play</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                            <p className="font-bold text-purple-400 mb-2">💡 Pro Tips</p>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                                <li>More active referrals = more passive income</li>
                                <li>Encourage friends to stake for better rewards</li>
                                <li>Build your network for long-term earnings</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "🚀 Ready to Play!",
            content: (
                <div className="space-y-4">
                    <p className="text-lg">You're all set! Here's what to do next:</p>
                    <div className="space-y-3 text-left">
                        <div className="flex items-start gap-3">
                            <span className="text-3xl">1️⃣</span>
                            <div>
                                <p className="font-bold">Start Playing</p>
                                <p className="text-sm text-gray-400">You begin with $2,000 in cash</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-3xl">2️⃣</span>
                            <div>
                                <p className="font-bold">Make Your Fortune</p>
                                <p className="text-sm text-gray-400">You have 30 days to maximize profits</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-3xl">3️⃣</span>
                            <div>
                                <p className="font-bold">Stake & Rank Up</p>
                                <p className="text-sm text-gray-400">Lock earnings to climb the leaderboard</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-3xl">4️⃣</span>
                            <div>
                                <p className="font-bold">Refer Friends</p>
                                <p className="text-sm text-gray-400">Build passive income through referrals</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-yellow-400 mt-6 font-bold">Good luck, hustler! 💰</p>
                </div>
            )
        }
    ];

    const currentPageData = pages[currentPage];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-purple-500/50 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-500/20">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{currentPageData.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors text-2xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {currentPageData.content}
                </div>

                {/* Navigation */}
                <div className="p-6 border-t border-gray-800 bg-gray-900/50">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            ← Previous
                        </button>

                        <div className="flex gap-2">
                            {pages.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all ${i === currentPage ? 'bg-purple-500 w-6' : 'bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>

                        {currentPage === pages.length - 1 ? (
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 font-bold transition-all"
                            >
                                Let's Go! 🚀
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-all"
                            >
                                Next →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
