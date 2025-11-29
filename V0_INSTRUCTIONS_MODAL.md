# Updated v0.dev Prompt Section

## IMPORTANT UPDATE:

The "Read Manifesto" button has been changed to "How to Play" and should open an instructions modal/dialog.

### Implementation Note for v0.dev:

Add this to your prompt or as a follow-up instruction:

"Create an Instructions Dialog/Modal component that opens when clicking the 'How to Play' button in the hero section. The modal should contain:

**Modal Content (Use Radix Dialog):**

### Tab 1: Game Basics
- **Title**: "Welcome to TRAP WARS"
- **Content**: 
  - Goal: Make as much money as possible in 30 days
  - How: Buy low, sell high, travel between NYC boroughs
  - Win: Stake your earnings and climb the leaderboard

### Tab 2: How to Play
1. **Buy Products** - Purchase items at low prices
2. **Travel** - Move to different boroughs for better deals
3. **Sell High** - Maximize profits at peak prices
4. **Manage Inventory** - Your coat holds 100 items max

### Tab 3: Random Events
- 💎 Find Stash - Free products!
- 🚔 Police Raid - Lose inventory (unless protected)
- 🔫 Mugger - Lose 15% cash (unless protected)
- 🔥 Market Events - Sales (50% off) or demand spikes (2x price)

### Tab 4: Rank System
- 🐀 Street Rat - Stake $100+ • 1.02x sell multiplier
- 💼 Hustler - Stake $500+ • 1.05x multiplier
- 👑 Kingpin - Stake $1,000+ • 1.10x multiplier
- 💎 Godfather - Stake $5,000+ • 1.20x multiplier

Higher ranks give protection from police/muggers in specific areas.

### Tab 5: Referral Program
- Share your unique link
- Earn 0.5% of referred players' activity
- They must stake $100+ for referral to activate
- Passive income builds automatically

### Tab 6: Ready to Play
- Start with $2,000 cash
- Complete your run in 30 days
- Stake to rank up
- Refer friends for passive income

**Modal Footer**: 
- Navigation dots showing which tab (1-6)
- Previous/Next buttons
- Final tab has 'Let's Go!' button that closes modal and navigates to /game

**Styling**: 
- Dark background with purple/pink gradient header
- Smooth tab transitions
- Mobile responsive (stack vertically)
- Close button (X) in top right"

---

## Quick Copy-Paste Addition:

Add this section to your v0.dev prompt after generating the initial landing page:

"Add an Instructions Modal that opens when clicking the 'How to Play' button. Use Radix Dialog component with 6 tabs showing: (1) Game Basics, (2) How to Play steps, (3) Random Events, (4) Rank System, (5) Referral Program, (6) Ready to Play. Include Previous/Next navigation and close with 'Let's Go!' button that navigates to /game. Style with dark theme and purple/pink gradients."
