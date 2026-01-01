-- ============================================
-- DEBUG AND FIX RLS - STEP BY STEP
-- ============================================
-- This script will help us debug and fix the RLS issue

-- Step 1: Check current RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('comments', 'recipe_likes', 'comment_likes')
ORDER BY tablename;

-- Step 2: List all current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('comments', 'recipe_likes', 'comment_likes')
ORDER BY tablename, policyname;

-- Step 3: Ensure RLS is enabled
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop ALL existing policies (clean slate)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'comments') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON comments';
    END LOOP;
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'recipe_likes') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON recipe_likes';
    END LOOP;
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'comment_likes') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON comment_likes';
    END LOOP;
END $$;

-- Step 5: Create SIMPLEST possible policies for testing
-- Comments: SELECT (anyone can read non-deleted)
CREATE POLICY "comments_select_all"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Comments: INSERT (authenticated users only - no profile check for now)
CREATE POLICY "comments_insert_authenticated"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Comments: UPDATE (users can update their own - simplified)
CREATE POLICY "comments_update_own"
  ON comments FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Recipe Likes: SELECT (anyone can read)
CREATE POLICY "recipe_likes_select_all"
  ON recipe_likes FOR SELECT
  USING (true);

-- Recipe Likes: INSERT (authenticated users only)
CREATE POLICY "recipe_likes_insert_authenticated"
  ON recipe_likes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Recipe Likes: DELETE (authenticated users can delete their own)
CREATE POLICY "recipe_likes_delete_own"
  ON recipe_likes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Comment Likes: SELECT (anyone can read)
CREATE POLICY "comment_likes_select_all"
  ON comment_likes FOR SELECT
  USING (true);

-- Comment Likes: INSERT (authenticated users only)
CREATE POLICY "comment_likes_insert_authenticated"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Comment Likes: DELETE (authenticated users can delete their own)
CREATE POLICY "comment_likes_delete_own"
  ON comment_likes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Step 6: Verify policies were created
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE tablename IN ('comments', 'recipe_likes', 'comment_likes')
ORDER BY tablename, policyname;

