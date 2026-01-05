-- ============================================
-- SIMPLE RLS POLICIES FIX
-- ============================================
-- This uses the simplest possible check: auth.uid() = user_id
-- Since user_id in comments references profiles(id), and profiles(id) = auth.users(id),
-- this should work directly.

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
-- COMMENTS POLICIES (SIMPLE)
-- ============================================

-- Anyone can read non-deleted comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Users can create comments
-- Direct check: auth.uid() must equal user_id
-- Note: user_id should be set to auth.uid() (which equals profiles.id)
CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can soft delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND deleted_at IS NOT NULL);

-- ============================================
-- RECIPE LIKES POLICIES (SIMPLE)
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
-- COMMENT LIKES POLICIES (SIMPLE)
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



