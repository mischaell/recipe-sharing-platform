-- ============================================
-- CHECK IF COMMENTS ARE BEING SAVED
-- ============================================
-- Run this to see if comments are actually being inserted

-- Check the 5 most recent comments
SELECT 
  id,
  recipe_id,
  user_id,
  LEFT(content, 50) as content_preview,
  created_at,
  deleted_at
FROM comments
ORDER BY created_at DESC
LIMIT 5;

-- Check if there are any comments for the specific recipe
SELECT 
  id,
  recipe_id,
  user_id,
  LEFT(content, 50) as content_preview,
  created_at,
  deleted_at
FROM comments
WHERE recipe_id = 'd70f9567-3f95-4e8a-afac-ba7186ce0257'
ORDER BY created_at DESC;



