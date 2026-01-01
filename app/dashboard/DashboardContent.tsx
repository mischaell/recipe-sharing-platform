import { getUserProfile, getUser } from '@/app/lib/auth/get-user'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import Link from 'next/link'
import RecipeList from '@/app/components/RecipeList'

export default async function DashboardContent() {
  const user = await getUser()
  const userProfile = await getUserProfile()

  if (!user || !userProfile) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch recipes from other users
  let recipes: any[] | null = null
  let error: any = null

  try {
    const { data: allRecipesData, error: allRecipesError } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    const hasRealError = allRecipesError && (
      allRecipesError.message || 
      (typeof allRecipesError === 'object' && Object.keys(allRecipesError).length > 0 && JSON.stringify(allRecipesError) !== '{}')
    )

    if (hasRealError) {
      error = allRecipesError
    } else {
      const myRecipes = allRecipesData?.filter((r: any) => 
        r.user_id === user.id || r.author_id === user.id
      ) || []
      
      const otherRecipes = allRecipesData?.filter((r: any) => 
        r.user_id !== user.id && r.author_id !== user.id
      ) || []
      
      myRecipes.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateB - dateA
      })
      
      otherRecipes.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateB - dateA
      })
      
      recipes = [...myRecipes, ...otherRecipes].slice(0, 50)
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {userProfile.display_name || 'User'}!
          </p>
        </div>
        <Link
          href="/recipes/new"
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          + Add Recipe
        </Link>
      </div>

      {recipes && recipes.length > 0 ? (
        <>
          <RecipeList
            recipes={recipes.filter((r: any) => r.user_id === user.id || r.author_id === user.id)}
            profilesMap={profilesMap}
            currentUserId={user.id}
            sectionTitle="My Recipes"
            showSection={recipes.some((r: any) => r.user_id === user.id || r.author_id === user.id)}
          />

          <RecipeList
            recipes={recipes.filter((r: any) => r.user_id !== user.id && r.author_id !== user.id)}
            profilesMap={profilesMap}
            currentUserId={user.id}
            sectionTitle="Recipes from Other Users"
            showSection={recipes.some((r: any) => r.user_id !== user.id && r.author_id !== user.id)}
          />
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">No recipes from other users yet. Be the first to share one!</p>
        </div>
      )}
    </>
  )
}


