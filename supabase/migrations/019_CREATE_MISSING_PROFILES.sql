-- ============================================
-- CREATE MISSING PROFILES
-- ============================================
-- This creates profiles for any users that don't have one
-- Run this if the RLS policy fails because user_id doesn't exist in profiles

-- Create profiles for users that don't have one
INSERT INTO profiles (id, display_name, created_at, updated_at)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'display_name',
    u.email,
    'User'
  ) as display_name,
  u.created_at,
  NOW()
FROM auth.users u
WHERE u.id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Verify all users have profiles
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
ORDER BY u.created_at DESC;


