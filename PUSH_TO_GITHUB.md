# Push to GitHub - Authentication Options

## Option 1: Use Personal Access Token (Easiest)

### Step 1: Create Personal Access Token on GitHub
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Recipe Platform"
4. Select scopes: Check `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Push Using Token
When you run `git push`, use your token as the password:

```bash
git push -u origin main
# Username: mischaell
# Password: [paste your personal access token here]
```

Or use the token directly in the URL:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/mischaell/recipe-sharing-platform.git
git push -u origin main
```

## Option 2: Use SSH (More Secure)

### Step 1: Check if you have SSH keys
```bash
ls -la ~/.ssh/id_*.pub
```

### Step 2: If no keys, generate one
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Press Enter twice for no passphrase (or set one)
```

### Step 3: Add SSH key to GitHub
1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to GitHub.com → Settings → SSH and GPG keys → New SSH key
3. Paste the key and save

### Step 4: Change remote to SSH
```bash
git remote set-url origin git@github.com:mischaell/recipe-sharing-platform.git
git push -u origin main
```

## Option 3: Use GitHub CLI (gh)

If you have GitHub CLI installed:
```bash
gh auth login
gh repo create recipe-sharing-platform --public --source=. --remote=origin --push
```

## Quick Check

To see your current remote:
```bash
git remote -v
```



