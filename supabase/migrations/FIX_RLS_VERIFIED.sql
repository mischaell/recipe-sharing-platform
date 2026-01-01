-- ============================================
-- FIX RLS POLICIES - VERIFIED APPROACH
-- ============================================
-- This version uses a more explicit check that verifies
-- the user_id exists in profiles and matches auth.uid()

-- ============================================
-- DROP EXISTING POLICIES
-- ============================================
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

DROP POLICY IF EXISTS "Recipe likes are viewable by everyone" ON recipe_likes;
DROP POLICY IF EXISTS "Users can create their own likes" ON recipe_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON recipe_likes;

DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON comment_likes;
DROP POLICY IF EXISTS "Users can create their own comment likes" ON comment_likes;
DROP POLICY IF EXISTS "Users can delete their own comment likes" ON comment_likes;

-- ============================================
-- COMMENTS POLICIES (VERIFIED)
-- ============================================

-- Anyone can read non-deleted comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Users can create comments
-- Verify that user_id exists in profiles and matches auth.uid()
CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_id
      AND profiles.id = auth.uid()
    )
  );

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = comments.user_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = comments.user_id
      AND profiles.id = auth.uid()
    )
  );

-- Users can soft delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = comments.user_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = comments.user_id
      AND profiles.id = auth.uid()
      AND deleted_at IS NOT NULL
    )
  );

-- ============================================
-- RECIPE LIKES POLICIES (VERIFIED)
-- ============================================

-- Anyone can read likes
CREATE POLICY "Recipe likes are viewable by everyone"
  ON recipe_likes FOR SELECT
  USING (true);

-- Users can create their own likes
CREATE POLICY "Users can create their own likes"
  ON recipe_likes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_id
      AND profiles.id = auth.uid()
    )
  );

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
  ON recipe_likes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = recipe_likes.user_id
      AND profiles.id = auth.uid()
    )
  );

-- ============================================
-- COMMENT LIKES POLICIES (VERIFIED)
-- ============================================

-- Anyone can read comment likes
CREATE POLICY "Comment likes are viewable by everyone"
  ON comment_likes FOR SELECT
  USING (true);

-- Users can create their own comment likes
CREATE POLICY "Users can create their own comment likes"
  ON comment_likes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_id
      AND profiles.id = auth.uid()
    )
  );

-- Users can delete their own comment likes
CREATE POLICY "Users can delete their own comment likes"
  ON comment_likes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = comment_likes.user_id
      AND profiles.id = auth.uid()
    )
  );


