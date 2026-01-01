-- ============================================
-- FINAL WORKING RLS POLICIES
-- ============================================
-- This uses auth.role() check instead of auth.uid() 
-- which is more reliable when session context isn't perfect

-- Ensure RLS is enabled
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP ALL EXISTING POLICIES
-- ============================================
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

-- ============================================
-- COMMENTS POLICIES
-- ============================================

-- Anyone can read non-deleted comments
CREATE POLICY "comments_select"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Authenticated users can create comments
-- Check: user is authenticated AND user_id exists in profiles
CREATE POLICY "comments_insert"
  ON comments FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = comments.user_id
    )
  );

-- Users can update their own comments
-- Try auth.uid() first, fallback to checking user_id exists in profiles
CREATE POLICY "comments_update"
  ON comments FOR UPDATE
  USING (
    (auth.uid() = user_id) OR 
    (auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id))
  )
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id))
  );

-- ============================================
-- RECIPE LIKES POLICIES
-- ============================================

-- Anyone can read likes
CREATE POLICY "recipe_likes_select"
  ON recipe_likes FOR SELECT
  USING (true);

-- Authenticated users can create likes
CREATE POLICY "recipe_likes_insert"
  ON recipe_likes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = recipe_likes.user_id
    )
  );

-- Users can delete their own likes
CREATE POLICY "recipe_likes_delete"
  ON recipe_likes FOR DELETE
  USING (
    (auth.uid() = user_id) OR 
    (auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id))
  );

-- ============================================
-- COMMENT LIKES POLICIES
-- ============================================

-- Anyone can read comment likes
CREATE POLICY "comment_likes_select"
  ON comment_likes FOR SELECT
  USING (true);

-- Authenticated users can create comment likes
CREATE POLICY "comment_likes_insert"
  ON comment_likes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = comment_likes.user_id
    )
  );

-- Users can delete their own comment likes
CREATE POLICY "comment_likes_delete"
  ON comment_likes FOR DELETE
  USING (
    (auth.uid() = user_id) OR 
    (auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id))
  );

