-- ============================================
-- SIMPLE RLS TEST - MINIMAL POLICIES
-- ============================================
-- This is the SIMPLEST possible RLS policy to test
-- If this works, we know auth.role() works
-- If this fails, the issue is with authentication context

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

-- Step 3: Create SIMPLEST possible policies
-- Comments: SELECT (anyone can read non-deleted)
CREATE POLICY "comments_select_simple"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Comments: INSERT (ONLY auth.role() check - no profile check)
CREATE POLICY "comments_insert_simple"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Comments: UPDATE (simple authenticated check)
CREATE POLICY "comments_update_simple"
  ON comments FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Recipe Likes: SELECT (anyone can read)
CREATE POLICY "recipe_likes_select_simple"
  ON recipe_likes FOR SELECT
  USING (true);

-- Recipe Likes: INSERT (ONLY auth.role() check)
CREATE POLICY "recipe_likes_insert_simple"
  ON recipe_likes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Recipe Likes: DELETE (simple authenticated check)
CREATE POLICY "recipe_likes_delete_simple"
  ON recipe_likes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Comment Likes: SELECT (anyone can read)
CREATE POLICY "comment_likes_select_simple"
  ON comment_likes FOR SELECT
  USING (true);

-- Comment Likes: INSERT (ONLY auth.role() check)
CREATE POLICY "comment_likes_insert_simple"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Comment Likes: DELETE (simple authenticated check)
CREATE POLICY "comment_likes_delete_simple"
  ON comment_likes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Step 4: Verify policies
SELECT 
  tablename,
  policyname,
  cmd as operation,
  with_check
FROM pg_policies 
WHERE tablename IN ('comments', 'recipe_likes', 'comment_likes')
ORDER BY tablename, policyname;

