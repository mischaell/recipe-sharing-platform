-- ============================================
-- TEST RLS POLICY DIRECTLY
-- ============================================
-- This will help us understand why the policy is failing

-- First, let's see what user_id values exist in profiles
SELECT 
  id as profile_id,
  display_name,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- Now let's test if we can manually insert a comment
-- Replace 'YOUR_USER_ID_HERE' with an actual user_id from the profiles table above
-- This will tell us if the policy works at all

-- Example (uncomment and replace with real user_id):
/*
INSERT INTO comments (recipe_id, user_id, content)
VALUES (
  (SELECT id FROM recipes LIMIT 1),  -- Use any recipe_id
  'YOUR_USER_ID_HERE',                -- Replace with actual profile id
  'Test comment from SQL'
);
*/

-- Check if there are any existing comments and what user_ids they use
SELECT 
  id,
  recipe_id,
  user_id,
  content,
  created_at,
  CASE 
    WHEN user_id IN (SELECT id FROM profiles) THEN '✅ user_id in profiles'
    ELSE '❌ user_id NOT in profiles'
  END as profile_check
FROM comments
ORDER BY created_at DESC
LIMIT 10;


