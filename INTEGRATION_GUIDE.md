# TRAP WARS - v0.dev Integration Guide

## 🔧 What I Fixed

### Updated `package.json`
Combined the v0.dev UI components with your Solana game dependencies:
- ✅ Kept all Radix UI components for beautiful interface
- ✅ Added Solana Web3.js and wallet adapters
- ✅ Added Jupiter API for token swaps
- ✅ Added Anchor for smart contracts
- ✅ Removed duplicate/unnecessary packages

### What to Do Next

**1. Install Dependencies**
```bash
cd app
npm install
```

**2. Fix the Links**
The v0.dev site probably has placeholder links. You need to update them to:

**In your landing page component**, replace:
```tsx
// Replace these placeholder links:
<Link href="#">How to Play</Link>
<Link href="#">Leaderboard</Link>

// With actual routes:
<Link href="/game">Play Now</Link>
<Link href="/leaderboard">Leaderboard</Link>
<Link href="/admin">Admin</Link>
```

**3. Fix the Verbiage**
Update the text to match TRAP WARS:

**Replace generic text like:**
- "My V0 Project" → "TRAP WARS"
- "Welcome to our platform" → "Code is Law. Built for the Culture."
- Generic descriptions → Use content from `ABOUT.md`

**4. Connect to Game**
Make sure the "PLAY NOW" button links to the actual game:

```tsx
<Link href="/game">
  <Button className="bg-green-600 hover:bg-green-500">
    🚀 PLAY NOW
  </Button>
</Link>
```

---

## 📁 File Structure

Your app should have:
```
app/
├── page.tsx          (Landing page from v0.dev)
├── game/
│   └── page.tsx      (Your DopeWarsGame component)
├── leaderboard/
│   └── page.tsx      (Leaderboard display)
├── admin/
│   └── page.tsx      (Admin panel - already exists)
└── components/
    ├── Kitchen.tsx   (Game wrapper)
    ├── DopeWarsGame.tsx
    └── ui/           (v0.dev UI components)
```

---

## 🎨 Key Pages to Create

### 1. Landing Page (`app/page.tsx`)
Use the v0.dev generated design but update:
- Logo text: "TRAP WARS"
- Tagline: "Code is Law. Built for the Culture."
- CTA button links to `/game`
- "How it Works" explains the 30-day hustle
- Tokenomics shows $TRAP details
- Footer has Discord, Twitter, Docs links

### 2. Game Page (`app/game/page.tsx`)
```tsx
import Kitchen from '@/components/Kitchen';

export default function GamePage() {
  return <Kitchen />;
}
```

### 3. Leaderboard Page (`app/leaderboard/page.tsx`)
Display the on-chain leaderboard data

---

## 🔗 Links to Fix

**Navigation Menu:**
```tsx
const navItems = [
  { name: "Play", href: "/game" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "How to Play", href: "#how-it-works" },  // Scroll to section
  { name: "Admin", href: "/admin" },
];
```

**Footer Links:**
```tsx
<Link href="https://twitter.com/trapwars">Twitter</Link>
<Link href="https://discord.gg/trapwars">Discord</Link>
<Link href="/admin">Admin Panel</Link>
<Link href="https://github.com/yourusername/trapwars">GitHub</Link>
```

**CTA Buttons:**
```tsx
<Link href="/game">
  <Button>Play Now</Button>
</Link>
<Link href="#about">
  <Button variant="outline">Learn More</Button>
</Link>
```

---

## 📝 Verbiage Updates

Replace v0.dev placeholder text with:

**Hero Section:**
```
Headline: "TRAP WARS"
Subheadline: "Code is Law. Built for the Culture."
Description: "The classic 1990s street economics game reimagined on Solana. 30 days to make your fortune."
```

**Features:**
```
🎮 The Hustle
Buy low, sell high across 5 NYC boroughs. Dodge cops. Stack profits.

👑 The Ranks  
Stake your earnings to unlock ranks from Street Rat to Godfather.

⛓️ The Code
Everything on-chain. Your wallet is your save file. No rollbacks.
```

**Stats:**
```
Supply: 1 Billion $TRAP
House Edge: 5%
Staking Rewards: From Vault Fees
Referral Bonus: 0.5%
```

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update landing page:**
   - Fix all `<Link>` hrefs
   - Replace placeholder text
   - Add wallet connection to nav

3. **Test routes:**
   ```bash
   npm run dev
   ```
   - Visit `/` (landing)
   - Visit `/game` (should show game)
   - Visit `/admin` (should show admin panel)

4. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

---

## ✅ Checklist

- [ ] Run `npm install`
- [ ] Update all `<Link href="#">` to actual routes
- [ ] Replace "My V0 Project" with "TRAP WARS"
- [ ] Update hero text to match ABOUT.md
- [ ] Fix navigation menu links
- [ ] Add wallet connection button
- [ ] Test all page routes
- [ ] Deploy to Vercel

---

Your site will look beautiful (v0.dev design) AND actually work (Solana game functionality)! 🔥
