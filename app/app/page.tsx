"use client";

import Link from "next/link";
import { ClientWalletMultiButton } from "@/components/ClientWalletMultiButton";
import { ArrowRight, Trophy, DollarSign, Shield, MapPin, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import InstructionsModal from "@/components/InstructionsModal";

export default function LandingPage() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              TRAP WARS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/game" className="hover:text-white transition-colors">Play</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <button onClick={() => setShowInstructions(true)} className="hover:text-white transition-colors">How to Play</button>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/game">
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all">
                Launch App
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-400 text-xs font-bold mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            LIVE ON SOLANA MAINNET
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
            CODE IS LAW.<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              BUILT FOR THE CULTURE.
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The classic 1990s street economics game reimagined on Solana.
            Buy low, sell high across NYC. 30 days to make your fortune.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/game" className="w-full md:w-auto">
              <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-green-900/20 flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />
                PLAY NOW
              </button>
            </Link>

            <button
              onClick={() => setShowInstructions(true)}
              className="w-full md:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              HOW TO PLAY
            </button>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-white/10 hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">The Hustle</h3>
              <p className="text-gray-400 leading-relaxed">
                Buy low, sell high across 5 NYC boroughs. Dodge cops. Stack profits.
                You have exactly 30 days to become a legend.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-white/10 hover:border-pink-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">The Ranks</h3>
              <p className="text-gray-400 leading-relaxed">
                Stake your earnings to unlock ranks from Street Rat to Godfather.
                Higher ranks give you protection and better prices.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-white/10 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">The Code</h3>
              <p className="text-gray-400 leading-relaxed">
                Everything is on-chain. Your wallet is your save file.
                No admins. No rollbacks. Code is law.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">REAL TOKENOMICS</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              $TRAP is the lifeblood of the streets. Earn it, stake it, trade it.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Supply", value: "1B", color: "text-purple-400" },
              { label: "House Edge", value: "5%", color: "text-pink-400" },
              { label: "Staking APY", value: "Dynamic", color: "text-cyan-400" },
              { label: "Referral Bonus", value: "0.5%", color: "text-green-400" },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className={`text-3xl md:text-4xl font-black mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-y border-green-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-green-400">BUILD YOUR EMPIRE</h2>
          <p className="text-xl text-gray-300 mb-8">
            Earn 0.5% of every player you refer. Forever. No caps.
            <br />Passive income for the real hustlers.
          </p>
          <Link href="/game">
            <button className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-900/20">
              GET YOUR REFERRAL LINK
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="font-black text-xl mb-2">TRAP WARS</h4>
            <p className="text-gray-500 text-sm">Built by anons. For the culture.</p>
          </div>

          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/game" className="hover:text-white transition-colors">Play</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
    </div>
  );
}
