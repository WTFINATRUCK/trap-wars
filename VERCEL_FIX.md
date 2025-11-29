# How to Fix Vercel 404 Error

The error happens because your code is inside an `app` folder, but Vercel is looking for it in the main folder.

## The Fix (Takes 30 Seconds)

1. Go to your **Vercel Dashboard**
2. Click on your **trap-wars** project
3. Go to **Settings** (top tab)
4. Go to **General** (side menu)
5. Scroll down to **"Root Directory"**
6. Click **Edit**
7. Type: `app`
8. Click **Save**

## Redeploy

After saving the setting:
1. Go to **Deployments** (top tab)
2. Click the **three dots** (...) on the failed deployment
3. Click **Redeploy**

It should work perfectly now! ✅
