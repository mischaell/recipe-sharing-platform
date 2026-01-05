-- ============================================
-- CHECK INSERT POLICY SPECIFICALLY
-- ============================================
-- This will show us the exact INSERT policy

-- Show all INSERT policies on comments
SELECT 
  policyname,
  cmd as operation,
  roles,
  permissive,
  qual as using_clause,
  with_check
FROM pg_policies 
WHERE tablename = 'comments' AND cmd = 'INSERT';

-- Show the raw policy definition
SELECT 
  pol.polname as policy_name,
  pol.polcmd as operation,
  pg_get_expr(pol.polqual, pol.polrelid) as using_expression,
  pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression,
  CASE pol.polpermissive
    WHEN 't' THEN 'PERMISSIVE'
    WHEN 'f' THEN 'RESTRICTIVE'
  END as permissive_type,
  array_to_string(pol.polroles::regrole[], ', ') as roles
FROM pg_policy pol
JOIN pg_class pc ON pol.polrelid = pc.oid
WHERE pc.relname = 'comments' AND pol.polcmd = 'i';



