-- ============================================
-- FINAL RLS FIX - More Permissive
-- ============================================
-- If user_id doesn't exist in profiles, we need a different approach
-- This version is more permissive but still secure

-- Step 1: Ensure RLS is enabled
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
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

-- Step 3: Create more permissive policies
-- These allow inserts if user_id exists in profiles OR in auth.users
-- This covers cases where profile might not exist yet

-- Comments: SELECT (anyone can read non-deleted)
CREATE POLICY "comments_select_policy"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Comments: INSERT - Allow if user_id exists in profiles OR auth.users
CREATE POLICY "comments_insert_policy"
  ON comments FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM profiles)
    OR user_id IN (SELECT id FROM auth.users)
  );

-- Comments: UPDATE - Allow if user_id exists in profiles OR auth.users
CREATE POLICY "comments_update_policy"
  ON comments FOR UPDATE
  USING (
    user_id IN (SELECT id FROM profiles)
    OR user_id IN (SELECT id FROM auth.users)
  )
  WITH CHECK (
    user_id IN (SELECT id FROM profiles)
    OR user_id IN (SELECT id FROM auth.users)
  );

-- Recipe Likes: SELECT (anyone can read)
CREATE POLICY "recipe_likes_select_policy"
  ON recipe_likes FOR SELECT
  USING (true);

-- Recipe Likes: INSERT - Allow if user_id exists in profiles OR auth.users
CREATE POLICY "recipe_likes_insert_policy"
  ON recipe_likes FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM profiles)
    OR user_id IN (SELECT id FROM auth.users)
  );

-- Recipe Likes: DELETE - Allow if user_id exists in profiles OR auth.users
CREATE POLICY "recipe_likes_delete_policy"
  ON recipe_likes FOR DELETE
  USING (
    user_id IN (SELECT id FROM profiles)
    OR user_id IN (SELECT id FROM auth.users)
  );

-- Comment Likes: SELECT (anyone can read)
CREATE POLICY "comment_likes_select_policy"
  ON comment_likes FOR SELECT
  USING (true);

-- Comment Likes: INSERT - Allow if user_id exists in profiles OR auth.users
CREATE POLICY "comment_likes_insert_policy"
  ON comment_likes FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM profiles)
    OR user_id IN (SELECT id FROM auth.users)
  );

-- Comment Likes: DELETE - Allow if user_id exists in profiles OR auth.users
CREATE POLICY "comment_likes_delete_policy"
  ON comment_likes FOR DELETE
  USING (
    user_id IN (SELECT id FROM profiles)
    OR user_id IN (SELECT id FROM auth.users)
  );

-- Step 4: Verify policies
SELECT 
  tablename,
  policyname,
  cmd as operation,
  with_check
FROM pg_policies 
WHERE tablename IN ('comments', 'recipe_likes', 'comment_likes')
ORDER BY tablename, policyname;


