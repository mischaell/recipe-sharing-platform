import { getUserProfile, getUser } from '@/app/lib/auth/get-user'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import RecipeList from '@/app/components/RecipeList'
import Link from 'next/link'

export default async function SavedContent() {
  const user = await getUser()
  const userProfile = await getUserProfile()

  if (!user || !userProfile) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch all recipes that the user has liked
  let recipes: any[] = []
  let error: any = null

  try {
    // First, get all recipe IDs that the user has liked
    const { data: likesData, error: likesError } = await supabase
      .from('recipe_likes')
      .select('recipe_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (likesError) {
      console.error('Error fetching liked recipes:', likesError)
      error = likesError
    } else if (likesData && likesData.length > 0) {
      // Get the actual recipe IDs
      const recipeIds = likesData.map((like: any) => like.recipe_id)

      // Fetch the full recipe data
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds)
        .order('created_at', { ascending: false })

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError)
        error = recipesError
      } else {
        recipes = recipesData || []
        
        // Sort recipes to match the order of likes (most recent like first)
        const recipeOrderMap = new Map(
          likesData.map((like: any, index: number) => [like.recipe_id, index])
        )
        recipes.sort((a: any, b: any) => {
          const orderA = recipeOrderMap.get(a.id) ?? Infinity
          const orderB = recipeOrderMap.get(b.id) ?? Infinity
          return orderA - orderB
        })
      }
    }
  } catch (err) {
    console.error('Exception caught:', err)
    error = err
  }

  // Fetch profiles for the recipe authors
  let profilesMap: Record<string, any> = {}
  if (recipes && recipes.length > 0) {
    const userIds = [...new Set([
      ...recipes.map((r: any) => r.user_id).filter(Boolean),
      ...recipes.map((r: any) => r.author_id).filter(Boolean)
    ])]
    
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds)

      if (profilesError?.message) {
        console.error('Error fetching profiles:', profilesError.message)
      }
      
      if (profiles) {
        profilesMap = profiles.reduce((acc: Record<string, any>, profile: any) => {
          acc[profile.id] = profile
          return acc
        }, {})
      }
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Recipes</h1>
        <p className="mt-2 text-gray-600">
          Recipes you've liked and saved
        </p>
      </div>

      {recipes && recipes.length > 0 ? (
        <RecipeList
          recipes={recipes}
          profilesMap={profilesMap}
          currentUserId={user.id}
          sectionTitle=""
          showSection={true}
        />
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            You haven't saved any recipes yet. Start exploring and like recipes to save them here!
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
          >
            Browse Recipes
          </Link>
        </div>
      )}
    </>
  )
}

