-- ============================================
-- CHECK CURRENT RLS STATUS
-- ============================================
-- Run this first to see what's currently active

-- 1. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('comments', 'recipe_likes', 'comment_likes')
ORDER BY tablename;

-- 2. List all current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation,
  qual as using_clause,
  with_check
FROM pg_policies 
WHERE tablename IN ('comments', 'recipe_likes', 'comment_likes')
ORDER BY tablename, policyname;

-- 3. Check if auth.role() function exists and works
SELECT 
  auth.role() as current_role,
  auth.uid() as current_uid;

