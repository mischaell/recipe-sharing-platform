# Connect to GitHub - Step by Step Guide

## Option 1: Create a New GitHub Repository

### Step 1: Create Repository on GitHub
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `recipe-sharing-platform` (or your preferred name)
   - **Description**: "Recipe sharing platform built with Next.js and Supabase"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (you already have these)
4. Click **"Create repository"**

### Step 2: Connect Your Local Repository
After creating the repo, GitHub will show you commands. Run these in your terminal:

```bash
# Make sure you're in the recipe-sharing-platform directory
cd /Users/michaelstephanblome/Dropbox/cursor-projects-1/recipe-sharing-platform

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/recipe-sharing-platform.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/recipe-sharing-platform.git

# Push your code
git branch -M main
git push -u origin main
```

## Option 2: Connect to Existing Repository

If you already have a GitHub repository:

```bash
# Add the remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push your code
git push -u origin main
```

## Check Current Status

To see if you already have a remote configured:
```bash
git remote -v
```

If you see output, you already have a remote. If it's empty, you need to add one.

## Important Notes

- **Never commit sensitive files**: Make sure `.env.local` is in `.gitignore`
- **Check your .gitignore**: Ensure it includes:
  - `.env.local`
  - `.env`
  - `node_modules/`
  - `.next/`
  - etc.

## Quick Commands Reference

```bash
# Check git status
git status

# Check remotes
git remote -v

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```


