# TRAP WARS - Deployment Errors & Issues Log

## Current Status
**Last Updated:** 2025-11-29  
**Deployment Target:** GitHub Pages  
**Build Status:** ❌ FAILING

---

## Critical Issues

### 1. Tailwind CSS Configuration Error
**Status:** 🔴 BLOCKING BUILD  
**Error Message:**
```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
```

**Root Cause:**
- Mismatch between PostCSS configuration and Tailwind CSS v3.4.1
- The error occurs when importing `@solana/wallet-adapter-react-ui/styles.css`

**Files Affected:**
- `postcss.config.js`
- `tailwind.config.js`
- `components/WalletContextProvider.tsx`

**Attempted Fixes:**
- ✅ Downgraded Tailwind from v4 to v3.4.1
- ✅ Created standard `tailwind.config.js`
- ✅ Created standard `postcss.config.js`
- ❌ Issue persists

**Next Steps:**
- Investigate wallet adapter CSS import compatibility
- Consider removing wallet adapter CSS import
- Test with alternative PostCSS configuration

---

### 2. Next.js Static Export Incompatibility
**Status:** 🟡 RESOLVED  
**Error Message:**
```
Error: Page "/api/deploy" is incompatible with `output: export`.
```

**Root Cause:**
- GitHub Pages requires static export (`output: 'export'`)
- API routes are not supported in static exports

**Resolution:**
- ✅ Removed `app/api/deploy/route.ts`
- ✅ Added `output: 'export'` to `next.config.ts`
- ✅ Added `images: { unoptimized: true }` for static compatibility

---

### 3. Vercel Deployment Issues (Historical)
**Status:** 🟡 ABANDONED (Switched to GitHub Pages)  

**Issues Encountered:**
1. **Root Directory Confusion**
   - Vercel couldn't find `package.json` when Root Directory was set to `app`
   - Error: "No Next.js version detected"

2. **404 Errors on Routes**
   - `/game` route returned 404 despite successful builds
   - Suspected SSR/hydration issues with wallet components

3. **Build Cache Problems**
   - Persistent failures even after configuration fixes
   - Required multiple cache clears and redeployments

**Attempted Fixes:**
- ✅ Flattened project structure (moved `app/` contents to root)
- ✅ Disabled SSR for game routes (`dynamic` import with `ssr: false`)
- ✅ Cleared Vercel build cache
- ✅ Reset Root Directory setting
- ❌ Issues persisted, switched to GitHub Pages

---

## GitHub Actions Deployment Issues

### Build Failures
**Workflow:** `.github/workflows/deploy.yml`  
**Failure Count:** 4 consecutive failures

**Timeline:**
1. **Attempt #1** - Configure for GitHub Pages deployment (6e551d7)
   - Duration: 3s
   - Error: Missing `app` directory

2. **Attempt #2** - Trigger GitHub Pages deployment (585ea4e)
   - Duration: 19s
   - Error: API routes incompatible with static export

3. **Attempt #3** - Remove API routes (0bdf503)
   - Duration: 17s
   - Error: Tailwind CSS PostCSS plugin error

4. **Attempt #4** - Current
   - Status: Pending fix
   - Error: Same Tailwind CSS error

---

## Dependency Warnings (Non-Critical)

These warnings appear during `npm install` but do not block builds:

```
npm warn deprecated uuidv4@6.2.13
npm warn deprecated lodash.isequal@4.5.0
npm warn deprecated @toruslabs/solana-embed@2.1.0
npm warn deprecated @walletconnect/sign-client@2.19.0
npm warn deprecated @walletconnect/universal-provider@2.19.0
```

**Impact:** None - These are deprecation notices for transitive dependencies  
**Action Required:** None (libraries will update in future releases)

---

## Configuration Files Status

### ✅ Working Files
- `package.json` - All dependencies installed correctly
- `next.config.ts` - Configured for static export
- `.github/workflows/deploy.yml` - Workflow syntax valid
- `tsconfig.json` - TypeScript configuration valid

### ⚠️ Problematic Files
- `postcss.config.js` - Causing Tailwind CSS error
- `tailwind.config.js` - May need adjustment for wallet adapter styles

### 📁 Project Structure
```
trap-wars/
├── app/                    # Next.js app directory (pages, layouts)
├── components/             # React components
├── lib/                    # Utility libraries
├── public/                 # Static assets
├── package.json            # Dependencies (in root ✅)
├── next.config.ts          # Next.js config (in root ✅)
├── tailwind.config.js      # Tailwind config (in root ✅)
└── .github/workflows/      # GitHub Actions
```

---

## Known Working Configurations

### Local Development
- ✅ `npm run dev` works perfectly
- ✅ All routes accessible
- ✅ Wallet connection functional
- ✅ Game mechanics working

### Build Command
- ❌ `npm run build` fails with Tailwind error
- ❌ Cannot generate static export

---

## Recommended Next Actions

1. **Immediate Priority:** Fix Tailwind CSS PostCSS error
   - Option A: Remove wallet adapter CSS import, use custom styles
   - Option B: Adjust PostCSS configuration for compatibility
   - Option C: Import wallet adapter styles differently

2. **Alternative Deployment Options:**
   - Netlify (requires Netlify account setup)
   - Cloudflare Pages
   - Self-hosted on VPS

3. **Fallback Plan:**
   - Keep Vercel deployment (it was building successfully)
   - Accept the 404 issue as a Vercel-specific problem
   - Use GitHub Pages for documentation only

---

## Contact & Support

**Repository:** https://github.com/WTFINATRUCK/trap-wars  
**Deployment Target:** https://WTFINATRUCK.github.io/trap-wars (pending)  
**Build Logs:** Check GitHub Actions tab

---

*This document is automatically updated as new issues are discovered and resolved.*
