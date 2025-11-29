# How to Create a GitHub Repo for v0.dev

I cannot create a GitHub repository for you because I don't have access to your GitHub account password or permissions. **You must do this part.**

Here is the easiest way to do it:

## Step 1: Create the Repo on GitHub
1. Go to **[github.com/new](https://github.com/new)**
2. **Repository name**: `trap-wars`
3. **Description**: "Solana blockchain game"
4. **Public/Private**: Choose **Public** (easiest for v0 to see) or Private.
5. **Initialize**: Do **NOT** check any boxes (no README, no .gitignore).
6. Click **Create repository**.
7. **Copy the URL** provided (it looks like `https://github.com/YOUR_USERNAME/trap-wars.git`).

## Step 2: Push Your Code
I have created a script called `setup_git.bat` in this folder to do the hard work for you.

1. **Open your terminal** in VS Code.
2. **Run this command** (replace the URL with YOUR repo URL):
   ```powershell
   .\setup_git.bat https://github.com/YOUR_USERNAME/trap-wars.git
   ```

## Step 3: Give v0 the Link
Once Step 2 is done, go back to v0.dev and paste the link:
`https://github.com/YOUR_USERNAME/trap-wars`

---

### Manual Commands (If you prefer)
If the script doesn't work, run these commands in your terminal:

```bash
git init
git add .
git commit -m "Initial commit of TRAP WARS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/trap-wars.git
git push -u origin main
```
