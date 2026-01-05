-- ============================================
-- RLS POLICIES WITH HELPER FUNCTION
-- ============================================
-- This approach uses a helper function to get the current user ID
-- which can be more reliable than auth.uid() in some contexts

-- ============================================
-- CREATE HELPER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DROP EXISTING POLICIES
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

-- Users can create comments
-- Use the helper function which is more reliable
CREATE POLICY "comments_insert"
  ON comments FOR INSERT
  WITH CHECK (
    get_current_user_id() IS NOT NULL 
    AND user_id = get_current_user_id()
  );

-- Users can update their own comments
CREATE POLICY "comments_update"
  ON comments FOR UPDATE
  USING (get_current_user_id() = user_id)
  WITH CHECK (get_current_user_id() = user_id);

-- ============================================
-- RECIPE LIKES POLICIES
-- ============================================

-- Anyone can read likes
CREATE POLICY "recipe_likes_select"
  ON recipe_likes FOR SELECT
  USING (true);

-- Users can create their own likes
CREATE POLICY "recipe_likes_insert"
  ON recipe_likes FOR INSERT
  WITH CHECK (
    get_current_user_id() IS NOT NULL 
    AND user_id = get_current_user_id()
  );

-- Users can delete their own likes
CREATE POLICY "recipe_likes_delete"
  ON recipe_likes FOR DELETE
  USING (get_current_user_id() = user_id);

-- ============================================
-- COMMENT LIKES POLICIES
-- ============================================

-- Anyone can read comment likes
CREATE POLICY "comment_likes_select"
  ON comment_likes FOR SELECT
  USING (true);

-- Users can create their own comment likes
CREATE POLICY "comment_likes_insert"
  ON comment_likes FOR INSERT
  WITH CHECK (
    get_current_user_id() IS NOT NULL 
    AND user_id = get_current_user_id()
  );

-- Users can delete their own comment likes
CREATE POLICY "comment_likes_delete"
  ON comment_likes FOR DELETE
  USING (get_current_user_id() = user_id);



