# Fix RLS Issue - Step by Step

## The Problem
RLS is still blocking comment inserts even after applying fixes.

## Solution Steps

### Step 1: Check Current Status
1. Go to **Supabase Dashboard → SQL Editor**
2. Run `013_CHECK_RLS_STATUS.sql`
3. **Share the results** - especially:
   - Is RLS enabled? (should be `true`)
   - What policies exist?
   - What does `auth.role()` return?

### Step 2: Apply Absolute Simplest Fix
1. In **Supabase SQL Editor**, run `014_RLS_FORCE_FIX.sql`
2. This creates the **simplest possible policies** (only checks `auth.role() = 'authenticated'`)
3. Try posting a comment
4. **Does it work?**

### Step 3: If Still Not Working
The issue is likely that `auth.role()` is returning NULL in the database context.

**Option A: Temporarily disable RLS for testing**
```sql
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
```
Then test if comments work. If they do, the issue is definitely with RLS policies.

**Option B: Use service role key (NOT RECOMMENDED for production)**
This bypasses RLS but is insecure.

## What to Share
1. Results from Step 1 (diagnostic query)
2. Whether Step 2 worked
3. The exact error message you're seeing


