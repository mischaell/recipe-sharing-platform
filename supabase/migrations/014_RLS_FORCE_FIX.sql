-- ============================================
-- FORCE FIX RLS - ABSOLUTE SIMPLEST
-- ============================================
-- This is the absolute simplest possible fix
-- If this doesn't work, the issue is with Supabase auth context

-- Step 1: Ensure RLS is enabled
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (complete clean slate)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on comments
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'comments') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON comments';
    END LOOP;
    -- Drop all policies on recipe_likes
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'recipe_likes') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON recipe_likes';
    END LOOP;
    -- Drop all policies on comment_likes
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'comment_likes') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON comment_likes';
    END LOOP;
END $$;

-- Step 3: Create ABSOLUTE SIMPLEST policies
-- Comments: SELECT - anyone can read non-deleted
CREATE POLICY "comments_select_policy"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Comments: INSERT - ONLY check if authenticated (no profile check, no user_id check)
CREATE POLICY "comments_insert_policy"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Comments: UPDATE - authenticated users can update
CREATE POLICY "comments_update_policy"
  ON comments FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Recipe Likes: SELECT
CREATE POLICY "recipe_likes_select_policy"
  ON recipe_likes FOR SELECT
  USING (true);

-- Recipe Likes: INSERT
CREATE POLICY "recipe_likes_insert_policy"
  ON recipe_likes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Recipe Likes: DELETE
CREATE POLICY "recipe_likes_delete_policy"
  ON recipe_likes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Comment Likes: SELECT
CREATE POLICY "comment_likes_select_policy"
  ON comment_likes FOR SELECT
  USING (true);

-- Comment Likes: INSERT
CREATE POLICY "comment_likes_insert_policy"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Comment Likes: DELETE
CREATE POLICY "comment_likes_delete_policy"
  ON comment_likes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Step 4: Verify policies were created
SELECT 
  tablename,
  policyname,
  cmd as operation,
  with_check
FROM pg_policies 
WHERE tablename IN ('comments', 'recipe_likes', 'comment_likes')
ORDER BY tablename, policyname;


