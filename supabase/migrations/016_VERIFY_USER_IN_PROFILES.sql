-- ============================================
-- VERIFY USER EXISTS IN PROFILES
-- ============================================
-- Run this to check if your user_id exists in profiles table

-- Check all users and their profiles
SELECT 
  u.id as auth_user_id,
  u.email,
  p.id as profile_id,
  p.display_name,
  CASE 
    WHEN p.id IS NULL THEN '❌ NO PROFILE'
    ELSE '✅ HAS PROFILE'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 10;

-- Check if there are any profiles at all
SELECT COUNT(*) as total_profiles FROM profiles;

-- Check recent comments to see what user_id values are being used
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
LIMIT 5;


