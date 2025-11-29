# VERCEL 404 FIX - QUICK CHECKLIST

## 🔍 Step 1: Check Root Directory (MOST COMMON ISSUE)

1. Go to **Vercel Dashboard** → **trap-wars** project
2. Click **Settings** → **General**
3. Scroll to **"Root Directory"**
4. It MUST say: `app`
5. If it's blank or says something else, click **Edit** → type `app` → **Save**

## 🔍 Step 2: Check Latest Deployment Status

1. Go to **Deployments** tab
2. Look for the most recent one (top of list)
3. What's the status?
   - 🟢 **Ready** = Good! Check Root Directory.
   - 🔴 **Failed** = Click it to see error logs.
   - 🟡 **Building** = Wait for it to finish.

## 🔍 Step 3: If "Ready" But Still 404

This means Root Directory is wrong. The site is looking in the wrong folder.

**Fix:**
1. Settings → General → Root Directory = `app`
2. Save
3. Deployments → Redeploy (latest one)

## 🔍 Step 4: If Deployment "Failed"

1. Click the failed deployment
2. Go to **Build Logs**
3. Scroll to the bottom
4. Copy the error message
5. Send it to me

## ⚡ Most Likely Issue:

**Root Directory is NOT set to `app`**

We set it before, but sometimes Vercel resets it. Double-check Settings → General → Root Directory.
