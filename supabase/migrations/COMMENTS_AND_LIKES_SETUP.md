# Comments and Likes Setup Guide

This guide provides step-by-step instructions for adding social features (comments and likes) to your recipe sharing platform.

## Step-by-Step SQL Execution

### Step 1: Create Comments Table

```sql
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT comments_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);
```

**What this does:**
- Creates a table to store comments on recipes
- Supports nested comments (replies) via `parent_id`
- Includes soft delete support (`deleted_at`)
- Enforces content length (1-2000 characters)

### Step 2: Create Recipe Likes Table

```sql
CREATE TABLE IF NOT EXISTS recipe_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_recipe_like UNIQUE (recipe_id, user_id)
);
```

**What this does:**
- Creates a table to store likes on recipes
- Prevents duplicate likes (one like per user per recipe)
- Automatically deletes when recipe or user is deleted

### Step 3: Create Comment Likes Table (Optional)

```sql
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_user_comment_like UNIQUE (comment_id, user_id)
);
```

**What this does:**
- Allows users to like comments
- Prevents duplicate likes on comments

### Step 4: Create Indexes for Performance

```sql
-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_recipe_id ON comments(recipe_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(recipe_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_not_deleted ON comments(recipe_id, created_at DESC) WHERE deleted_at IS NULL;

-- Recipe likes indexes
CREATE INDEX IF NOT EXISTS idx_recipe_likes_recipe_id ON recipe_likes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_user_id ON recipe_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_created_at ON recipe_likes(created_at DESC);

-- Comment likes indexes
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);
```

**What this does:**
- Optimizes queries for fetching comments by recipe
- Speeds up user-specific queries
- Improves sorting by creation date

### Step 5: Create Updated_at Trigger

```sql
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comments_updated_at();
```

**What this does:**
- Automatically updates `updated_at` when a comment is modified

### Step 6: Create Helper Functions

```sql
-- Get comment count for a recipe
CREATE OR REPLACE FUNCTION get_recipe_comment_count(recipe_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM comments
    WHERE recipe_id = recipe_uuid
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql;

-- Get like count for a recipe
CREATE OR REPLACE FUNCTION get_recipe_like_count(recipe_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM recipe_likes
    WHERE recipe_id = recipe_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Check if user liked a recipe
CREATE OR REPLACE FUNCTION user_liked_recipe(recipe_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM recipe_likes
    WHERE recipe_id = recipe_uuid
      AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql;
```

**What this does:**
- Provides reusable functions for common queries
- Simplifies application code

### Step 7: Create Recipe Stats View (Optional)

```sql
CREATE OR REPLACE VIEW recipe_stats AS
SELECT 
  r.id AS recipe_id,
  r.title,
  COUNT(DISTINCT rl.id) AS like_count,
  COUNT(DISTINCT c.id) AS comment_count,
  MAX(c.created_at) AS last_comment_at
FROM recipes r
LEFT JOIN recipe_likes rl ON r.id = rl.recipe_id
LEFT JOIN comments c ON r.id = c.recipe_id AND c.deleted_at IS NULL
GROUP BY r.id, r.title;
```

**What this does:**
- Provides aggregated statistics for recipes
- Useful for displaying recipe popularity

### Step 8: Enable Row Level Security

```sql
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
```

### Step 9: Create RLS Policies

```sql
-- Comments: Anyone can read, users can create/update/delete their own
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (deleted_at IS NULL);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND deleted_at IS NOT NULL);

-- Recipe likes: Anyone can read, users can create/delete their own
CREATE POLICY "Recipe likes are viewable by everyone"
  ON recipe_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own likes"
  ON recipe_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON recipe_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Comment likes: Same as recipe likes
CREATE POLICY "Comment likes are viewable by everyone"
  ON comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own comment likes"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment likes"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);
```

**What this does:**
- Secures data access at the database level
- Ensures users can only modify their own content

## Usage Examples

### Add a Comment

```sql
INSERT INTO comments (recipe_id, user_id, content)
VALUES ('recipe-uuid-here', 'user-uuid-here', 'This recipe looks amazing!');
```

### Reply to a Comment

```sql
INSERT INTO comments (recipe_id, user_id, parent_id, content)
VALUES ('recipe-uuid-here', 'user-uuid-here', 'parent-comment-uuid', 'I agree!');
```

### Like a Recipe

```sql
INSERT INTO recipe_likes (recipe_id, user_id)
VALUES ('recipe-uuid-here', 'user-uuid-here')
ON CONFLICT (recipe_id, user_id) DO NOTHING;
```

### Unlike a Recipe

```sql
DELETE FROM recipe_likes
WHERE recipe_id = 'recipe-uuid-here' AND user_id = 'user-uuid-here';
```

### Get Comments for a Recipe

```sql
SELECT 
  c.*,
  p.display_name AS author_name,
  p.avatar_url AS author_avatar,
  COUNT(cl.id) AS like_count
FROM comments c
JOIN profiles p ON c.user_id = p.id
LEFT JOIN comment_likes cl ON c.id = cl.comment_id
WHERE c.recipe_id = 'recipe-uuid-here'
  AND c.deleted_at IS NULL
  AND c.parent_id IS NULL
GROUP BY c.id, p.display_name, p.avatar_url
ORDER BY c.created_at DESC;
```

### Get Recipe with Stats

```sql
SELECT 
  r.*,
  get_recipe_like_count(r.id) AS like_count,
  get_recipe_comment_count(r.id) AS comment_count,
  user_liked_recipe(r.id, 'current-user-uuid') AS is_liked
FROM recipes r
WHERE r.id = 'recipe-uuid-here';
```

## Quick Setup

To run everything at once, execute the migration file:

```bash
# Using Supabase CLI
supabase db push

# Or copy and paste the entire 003_comments_and_likes.sql file into Supabase SQL Editor
```

## Next Steps

1. Update your application code to use these tables
2. Create API endpoints or server actions for comments and likes
3. Add UI components for displaying and interacting with comments/likes
4. Test the RLS policies to ensure they work as expected

