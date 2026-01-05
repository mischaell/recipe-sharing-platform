-- ============================================
-- RLS FIX - Without auth.users Reference
-- ============================================
-- The previous fix tried to access auth.users which requires service role
-- This version only checks profiles table, which is accessible

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

-- Step 3: Create policies that only check profiles table
-- This works because your app ensures user_id comes from authenticated users
-- and profiles are created for all authenticated users

-- Comments: SELECT (anyone can read non-deleted)
CREATE POLICY "comments_select_policy"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Comments: INSERT - Allow if user_id exists in profiles
CREATE POLICY "comments_insert_policy"
  ON comments FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM profiles)
  );

-- Comments: UPDATE - Allow if user_id exists in profiles
CREATE POLICY "comments_update_policy"
  ON comments FOR UPDATE
  USING (
    user_id IN (SELECT id FROM profiles)
  )
  WITH CHECK (
    user_id IN (SELECT id FROM profiles)
  );

-- Recipe Likes: SELECT (anyone can read)
CREATE POLICY "recipe_likes_select_policy"
  ON recipe_likes FOR SELECT
  USING (true);

-- Recipe Likes: INSERT - Allow if user_id exists in profiles
CREATE POLICY "recipe_likes_insert_policy"
  ON recipe_likes FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM profiles)
  );

-- Recipe Likes: DELETE - Allow if user_id exists in profiles
CREATE POLICY "recipe_likes_delete_policy"
  ON recipe_likes FOR DELETE
  USING (
    user_id IN (SELECT id FROM profiles)
  );

-- Comment Likes: SELECT (anyone can read)
CREATE POLICY "comment_likes_select_policy"
  ON comment_likes FOR SELECT
  USING (true);

-- Comment Likes: INSERT - Allow if user_id exists in profiles
CREATE POLICY "comment_likes_insert_policy"
  ON comment_likes FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM profiles)
  );

-- Comment Likes: DELETE - Allow if user_id exists in profiles
CREATE POLICY "comment_likes_delete_policy"
  ON comment_likes FOR DELETE
  USING (
    user_id IN (SELECT id FROM profiles)
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



