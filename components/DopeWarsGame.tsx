"use client";

import { useState, useEffect } from "react";
import { getMarketStats, MarketStats } from "../lib/marketData";

// Game configuration
const LOCATIONS = ["Compton", "Long Beach", "Inglewood", "South Central", "Watts", "East LA"];
const PRODUCTS = [
    { name: "Weed", emoji: "🌿", minPrice: 800, maxPrice: 2000 },
    { name: "Cocaine", emoji: "❄️", minPrice: 24000, maxPrice: 35000 },
    { name: "Heroin", emoji: "💉", minPrice: 35000, maxPrice: 55000 },
    { name: "Acid", emoji: "🧪", minPrice: 1500, maxPrice: 3500 },
    { name: "Shrooms", emoji: "🍄", minPrice: 600, maxPrice: 1200 },
    { name: "Fentanyl", emoji: "☠️", minPrice: 2500, maxPrice: 6000 },
];

const EVENTS = [
    { type: "police", text: "🚔 POLICE RAID! Pay $500 fine or lose random inventory!", chance: 0.15 },
    { type: "find", text: "💰 You found a stash! Free products!", chance: 0.1 },
    { type: "mugger", text: "🔫 MUGGER! Lose $300 or fight (50/50)?", chance: 0.1 },
    { type: "sale", text: "💊 Cheap supply available! One product 50% off!", chance: 0.15 },
    { type: "demand", text: "🏪 High demand! One product sells for 2x!", chance: 0.15 },
];

// Rank Definitions based on STAKED AMOUNT
const RANKS = {
    NONE: { name: "Street Hustler", threshold: 0, multiplier: 1.0, protected: [] as string[] },
    STREET_RAT: { name: "Street Rat", threshold: 10000, multiplier: 1.1, protected: ["Compton"] },
    HUSTLER: { name: "Hustler", threshold: 50000, multiplier: 1.2, protected: ["Compton", "Watts"] },
    KINGPIN: { name: "Kingpin", threshold: 100000, multiplier: 1.35, protected: ["Compton", "Watts", "Inglewood"] },
    GODFATHER: { name: "Godfather", threshold: 500000, multiplier: 1.5, protected: ["Compton", "Watts", "Inglewood", "Long Beach"] },
    WHALE: { name: "Whale", threshold: 1000000, multiplier: 2.0, protected: LOCATIONS }, // All locations
};

interface GameState {
    day: number;
    location: string;
    cash: number;
    debt: number;
    inventory: { [key: string]: number };
    coatSpace: number;
    prices: { [key: string]: number };
    gameOver: boolean;
    finalScore: number;
    rank: keyof typeof RANKS;
    stakedAmount: number;
}

interface DopeWarsGameProps {
    wallet: string;
    onGameOver: (score: number) => void;
}

