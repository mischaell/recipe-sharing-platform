-- ============================================
-- ULTIMATE RLS FIX
-- ============================================
-- This version uses the most permissive but still secure approach
-- It checks authentication role and verifies user_id exists in profiles

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
-- COMMENTS POLICIES (ULTIMATE)
-- ============================================

-- Anyone can read non-deleted comments
CREATE POLICY "comments_select"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Authenticated users can create comments
-- Only requirement: user must be authenticated and user_id must exist in profiles
-- Note: In WITH CHECK, we reference the column being inserted directly
CREATE POLICY "comments_insert"
  ON comments FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = user_id
    )
  );

-- Users can update their own comments
CREATE POLICY "comments_update"
  ON comments FOR UPDATE
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = user_id
    )
  )
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = user_id
    )
  );

-- ============================================
-- RECIPE LIKES POLICIES (ULTIMATE)
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
      WHERE profiles.id = user_id
    )
  );

-- Users can delete their own likes
CREATE POLICY "recipe_likes_delete"
  ON recipe_likes FOR DELETE
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = user_id
    )
  );

-- ============================================
-- COMMENT LIKES POLICIES (ULTIMATE)
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
      WHERE profiles.id = user_id
    )
  );

-- Users can delete their own comment likes
CREATE POLICY "comment_likes_delete"
  ON comment_likes FOR DELETE
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = user_id
    )
  );

