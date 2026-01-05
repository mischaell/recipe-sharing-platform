-- ============================================
-- DIAGNOSTIC QUERIES
-- ============================================
-- Run these queries in Supabase SQL Editor to diagnose the RLS issue

-- 1. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('comments', 'recipe_likes', 'comment_likes');

-- 2. Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('comments', 'recipe_likes', 'comment_likes')
ORDER BY tablename, policyname;

-- 3. Check the comments table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- 4. Test if auth.uid() works (run this while logged in)
SELECT auth.uid() as current_user_id;

-- 5. Check if your profile exists and matches auth.uid()
SELECT 
    p.id as profile_id,
    auth.uid() as auth_user_id,
    p.id = auth.uid() as matches
FROM profiles p
WHERE p.id = auth.uid();

-- 6. Try to manually insert a comment (replace with your actual IDs)
-- This will show the exact error
/*
INSERT INTO comments (recipe_id, user_id, content)
VALUES (
    'your-recipe-id-here'::uuid,
    auth.uid(),
    'Test comment'
);
*/



