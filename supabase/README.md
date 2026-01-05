# Supabase Database Setup

This directory contains SQL migration files for setting up the Recipe Sharing Platform database.

## Setup Instructions

### Option 1: Using Supabase SQL Editor (Recommended for first-time setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migrations in order:
   - Copy and paste the contents of `001_initial_schema.sql` and execute
   - Copy and paste the contents of `002_rls_policies.sql` and execute
   - Copy and paste the contents of `003_auto_create_profile.sql` and execute

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Migration Files

### 001_initial_schema.sql
Creates all database tables:
- `profiles` - User profiles
- `recipes` - Recipe main table
- `recipe_ingredients` - Recipe ingredients list
- `recipe_steps` - Recipe cooking steps
- `tags` - Recipe tags
- `recipe_tags` - Junction table for recipe-tag relationships
- `favorites` - User favorites
- `reports` - Recipe reports

Also includes:
- Indexes for performance
- Helper functions (`is_recipe_owner`, `generate_slug`)
- `updated_at` triggers

### 002_rls_policies.sql
Sets up Row Level Security (RLS) policies:
- Profiles: readable by all, editable by owner
- Recipes: published recipes readable by all, drafts only by author
- Ingredients/Steps: follow recipe visibility rules
- Tags: readable by all
- Favorites: users can only see/manage their own
- Reports: users can create and view their own

### 003_auto_create_profile.sql
Creates a trigger that automatically creates a profile entry when a new user signs up via Supabase Auth.

## Storage Buckets Setup

After running the migrations, you'll need to create storage buckets:

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `recipe-images`:
   - Set it to **Public** (or use signed URLs if you prefer)
   - Enable RLS
3. Create a new bucket named `avatars`:
   - Set it to **Public** (or use signed URLs if you prefer)
   - Enable RLS

### Storage Policies (Optional - for RLS on storage)

If you want to add RLS policies for storage buckets, you can add these in the Supabase SQL Editor:

```sql
-- Recipe images: anyone can read, authenticated users can upload
CREATE POLICY "Recipe images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload recipe images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'recipe-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own recipe images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'recipe-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own recipe images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'recipe-images' 
    AND auth.role() = 'authenticated'
  );

-- Avatars: anyone can read, users can upload/update their own
CREATE POLICY "Avatars are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

## Verification

After running all migrations, verify the setup:

1. Check that all tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

2. Check that RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

3. Test the auto-profile creation by signing up a new user and checking:
```sql
SELECT * FROM profiles WHERE id = 'your-user-id';
```

## Next Steps

After the database is set up:
1. Install Supabase client libraries: `npm install @supabase/supabase-js @supabase/ssr`
2. Set up environment variables (`.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Create Supabase client utilities in your Next.js app
4. Start integrating authentication and database queries






