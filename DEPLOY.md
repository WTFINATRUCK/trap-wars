# TRAP WARS - Quick Deployment Guide

## ⚡ Fastest Method: Vercel (Recommended)

1. **Install Vercel CLI** (one time):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to app folder**:
   ```bash
   cd app
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Done!** Your site is live. Vercel will give you a URL.

---

## 🌐 Alternative: Netlify Drop

### Step 1: Build the Site
Open terminal in the `app` folder and run:
```bash
npm run build
```

### Step 2: Deploy
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the **app/.next** folder to the browser
3. Wait for upload - done!

---

## 🎯 What Each Method Does

**Vercel** (Easiest):
- Automatic builds
- Custom domain support
- Zero config needed
- Free tier available

**Netlify Drop** (Quick):
- Simple drag & drop
- No account setup needed (for drop)
- Free hosting
- Good for testing

---

## 🔧 Common Issues

**Build fails?**
- Make sure you're in the `/app` folder
- Run `npm install` first
- Check for errors in the terminal

**Drag/drop not working?**
- Make sure you're dragging the **`.next`** folder (NOT the .bat file)
- The folder should be the build output from `npm run build`

**Need a custom domain?**
- Use Vercel (easier) or Netlify (also easy)
- Both provide custom domain setup in their dashboards

---

## 📋 Full Steps (Vercel - Recommended)

```bash
# 1. Install Vercel (one time only)
npm install -g vercel

# 2. Navigate to your app
cd app

# 3. Deploy!
vercel --prod

# That's it! Follow the prompts and you're live.
```

Your site will be at: `https://your-project-name.vercel.app`

You can then add a custom domain in the Vercel dashboard.
