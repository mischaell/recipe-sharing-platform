-- ============================================
-- COMPLETELY FIX THE INSERT POLICY
-- ============================================
-- Drop and recreate the policy from scratch

-- Step 1: Drop the existing INSERT policy
DROP POLICY IF EXISTS "comments_insert_via_function" ON comments;

-- Step 2: Create a new, simple INSERT policy
-- This policy allows ANY authenticated user to insert
CREATE POLICY "comments_insert_authenticated"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Step 3: Verify the policy was created
SELECT 
  policyname,
  cmd as operation,
  roles,
  with_check
FROM pg_policies 
WHERE tablename = 'comments' AND cmd = 'INSERT';

-- Step 4: Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'comments';