export default function DopeWarsGame({ wallet, onGameOver }: DopeWarsGameProps) {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [showEvent, setShowEvent] = useState<string | null>(null);
    const [showLevelUp, setShowLevelUp] = useState<string | null>(null);
    const [buyAmount, setBuyAmount] = useState<{ [key: string]: string }>({});
    const [sellAmount, setSellAmount] = useState<{ [key: string]: string }>({});
    const [currency, setCurrency] = useState<"SOL" | "USDC" | "TRAP">("TRAP");
    const [marketStats, setMarketStats] = useState<MarketStats | null>(null);

    // Fetch market stats every 30 mins
    useEffect(() => {
        const fetchStats = async () => {
            const stats = await getMarketStats();
            setMarketStats(stats);
        };
        fetchStats();
        const interval = setInterval(fetchStats, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Initialize or load game
    useEffect(() => {
        const saved = localStorage.getItem(`trapwars_${wallet}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration for old saves: Add missing rank/stakedAmount
            if (!parsed.rank || !RANKS[parsed.rank as keyof typeof RANKS]) {
                parsed.rank = "NONE";
            }
            if (typeof parsed.stakedAmount === "undefined") {
                parsed.stakedAmount = 0;
            }
            setGameState(parsed);
        }
    }, [wallet]);

    const randomizePrices = (multiplier: number = 1.0) => {
        const newPrices: { [key: string]: number } = {};
        PRODUCTS.forEach(p => {
            const basePrice = Math.floor(Math.random() * (p.maxPrice - p.minPrice) + p.minPrice);
            newPrices[p.name] = Math.floor(basePrice * multiplier);
        });
        return newPrices;
    };

    const startNewGame = () => {
        const multiplier = marketStats?.marketMultiplier || 1.0;
        const initialPrices = randomizePrices(multiplier);

        const newGame: GameState = {
            day: 1,
            location: "Compton",
            cash: 50000,
            debt: 0,
            inventory: {},
            coatSpace: 100,
            prices: initialPrices,
            gameOver: false,
            finalScore: 0,
            rank: "NONE",
            stakedAmount: 0,
        };
        setGameState(newGame);
        localStorage.setItem(`trapwars_${wallet}`, JSON.stringify(newGame));
    };

    const saveGame = (state: GameState) => {
        localStorage.setItem(`trapwars_${wallet}`, JSON.stringify(state));
        setGameState(state);
    };

    const checkMilestone = (currentCash: number, currentStaked: number, currentRank: keyof typeof RANKS) => {
        // Calculate potential total stake if we force stake 10% of current cash
        const potentialStake = Math.floor(currentCash * 0.10);
        const newTotalStaked = currentStaked + potentialStake;

        let newRank: keyof typeof RANKS = currentRank;
        let message = "";

        // Check thresholds based on STAKED AMOUNT
        if (currentRank !== "WHALE" && newTotalStaked >= RANKS.WHALE.threshold) {
            newRank = "WHALE";
            message = "🐋 WHALE STATUS UNLOCKED!\n\nTop Tier Rewards:\n- 2.0x Sell Price Multiplier\n- All City Protection";
        } else if (currentRank !== "GODFATHER" && currentRank !== "WHALE" && newTotalStaked >= RANKS.GODFATHER.threshold) {
            newRank = "GODFATHER";
            message = "👑 GODFATHER STATUS UNLOCKED!\n\nRewards:\n- 1.5x Sell Price Multiplier\n- Protection in 4 Cities";
        } else if (currentRank !== "KINGPIN" && currentRank !== "GODFATHER" && currentRank !== "WHALE" && newTotalStaked >= RANKS.KINGPIN.threshold) {
            newRank = "KINGPIN";
            message = "🦁 KINGPIN STATUS UNLOCKED!\n\nRewards:\n- 1.35x Sell Price Multiplier\n- Protection in 3 Cities";
        } else if (currentRank !== "HUSTLER" && currentRank !== "KINGPIN" && currentRank !== "GODFATHER" && currentRank !== "WHALE" && newTotalStaked >= RANKS.HUSTLER.threshold) {
            newRank = "HUSTLER";
            message = "💰 HUSTLER STATUS UNLOCKED!\n\nRewards:\n- 1.2x Sell Price Multiplier\n- Protection in 2 Cities";
        } else if (currentRank === "NONE" && newTotalStaked >= RANKS.STREET_RAT.threshold) {
            newRank = "STREET_RAT";
            message = "🐀 STREET RAT STATUS UNLOCKED!\n\nRewards:\n- 1.1x Sell Price Multiplier\n- Protection in Compton";
        }

        if (newRank !== currentRank) {
            return {
                newRank,
                stakeAmount: potentialStake,
                remainingCash: currentCash - potentialStake,
                message
            };
        }
        return null;
    };

    const triggerRandomEvent = (currentGameState: GameState) => {
        // Check protection
        const currentRankData = RANKS[currentGameState.rank] || RANKS.NONE;
        const isProtected = currentRankData.protected.includes(currentGameState.location);

        const roll = Math.random();
        if (roll < 0.35) {
            let event = EVENTS[Math.floor(Math.random() * EVENTS.length)];

            // If protected, prevent bad events (police, mugger)
            if (isProtected && (event.type === "police" || event.type === "mugger")) {
                console.log("Protected from event:", event.type);
                return { newState: currentGameState, eventText: null };
            }

            let newState = { ...currentGameState };
            let eventText = event.text;

            if (event.type === "find") {
                const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
                const quantity = Math.floor(Math.random() * 5) + 2;
                const currentInventory = Object.values(newState.inventory).reduce((a, b) => a + b, 0);

                if (currentInventory + quantity <= newState.coatSpace) {
                    newState.inventory = {
                        ...newState.inventory,
                        [product.name]: (newState.inventory[product.name] || 0) + quantity
                    };
                    eventText = `💰 You found a stash of ${product.name}! (+${quantity} units)`;
                } else {
                    eventText = "💰 You found a stash, but your coat is full!";
                }
            } else if (event.type === "police") {
                const products = Object.keys(newState.inventory).filter(k => newState.inventory[k] > 0);
                if (products.length > 0) {
                    const product = products[Math.floor(Math.random() * products.length)];
                    const quantity = Math.floor(Math.random() * 5) + 2;
                    const currentQty = newState.inventory[product];
                    const lost = Math.min(currentQty, quantity);

                    newState.inventory = {
                        ...newState.inventory,
                        [product]: currentQty - lost
                    };
                    eventText = `🚔 POLICE RAID! You lost ${lost} units of ${product}!`;
                } else {
                    eventText = "🚔 POLICE RAID! They didn't find anything on you.";
                }
            } else if (event.type === "mugger") {
                const lost = Math.floor(newState.cash * 0.15);
                newState.cash = Math.max(0, newState.cash - lost);
                eventText = `🔫 MUGGER! You got jumped and lost $${lost.toLocaleString()}!`;
            } else if (event.type === "sale") {
                const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
                newState.prices = {
                    ...newState.prices,
                    [product.name]: Math.floor(newState.prices[product.name] * 0.5)
                };
                eventText = `💊 FIRE SALE! ${product.name} is 50% off!`;
            } else if (event.type === "demand") {
                const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
                newState.prices = {
                    ...newState.prices,
                    [product.name]: Math.floor(newState.prices[product.name] * 2.0)
                };
                eventText = `🏪 HIGH DEMAND! ${product.name} prices doubled!`;
            }

            return { newState, eventText };
        }
        return { newState: currentGameState, eventText: null };
    };

    const travel = (newLocation: string) => {
        if (!gameState) return;

        const newDay = gameState.day + 1;
        if (newDay > 30) {
            const final = { ...gameState, day: 31, gameOver: true, finalScore: gameState.cash };
            saveGame(final);
            onGameOver(gameState.cash);
            return;
        }

        const multiplier = marketStats?.marketMultiplier || 1.0;
        const newPrices = randomizePrices(multiplier);
        let updatedGame = {
            ...gameState,
            day: newDay,
            location: newLocation,
            prices: newPrices,
        };

        // Trigger Event and Update State
        const { newState, eventText } = triggerRandomEvent(updatedGame);

        saveGame(newState);
        if (eventText) setShowEvent(eventText);
    };

    const endGameEarly = () => {
        if (!gameState) return;

        if (confirm(`End your run on Day ${gameState.day}?\n\nYour $${gameState.cash.toLocaleString()} will be staked in the vault.\n\nYou can claim it anytime from the Vault tab.`)) {
            const final = {
                ...gameState,
                gameOver: true,
                finalScore: gameState.cash,
            };
            saveGame(final);
            onGameOver(gameState.cash);
        }
    };

    const buyProduct = (productName: string) => {
        if (!gameState) return;
        const amount = parseInt(buyAmount[productName] || "0");
        if (amount <= 0) return;

        const price = gameState.prices[productName];
        const totalCost = price * amount;
        const currentInventory = Object.values(gameState.inventory).reduce((sum, qty) => sum + qty, 0);

        if (totalCost > gameState.cash) {
            alert("Not enough cash!");
            return;
        }
        if (currentInventory + amount > gameState.coatSpace) {
            alert("Not enough coat space!");
            return;
        }

        const updatedGame = {
            ...gameState,
            cash: gameState.cash - totalCost,
            inventory: {
                ...gameState.inventory,
                [productName]: (gameState.inventory[productName] || 0) + amount,
            },
        };
        saveGame(updatedGame);
        setBuyAmount({ ...buyAmount, [productName]: "" });
    };

    const sellProduct = (productName: string) => {
        if (!gameState) return;
        const amount = parseInt(sellAmount[productName] || "0");
        if (amount <= 0) return;

        const currentQty = gameState.inventory[productName] || 0;
        if (amount > currentQty) {
            alert("You don't have that much!");
            return;
        }

        const price = gameState.prices[productName];

        // Apply Rank Multiplier
        const rankMultiplier = RANKS[gameState.rank].multiplier;
        const totalEarnings = Math.floor(price * amount * rankMultiplier);

        let updatedGame = {
            ...gameState,
            cash: gameState.cash + totalEarnings,
            inventory: {
                ...gameState.inventory,
                [productName]: currentQty - amount,
            },
        };

        // Check for Milestone Level Up
        const milestone = checkMilestone(updatedGame.cash, updatedGame.stakedAmount, gameState.rank);
        if (milestone) {
            updatedGame = {
                ...updatedGame,
                cash: milestone.remainingCash,
                rank: milestone.newRank,
                stakedAmount: updatedGame.stakedAmount + milestone.stakeAmount,
            };
            setShowLevelUp(milestone.message + `\n\n⚠️ 10% ($${milestone.stakeAmount.toLocaleString()}) has been automatically staked to the Vault.`);
        }

        saveGame(updatedGame);
        setSellAmount({ ...sellAmount, [productName]: "" });
    };

    if (!gameState) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center space-y-6">
                    <h2 className="text-4xl font-bold text-purple-400">🎮 TRAP WARS</h2>
                    <p className="text-gray-400 max-w-md">You have 30 days to make as much $TRAP as possible. Travel between NYC boroughs, buy low, sell high, and avoid the cops!</p>
                    <button
                        onClick={startNewGame}
                        className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl transition-all"
                    >
                        START NEW GAME
                    </button>
                </div>
            </div>
        );
    }

    if (gameState.gameOver) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center space-y-6 p-8 rounded-2xl bg-gray-900 border border-purple-500">
                    <h2 className="text-4xl font-bold text-purple-400">GAME OVER</h2>
                    <div className="space-y-2">
                        <p className="text-2xl">Final Earnings: <span className="text-green-400 font-mono">{gameState.finalScore.toLocaleString()} $TRAP</span></p>
                        <p className="text-gray-400">{gameState.day > 30 ? "You survived all 30 days!" : `Ended early on day ${gameState.day}`}</p>
                    </div>
                    <div className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl">
                        <p className="text-sm text-gray-300 mb-2">💰 Your earnings are now staked in the Vault</p>
                        <p className="text-xs text-gray-500">Go to the "Vault" tab to claim your rewards</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={startNewGame}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
                        >
                            PLAY AGAIN
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalInventory = Object.values(gameState.inventory).reduce((sum, qty) => sum + qty, 0);
    const currentRankData = RANKS[gameState.rank] || RANKS.NONE;
    const isProtected = currentRankData.protected.includes(gameState.location);

    return (
        <div className="space-y-6">
            {/* Level Up Modal */}
            {showLevelUp && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setShowLevelUp(null)}>
                    <div className="bg-gradient-to-b from-yellow-900 to-black p-8 rounded-2xl border-2 border-yellow-500 max-w-md text-center animate-bounce-in">
                        <div className="text-6xl mb-4">🆙</div>
                        <h2 className="text-3xl font-bold text-yellow-400 mb-4">LEVEL UP!</h2>
                        <div className="whitespace-pre-wrap text-lg text-white mb-6 font-medium">{showLevelUp}</div>
                        <button
                            onClick={() => setShowLevelUp(null)}
                            className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-black font-bold rounded-xl text-lg"
                        >
                            CLAIM REWARDS
                        </button>
                    </div>
                </div>
            )}

            {/* Event Modal */}
            {showEvent && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowEvent(null)}>
                    <div className="bg-gray-900 p-8 rounded-2xl border border-yellow-500 max-w-md">
                        <p className="text-xl text-center mb-4">{showEvent}</p>
                        <button
                            onClick={() => setShowEvent(null)}
                            className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-bold rounded-lg"
                        >
                            CONTINUE
                        </button>
                    </div>
                </div>
            )}

            {/* HUD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                <div>
                    <div className="text-gray-400 text-sm">Day</div>
                    <div className="text-2xl font-bold text-purple-400">{gameState.day}/30</div>
                </div>
                <div>
                    <div className="text-gray-400 text-sm">Cash</div>
                    <div className="text-2xl font-bold text-green-400 font-mono">${gameState.cash.toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-sm">Location</div>
                    <div className="text-2xl font-bold text-blue-400">{gameState.location}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-sm">Inventory</div>
                    <div className="text-2xl font-bold text-yellow-400">{totalInventory}/{gameState.coatSpace}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-sm">Rank</div>
                    <div className="text-xl font-bold text-yellow-400">{currentRankData.name}</div>
                    <div className="text-xs text-gray-500">{currentRankData.multiplier}x Sell Bonus</div>
                </div>
                <div>
                    <div className="text-gray-400 text-sm">Staked</div>
                    <div className="text-xl font-bold text-cyan-400">${gameState.stakedAmount.toLocaleString()}</div>
                </div>
            </div>

            {/* Protection Status */}
            {isProtected && (
                <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                        <div className="font-bold text-green-400">Protected Territory</div>
                        <div className="text-xs text-gray-400">Police raids and muggers are disabled here.</div>
                    </div>
                </div>
            )}

            {/* End Run Early Button */}
            <div className="flex justify-end">
                <button
                    onClick={endGameEarly}
                    className="px-6 py-2 bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-900 rounded-lg font-bold transition-all text-sm"
                >
                    ⚠️ END RUN & STAKE EARNINGS
                </button>
            </div>

            {/* Travel */}
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-4">🚕 Travel (Advances 1 Day)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {LOCATIONS.map(loc => (
                        <button
                            key={loc}
                            onClick={() => travel(loc)}
                            disabled={loc === gameState.location}
                            className={`py-2 px-4 rounded-lg font-bold transition-all ${loc === gameState.location
                                ? "bg-purple-900 text-purple-400 cursor-not-allowed"
                                : "bg-gray-800 hover:bg-gray-700 text-white"
                                }`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory Display */}
            <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-purple-500/30">
                <h3 className="text-xl font-bold mb-4">🎒 Your Stash ({totalInventory}/{gameState.coatSpace} units)</h3>
                {totalInventory === 0 ? (
                    <p className="text-gray-500 text-center py-4">Your pockets are empty. Buy some product!</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {PRODUCTS.filter(p => (gameState.inventory[p.name] || 0) > 0).map(product => (
                            <div key={product.name} className="p-4 bg-black/50 rounded-lg border border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{product.emoji}</span>
                                    <span className="font-bold">{product.name}</span>
                                </div>
                                <div className="text-2xl font-mono text-purple-400">
                                    {gameState.inventory[product.name]} units
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Worth ${(gameState.prices[product.name] * gameState.inventory[product.name]).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Crypto Market Data */}
            {marketStats && (
                <div className="p-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl border border-blue-500/30">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-blue-300">📈 Real-Time Crypto Market</h3>
                        <div className="text-xs text-gray-400">Updates every 30m</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-black/40 rounded-lg">
                            <div className="text-gray-400 text-xs">SOL Price</div>
                            <div className="text-xl font-bold text-white">${marketStats.solPrice.toFixed(2)}</div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-lg">
                            <div className="text-gray-400 text-xs">TRAP Price</div>
                            <div className="text-xl font-bold text-white">${marketStats.trapPrice > 0 ? marketStats.trapPrice.toFixed(6) : "---"}</div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-lg">
                            <div className="text-gray-400 text-xs">Market Condition</div>
                            <div className={`text-xl font-bold ${marketStats.marketCondition === "MOON" ? "text-green-400" :
                                marketStats.marketCondition === "BULL" ? "text-green-300" :
                                    marketStats.marketCondition === "BEAR" ? "text-red-400" : "text-gray-300"
                                }`}>
                                {marketStats.marketCondition === "MOON" ? "🚀 MOON" :
                                    marketStats.marketCondition === "BULL" ? "🐂 BULL" :
                                        marketStats.marketCondition === "BEAR" ? "🐻 BEAR" : "🦀 CRAB"}
                            </div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-lg border border-yellow-500/30">
                            <div className="text-yellow-500 text-xs">Price Multiplier</div>
                            <div className="text-xl font-bold text-yellow-400">{marketStats.marketMultiplier.toFixed(2)}x</div>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-center text-gray-500">
                        Drug prices are adjusted based on SOL price, TRAP volume & liquidity.
                    </div>
                </div>
            )}

            {/* Market */}
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">💰 Market Prices</h3>
                    <div className="flex gap-2 items-center">
                        <span className="text-sm text-gray-400">Pay with:</span>
                        {["SOL", "USDC", "TRAP"].map((curr) => (
                            <button
                                key={curr}
                                onClick={() => setCurrency(curr as any)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${currency === curr
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                    }`}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-400">⚡ {currency !== "TRAP" ? `Paying with ${currency} auto-swaps to $TRAP via Jupiter (creates LP volume!)` : "Direct $TRAP payments"}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black text-gray-400 text-sm">
                            <tr>
                                <th className="p-3">Product</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">You Have</th>
                                <th className="p-3">Buy</th>
                                <th className="p-3">Sell</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {PRODUCTS.map(product => (
                                <tr key={product.name} className="hover:bg-gray-800/50">
                                    <td className="p-3">
                                        <span className="text-xl mr-2">{product.emoji}</span>
                                        <span className="font-medium">{product.name}</span>
                                    </td>
                                    <td className="p-3 font-mono text-green-400">${gameState.prices[product.name]}</td>
                                    <td className="p-3 font-mono">{gameState.inventory[product.name] || 0}</td>
                                    <td className="p-3">
                                        <div className="flex gap-1">
                                            <input
                                                type="number"
                                                min="0"
                                                value={buyAmount[product.name] || ""}
                                                onChange={(e) => setBuyAmount({ ...buyAmount, [product.name]: e.target.value })}
                                                className="w-20 bg-black border border-gray-700 rounded px-2 py-1 text-sm"
                                                placeholder="0"
                                            />
                                            <button
                                                onClick={() => buyProduct(product.name)}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm font-bold"
                                            >
                                                BUY
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-1">
                                            <input
                                                type="number"
                                                min="0"
                                                max={gameState.inventory[product.name] || 0}
                                                value={sellAmount[product.name] || ""}
                                                onChange={(e) => setSellAmount({ ...sellAmount, [product.name]: e.target.value })}
                                                className="w-20 bg-black border border-gray-700 rounded px-2 py-1 text-sm"
                                                placeholder="0"
                                            />
                                            <button
                                                onClick={() => sellProduct(product.name)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-bold"
                                            >
                                                SELL
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
