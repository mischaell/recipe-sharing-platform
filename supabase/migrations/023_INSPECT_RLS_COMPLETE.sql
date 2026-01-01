-- ============================================
-- COMPLETE RLS INSPECTION
-- ============================================
-- Run this and share ALL the results

-- 1. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'comments';

-- 2. List ALL policies on comments table with full details
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
WHERE tablename = 'comments'
ORDER BY policyname;

-- 3. Check the actual policy definitions from pg_policy
SELECT 
  pol.polname as policy_name,
  pol.polcmd as operation,
  pg_get_expr(pol.polqual, pol.polrelid) as using_expression,
  pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression,
  CASE pol.polpermissive
    WHEN 't' THEN 'PERMISSIVE'
    WHEN 'f' THEN 'RESTRICTIVE'
  END as permissive_type,
  pol.polroles::regrole[] as roles
FROM pg_policy pol
JOIN pg_class pc ON pol.polrelid = pc.oid
WHERE pc.relname = 'comments';

-- 4. Check if function exists
SELECT 
  proname as function_name,
  proargnames as parameter_names,
  pg_get_functiondef(oid) as function_definition
FROM pg_proc
WHERE proname = 'insert_comment';

-- 5. Test: Try to see what user_id values are in profiles
SELECT 
  id,
  display_name,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- 6. Show recent comments and their user_ids
SELECT 
  id,
  recipe_id,
  user_id,
  LEFT(content, 50) as content_preview,
  created_at
FROM comments
ORDER BY created_at DESC
LIMIT 5;


