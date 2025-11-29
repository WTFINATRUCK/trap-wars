# TRAP WARS - Complete Deployment Guide

> **Code is Law. Built for the Culture.**

This guide will walk you through deploying TRAP WARS to production, from token launch to live website.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Token Launch](#token-launch)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Frontend Configuration](#frontend-configuration)
5. [Website Deployment](#website-deployment)
6. [Admin Panel Setup](#admin-panel-setup)
7. [Volume Bot Configuration](#volume-bot-configuration)
8. [Post-Launch Checklist](#post-launch-checklist)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- **Node.js** v18+ 
- **Solana CLI** v1.14+
- **Anchor CLI** v0.28+
- **Rust** (for smart contract builds)
- **Phantom Wallet** or similar (with SOL for fees)

### Recommended
- **Solana RPC** - Use a paid RPC for better reliability (Helius, QuickNode, or Triton)
- **Admin Wallet** - Dedicated wallet with 5-10 SOL for deployment and operations
- **Burner Wallets** - For testing and volume bots

### Knowledge Requirements
- Basic Solana/SPL token understanding
- Command line proficiency
- Web deployment basics

---

## Token Launch

### Step 1: Create Your Token

**Option A: Pump.fun (Recommended for Quick Launch)**
1. Go to [https://pump.fun/create](https://pump.fun/create)
2. Connect your admin wallet
3. Fill in token details:
   - **Name**: TRAP
   - **Symbol**: $TRAP
   - **Supply**: 1,000,000,000 (1 billion)
   - **Description**: "The classic Dope Wars game reimagined on Solana. Code is law. Built for the culture."
4. Upload logo/image
5. Pay creation fee (~0.02 SOL)
6. **SAVE YOUR MINT ADDRESS** - You'll need this!

**Option B: Manual Token Creation (Advanced)**
```bash
# Create new token
spl-token create-token --decimals 9

# Create token account
spl-token create-account <TOKEN_MINT>

# Mint initial supply
spl-token mint <TOKEN_MINT> 1000000000 --owner <YOUR_WALLET>
```

### Step 2: Initial Liquidity (If Not Using Pump.fun)
If you created the token manually, you'll need to:
1. Create a Raydium pool
2. Add initial liquidity (recommend 10-20 SOL paired with supply)
3. Freeze mint authority (optional but recommended for trust)

---

## Smart Contract Deployment

### Deploy Leaderboard Program

```bash
# Navigate to contracts directory
cd contracts/trap_leaderboard

# Build the program
anchor build

# Deploy to mainnet
anchor deploy --provider.cluster mainnet

# Save the program ID shown in output
```

### Deploy Vault Program (Optional - for real staking)

```bash
cd ../trap_vault
anchor build
anchor deploy --provider.cluster mainnet
```

**Important:** Update `Anchor.toml` with your wallet path and cluster settings before deploying.

---

## Frontend Configuration

### Step 1: Install Dependencies

```bash
cd app
npm install
```

### Step 2: Environment Setup

Create `.env.local`:
```env
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_TRAP_MINT=<YOUR_TOKEN_MINT_ADDRESS>
```

### Step 3: Update Constants

Edit `app/lib/tokenUtils.ts`:
```typescript
export const DEFAULT_TRAP_MINT = "<YOUR_TOKEN_MINT_ADDRESS>";
```

### Step 4: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and verify:
- Wallet connection works
- Game loads
- Admin panel accessible at `/admin`

---

## Website Deployment

### Option 1: Static Export (Netlify/Vercel)

```bash
# Build static site
npm run build

# The output will be in /out directory
# Upload this to Netlify Drop or Vercel
```

**Netlify Deployment:**
1. Run `npm run build`
2. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop the `/out` folder
4. Done! Your site is live.

**Vercel Deployment:**
```bash
npm install -g vercel
vercel --prod
```

### Option 2: Custom Domain Setup

After deployment:
1. Go to your hosting provider's dashboard
2. Add custom domain
3. Update DNS records:
   - **A Record**: Point to hosting IP
   - **CNAME**: Point to hosting URL
4. Wait for DNS propagation (5-60 minutes)

---

## Admin Panel Setup

### Step 1: Access Admin Panel

Navigate to `https://yourdomain.com/admin`

### Step 2: Configure Token

1. Click **"SAVE CONFIG"** section
2. Paste your **TRAP mint address**
3. Click **"SAVE CONFIG"**
4. Refresh the page to verify it's saved

### Step 3: Test Functionality

- Generate test wallets in Dev Tools
- Try small SOL distribution (0.01 SOL)
- Verify transactions appear on Solscan

---

## Volume Bot Configuration

### Enable Real Trading Mode

Edit `app/app/admin/page.tsx` in the `BotControlPanel` component:

Replace simulation code with:
```typescript
const startVolumeBot = async () => {
    const mint = localStorage.getItem("trap_mint_address");
    if (!mint) return alert("Token mint address not configured!");
    
    // Import real bot class
    const { VolumeBumperBot } = await import("@/lib/volumeBot");
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    
    // Create bot instance with real wallet
    // WARNING: Only use burner wallets with small amounts!
    const bot = new VolumeBumperBot(connection, walletKeypair, config, addBotLog);
    await bot.start();
};
```

### Bot Parameters

**Volume Bot:**
- Min Buy: 0.01-0.05 SOL (keep small)
- Max Buy: 0.05-0.1 SOL
- Min Interval: 30-60 seconds
- Max Interval: 120-300 seconds

**Grid Bot:**
- Grid Levels: 5-15 (more = more stable volume)
- Capital: 1-5 SOL total
- Order Size: 0.05-0.2 SOL per order

**⚠️ WARNING:** Bots execute real transactions. Start with very small amounts (0.001 SOL) to test!

---

## Post-Launch Checklist

### Day 1: Launch
- [ ] Token created and mint address saved
- [ ] Website deployed and accessible
- [ ] Admin panel configured with token mint
- [ ] Test game with personal wallet
- [ ] Share with small test group

### Week 1: Monitoring
- [ ] Monitor transaction logs daily
- [ ] Check for any errors in console
- [ ] Verify referral links working
- [ ] Ensure volume bots stable (if enabled)
- [ ] Gather initial user feedback

### Ongoing: Growth
- [ ] Share referral program details
- [ ] Post leaderboard updates
- [ ] Announce new features
- [ ] Monitor liquidity depth
- [ ] Adjust bot parameters as needed

---

## Advanced Features

### Custom RPC Configuration

For better reliability, use a paid RPC:

```typescript
// app/lib/tokenUtils.ts
export const RPC_ENDPOINT = "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY";
```

Recommended providers:
- **Helius**: Best for gaming/high throughput
- **QuickNode**: Good balance of price/performance  
- **Triton**: Enterprise-grade reliability

### Smart Contract Integration

To enable real on-chain staking:

1. Deploy `trap_vault` program
2. Update `app/lib/stakingUtils.ts` with program ID
3. Uncomment staking transaction code in `DopeWarsGame.tsx`
4. Test with small amounts first

---

## Troubleshooting

### "Transaction Failed" Errors

**Cause:** Slippage too tight or insufficient balance  
**Fix:** Increase slippage in Jupiter calls (50-100 bps)

### Volume Bots Not Working

**Cause:** Missing keypair or RPC rate limiting  
**Fix:** Use paid RPC, add delays between transactions

### Referral Links Not Tracking

**Cause:** localStorage issues or strict browser privacy  
**Fix:** Test in different browser, ensure cookies/storage enabled

### Game Not Loading

**Cause:** RPC endpoint down or wallet not connecting  
**Fix:** Check RPC status, try different RPC provider

### "Insufficient SOL" in Game

**Cause:** Mock mode still active  
**Fix:** Verify token mint address set in admin panel

---

## Security Best Practices

1. **Never share private keys** - Use environment variables, never commit to git
2. **Use burner wallets** for bots - Don't risk large amounts
3. **Test on devnet first** - Verify everything works before mainnet
4. **Monitor transactions** - Set up alerts for unusual activity
5. **Rate limit bots** - Don't spam RPC or you'll get blocked
6. **Backup regularly** - Save contract code, wallet keys, config

---

## Support & Resources

- **Solana Docs**: [https://docs.solana.com](https://docs.solana.com)
- **Anchor Docs**: [https://www.anchor-lang.com](https://www.anchor-lang.com)
- **Jupiter API**: [https://station.jup.ag/docs](https://station.jup.ag/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)

---

## Final Notes

TRAP WARS is designed to be:
- **Fair**: No pre-mine, no hidden allocations
- **Transparent**: Code is open, mechanics are clear
- **Community-driven**: Referral system rewards builders
- **Sustainable**: House edge and fees support longevity

**Code is Law. Built for the Culture.**

Good luck! 🚀

---

*Last Updated: 2025-11-28*
