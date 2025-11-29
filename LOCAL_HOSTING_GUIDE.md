# Running TRAP WARS Locally with On-Chain Results

## ✅ YES - This Works!

You can host the game on your local computer and players can still:
- ✅ Connect their wallets
- ✅ Play the game
- ✅ Make real Solana transactions
- ✅ Earn real $TRAP tokens
- ✅ Everything goes on-chain (mainnet)

**Why this works**: The blockchain operations happen on Solana's network, NOT on your computer. Your computer just serves the website.

---

## 🚀 Quick Setup (2 Methods)

### Method 1: ngrok (Easiest)

**Step 1: Start your game**
```bash
cd app
npm run dev
```
Game runs at `http://localhost:3000`

**Step 2: Expose to internet**
```bash
# Install ngrok (one time)
# Download from: https://ngrok.com/download
# Or via chocolatey: choco install ngrok

# Expose port 3000
ngrok http 3000
```

**Step 3: Share the URL**
Ngrok gives you a URL like: `https://abc123.ngrok.io`

Share this with players - they can connect and play!

---

### Method 2: Cloudflare Tunnel (Free, Better)

**Step 1: Install Cloudflare Tunnel**
```bash
# Download cloudflared
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation

# Or via chocolatey
choco install cloudflared
```

**Step 2: Start tunnel**
```bash
# In one terminal - start game
cd app
npm run dev

# In another terminal - start tunnel
cloudflared tunnel --url http://localhost:3000
```

**Step 3: Get URL**
Cloudflare gives you: `https://random-name.trycloudflare.com`

Share this with players!

---

## 🔐 How It Works

```
Player's Browser
    ↓
Your Local Game (localhost:3000)
    ↓
ngrok/Cloudflare (public URL)
    ↓
Player connects wallet
    ↓
Transactions go to Solana Mainnet ← THIS IS ON-CHAIN!
```

**Key Point**: The blockchain operations happen on Solana's network, not your computer. Your computer just serves the HTML/JavaScript.

---

## 📋 Complete Setup Guide

### 1. Prepare Your Game

```bash
cd app

# Install dependencies
npm install

# Start development server
npm run dev
```

Game is now running at `http://localhost:3000`

### 2. Choose Tunneling Service

**Option A: ngrok (Simple)**
```bash
# Install ngrok
choco install ngrok
# OR download from https://ngrok.com

# Start tunnel
ngrok http 3000
```

**Option B: Cloudflare Tunnel (Better)**
```bash
# Install cloudflared
# https://github.com/cloudflare/cloudflared/releases

# Start tunnel
cloudflared tunnel --url http://localhost:3000
```

**Option C: localtunnel (Quick & Dirty)**
```bash
# Install
npm install -g localtunnel

# Start tunnel
lt --port 3000
```

### 3. Share the URL

You'll get a URL like:
- ngrok: `https://abc123.ngrok-free.app`
- Cloudflare: `https://random-words.trycloudflare.com`
- localtunnel: `https://random-name.loca.lt`

Share this with players!

---

## ⚡ What Happens When Players Join

1. **Player opens your URL** (e.g., `https://abc123.ngrok.io`)
2. **Game loads** from your local computer
3. **Player clicks "Connect Wallet"**
4. **Phantom/Solflare opens** on their device
5. **They approve connection**
6. **Player starts game**
7. **All transactions happen on Solana mainnet** ← REAL ON-CHAIN!

Your computer just serves the website. The blockchain is independent.

---

## 💰 On-Chain Operations (All Real)

These happen on Solana mainnet:
- ✅ Token swaps (via Jupiter)
- ✅ Staking transactions
- ✅ Leaderboard updates (if using smart contract)
- ✅ Wallet balances
- ✅ Token transfers

Your local server just shows the UI. The money is real!

---

## 🛡️ Security & Considerations

**Pros:**
- ✅ Free hosting
- ✅ Full control
- ✅ Easy to update (just refresh code)
- ✅ Real on-chain transactions
- ✅ Great for testing before production

**Cons:**
- ⚠️ Your computer must stay on
- ⚠️ If internet drops, site goes down
- ⚠️ Free tunnels give random URLs (ngrok free tier)
- ⚠️ May be slower than professional hosting

**Security:**
- ✅ Players' wallets are safe (they control private keys)
- ✅ You can't steal funds (Solana security model)
- ✅ All transactions require player approval
- ⚠️ Make sure your code doesn't have malicious scripts

---

## 🎯 Recommended Setup for Testing

```bash
# Terminal 1: Start game
cd app
npm run dev

# Terminal 2: Start tunnel
cloudflared tunnel --url http://localhost:3000
```

Then share the Cloudflare URL with testers!

---

## 📈 When to Move to Production

Keep it local while:
- Testing game mechanics
- Finding bugs
- Getting initial feedback
- Small group of testers (< 50 people)

Move to Vercel/Netlify when:
- Game is stable
- Ready for public launch
- Expecting many players (100+)
- Want custom domain
- Want better uptime

---

## 🚨 Important Notes

**1. Your Computer Must Stay On**
If you turn off your computer or close the terminal, the game goes offline.

**2. Transactions Are Real**
Even though you're running locally, all Solana transactions are real mainnet transactions. Players spend real SOL.

**3. Free Tier Limits**
- ngrok free: 1 tunnel at a time, random URL
- Cloudflare: Unlimited tunnels, random URL
- localtunnel: Can be unstable

**4. Update Process**
When you change code:
1. Stop the game (Ctrl+C)
2. Restart: `npm run dev`
3. Tunnel stays the same!
4. Players just refresh their browser

---

## 🔥 Pro Tips

**1. Keep Terminal Open**
Don't close the terminal running `npm run dev` - game will stop.

**2. Monitor Logs**
Watch the terminal for errors and player connections.

**3. Test First**
Before sharing, test with your own wallet to make sure transactions work.

**4. Use Cloudflare**
It's free forever and more reliable than ngrok free tier.

**5. Save the URL**
Write down your tunnel URL so you can share it easily.

---

## 📞 Quick Commands Reference

```bash
# Start game
cd app
npm run dev

# New terminal - Start ngrok
ngrok http 3000

# OR - Start Cloudflare
cloudflared tunnel --url http://localhost:3000

# OR - Start localtunnel
lt --port 3000

# Share the URL you get!
```

---

## ✅ Yes, It Works!

Local hosting + On-chain results = **TOTALLY POSSIBLE**

Perfect for:
- Testing before launch
- Friends & family testing
- Private alpha group
- Development phase
- Saving money on hosting

When ready to scale, deploy to Vercel for free! 🚀
