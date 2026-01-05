-- Recipe Sharing Platform - Row Level Security Policies
-- Run this after 001_initial_schema.sql

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- RECIPES POLICIES
-- ============================================

-- Anyone can read published recipes
CREATE POLICY "Published recipes are viewable by everyone"
  ON recipes FOR SELECT
  USING (status = 'published');

-- Authors can read their own recipes (including drafts)
CREATE POLICY "Authors can view their own recipes"
  ON recipes FOR SELECT
  USING (auth.uid() = author_id);

-- Authors can insert their own recipes
CREATE POLICY "Authors can create their own recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own recipes
CREATE POLICY "Authors can update their own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Authors can delete their own recipes
CREATE POLICY "Authors can delete their own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================
-- RECIPE INGREDIENTS POLICIES
-- ============================================

-- Anyone can read ingredients for published recipes
CREATE POLICY "Ingredients are viewable for published recipes"
  ON recipe_ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.status = 'published'
    )
  );

-- Authors can read ingredients for their own recipes
CREATE POLICY "Authors can view ingredients for their own recipes"
  ON recipe_ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

-- Authors can manage ingredients for their own recipes
CREATE POLICY "Authors can manage ingredients for their own recipes"
  ON recipe_ingredients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

-- ============================================
-- RECIPE STEPS POLICIES
-- ============================================

-- Anyone can read steps for published recipes
CREATE POLICY "Steps are viewable for published recipes"
  ON recipe_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_steps.recipe_id
      AND recipes.status = 'published'
    )
  );

-- Authors can read steps for their own recipes
CREATE POLICY "Authors can view steps for their own recipes"
  ON recipe_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_steps.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

-- Authors can manage steps for their own recipes
CREATE POLICY "Authors can manage steps for their own recipes"
  ON recipe_steps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_steps.recipe_id
      AND recipes.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_steps.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

-- ============================================
-- TAGS POLICIES
-- ============================================

-- Anyone can read tags
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

-- Authenticated users can create tags (for now - you may want to restrict this)
CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- RECIPE TAGS POLICIES
-- ============================================

-- Anyone can read recipe tags for published recipes
CREATE POLICY "Recipe tags are viewable for published recipes"
  ON recipe_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_tags.recipe_id
      AND recipes.status = 'published'
    )
  );

-- Authors can manage tags for their own recipes
CREATE POLICY "Authors can manage tags for their own recipes"
  ON recipe_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_tags.recipe_id
      AND recipes.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_tags.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

-- ============================================
-- FAVORITES POLICIES
-- ============================================

-- Users can only read their own favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own favorites
CREATE POLICY "Users can create their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REPORTS POLICIES
-- ============================================

-- Users can create reports
CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Users can read their own reports
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Note: Admin policies for resolving reports would need to be added later
-- when you implement admin roles. For now, only users can create and view their own reports.






