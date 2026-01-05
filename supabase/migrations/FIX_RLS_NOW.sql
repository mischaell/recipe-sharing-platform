-- ============================================
-- FIX RLS POLICIES FOR COMMENTS AND LIKES
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor and run it
-- This will fix the "new row violates row-level security policy" error

-- ============================================
-- DROP EXISTING POLICIES (if they exist)
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
-- COMMENTS POLICIES
-- ============================================

-- Anyone can read non-deleted comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Users can create comments
-- Note: user_id in comments table references profiles.id, which equals auth.uid()
CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can soft delete their own comments (set deleted_at)
CREATE POLICY "Users can delete their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND deleted_at IS NOT NULL);

-- ============================================
-- RECIPE LIKES POLICIES
-- ============================================

-- Anyone can read likes
CREATE POLICY "Recipe likes are viewable by everyone"
  ON recipe_likes FOR SELECT
  USING (true);

-- Users can create their own likes
CREATE POLICY "Users can create their own likes"
  ON recipe_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
  ON recipe_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENT LIKES POLICIES
-- ============================================

-- Anyone can read comment likes
CREATE POLICY "Comment likes are viewable by everyone"
  ON comment_likes FOR SELECT
  USING (true);

-- Users can create their own comment likes
CREATE POLICY "Users can create their own comment likes"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comment likes
CREATE POLICY "Users can delete their own comment likes"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);



