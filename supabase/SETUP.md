# Simple Database Setup

This is a simplified database setup with just two tables.

## Setup Instructions

1. Go to your Supabase project dashboard → **SQL Editor**

2. Run the migrations in order:

   **Step 1:** Copy and paste the contents of `001_simple_schema.sql` and click **Run**
   
   **Step 2:** Copy and paste the contents of `002_simple_rls_policies.sql` and click **Run**
   
   **Step 3:** Copy and paste the contents of `003_auto_create_profile.sql` and click **Run**

## Tables Created

### Profiles Table
- `id` (UUID, Primary Key, references auth.users)
- `user_name` (TEXT)
- `full_name` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Recipes Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to profiles)
- `title` (TEXT)
- `ingredients` (TEXT)
- `instructions` (TEXT)
- `cooking_time` (INTEGER)
- `difficulty` (TEXT)
- `category` (TEXT)
- `created_at` (TIMESTAMPTZ)

## Security

- Row Level Security (RLS) is enabled on both tables
- Anyone can read profiles and recipes
- Users can only create/update/delete their own recipes
- Profiles are auto-created when a user signs up





