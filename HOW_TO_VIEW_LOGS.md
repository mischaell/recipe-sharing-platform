# How to View Server Logs

## Where to Find Server Logs

### Option 1: Terminal/Command Line
1. **Find the terminal window** where you ran `npm run dev`
   - This is usually the terminal/command prompt you opened when starting the dev server
   - Look for a window showing something like:
     ```
     ▲ Next.js 16.1.1
     - Local:        http://localhost:3000
     - Ready in 2.3s
     ```

2. **Look for logs** - Server-side `console.log()` and `console.error()` statements appear here
   - Look for logs with 🔵 (blue circle) or 🔴 (red circle) emojis
   - These are the server-side logs from your actions

### Option 2: VS Code Terminal
1. If you're using VS Code:
   - Open the **Terminal** panel (View → Terminal, or `Ctrl+` ` on Mac, `Ctrl+`` on Windows)
   - Look for the terminal tab that's running the dev server
   - Server logs will appear there

### Option 3: Check All Terminal Windows
1. If you can't find the terminal:
   - On Mac: Check all Terminal windows or tabs
   - On Windows: Check all Command Prompt or PowerShell windows
   - Look for the one showing Next.js output

## What to Look For

When you try to post a comment, you should see logs like:

```
🔵 [SERVER] Inserting comment with: {
  recipeId: '...',
  userId: '...',
  hasSession: true,
  sessionUserId: '...',
  sessionRole: 'authenticated'
}
```

Or if there's an error:
```
🔴 [SERVER] Error adding comment: {
  message: '...',
  code: '...',
  ...
}
```

## If You Can't Find the Terminal

1. **Restart the dev server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart it
   npm run dev
   ```

2. **This will show you:**
   - Where the logs appear
   - Fresh logs when you test

## Quick Test

1. Open/Find the terminal with `npm run dev` running
2. Try posting a comment in your app
3. Watch the terminal - you should see logs appear immediately


