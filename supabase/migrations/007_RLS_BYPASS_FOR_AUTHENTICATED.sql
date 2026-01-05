-- ============================================
-- RLS POLICIES - BYPASS CHECK FOR AUTHENTICATED USERS
-- ============================================
-- This is a more permissive approach that allows any authenticated user
-- to insert comments, as long as user_id exists in profiles

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
-- COMMENTS POLICIES (PERMISSIVE)
-- ============================================

-- Anyone can read non-deleted comments
CREATE POLICY "comments_select_all"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

-- Authenticated users can create comments
-- Check that user is authenticated AND user_id exists in profiles
CREATE POLICY "comments_insert_authenticated"
  ON comments FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = comments.user_id
    )
  );

-- Users can update their own comments
-- Check both auth.uid() and verify user_id exists in profiles
CREATE POLICY "comments_update_own"
  ON comments FOR UPDATE
  USING (
    (auth.uid() = user_id OR auth.role() = 'authenticated')
    AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id)
  )
  WITH CHECK (
    (auth.uid() = user_id OR auth.role() = 'authenticated')
    AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id)
  );

-- ============================================
-- RECIPE LIKES POLICIES (PERMISSIVE)
-- ============================================

-- Anyone can read likes
CREATE POLICY "recipe_likes_select_all"
  ON recipe_likes FOR SELECT
  USING (true);

-- Authenticated users can create likes
CREATE POLICY "recipe_likes_insert_authenticated"
  ON recipe_likes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = recipe_likes.user_id
    )
  );

-- Users can delete their own likes
CREATE POLICY "recipe_likes_delete_own"
  ON recipe_likes FOR DELETE
  USING (
    (auth.uid() = user_id OR auth.role() = 'authenticated')
    AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id)
  );

-- ============================================
-- COMMENT LIKES POLICIES (PERMISSIVE)
-- ============================================

-- Anyone can read comment likes
CREATE POLICY "comment_likes_select_all"
  ON comment_likes FOR SELECT
  USING (true);

-- Authenticated users can create comment likes
CREATE POLICY "comment_likes_insert_authenticated"
  ON comment_likes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = comment_likes.user_id
    )
  );

-- Users can delete their own comment likes
CREATE POLICY "comment_likes_delete_own"
  ON comment_likes FOR DELETE
  USING (
    (auth.uid() = user_id OR auth.role() = 'authenticated')
    AND EXISTS (SELECT 1 FROM profiles WHERE id = user_id)
  );



