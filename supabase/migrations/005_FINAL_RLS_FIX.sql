-- ============================================
-- FINAL RLS FIX FOR COMMENTS AND LIKES
-- ============================================
-- This is the definitive fix. Run this in Supabase SQL Editor.

-- First, let's verify RLS is enabled
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
CREATE POLICY "comments_select_policy"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Users can create comments
-- The key: user_id must equal auth.uid() AND exist in profiles
CREATE POLICY "comments_insert_policy"
  ON comments FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );

-- Users can update their own comments
CREATE POLICY "comments_update_policy"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RECIPE LIKES POLICIES
-- ============================================

-- Anyone can read likes
CREATE POLICY "recipe_likes_select_policy"
  ON recipe_likes FOR SELECT
  USING (true);

-- Users can create their own likes
CREATE POLICY "recipe_likes_insert_policy"
  ON recipe_likes FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );

-- Users can delete their own likes
CREATE POLICY "recipe_likes_delete_policy"
  ON recipe_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENT LIKES POLICIES
-- ============================================

-- Anyone can read comment likes
CREATE POLICY "comment_likes_select_policy"
  ON comment_likes FOR SELECT
  USING (true);

-- Users can create their own comment likes
CREATE POLICY "comment_likes_insert_policy"
  ON comment_likes FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );

-- Users can delete their own comment likes
CREATE POLICY "comment_likes_delete_policy"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);


