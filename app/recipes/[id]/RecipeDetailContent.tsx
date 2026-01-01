import { getUser, getUserProfile } from '@/app/lib/auth/get-user'
import { createClient } from '@/app/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import DeleteRecipeButton from './DeleteRecipeButton'
import CommentsSection from '@/app/components/CommentsSection'

export default async function RecipeDetailContent({ id }: { id: string }) {
  const user = await getUser()
  const supabase = await createClient()

  // Fetch recipe
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (!recipe) {
    if (error?.message) {
      if (error.message.includes('No rows') || 
          error.message.includes('not found') || 
          error.code === 'PGRST116') {
        notFound()
      }
      console.error('Error fetching recipe:', error.message)
    }
    notFound()
  }

  // Fetch author profile separately
  const authorId = (recipe as any).author_id || (recipe as any).user_id
  let author: any = null
  let authorName = 'Unknown'
  
  if (authorId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .eq('id', authorId)
      .single()
    
    if (profile) {
      author = profile
      authorName = profile.display_name || 'Unknown'
    }
  }

  // Fetch ingredients and steps
  const { data: recipeIngredients } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .eq('recipe_id', id)
    .order('position', { ascending: true })

  const { data: recipeSteps } = await supabase
    .from('recipe_steps')
    .select('*')
    .eq('recipe_id', id)
    .order('position', { ascending: true })

  const userProfile = user ? await getUserProfile() : null
  const userProfileId = userProfile?.id || user?.id
  const recipeAuthorId = (recipe as any).author_id || (recipe as any).user_id
  const isAuthor = user && userProfileId && recipeAuthorId === userProfileId

  const hasSeparateTables = recipeIngredients && recipeIngredients.length > 0
  const hasSimpleSchema = (recipe as any).ingredients || (recipe as any).instructions

  const prepTime = (recipe as any).prep_minutes ?? 0
  const cookTime = (recipe as any).cook_minutes ?? (recipe as any).cooking_time ?? 0
  const totalTime = prepTime + cookTime

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to Dashboard
      </Link>

      {(recipe as any).image_path && (
        <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
          <Image
            src={(recipe as any).image_path}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>By {authorName}</span>
              {recipe.created_at && (
                <span>
                  {new Date(recipe.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          {isAuthor && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href={`/recipes/${id}/edit`}
                className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                ✏️ Edit Recipe
              </Link>
              <DeleteRecipeButton recipeId={id} />
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {prepTime > 0 && (
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs font-medium text-gray-500">Prep Time</div>
              <div className="text-lg font-semibold text-gray-900">{prepTime} min</div>
            </div>
          )}
          {cookTime > 0 && (
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs font-medium text-gray-500">Cook Time</div>
              <div className="text-lg font-semibold text-gray-900">{cookTime} min</div>
            </div>
          )}
          {totalTime > 0 && (
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs font-medium text-gray-500">Total Time</div>
              <div className="text-lg font-semibold text-gray-900">{totalTime} min</div>
            </div>
          )}
          {(recipe as any).servings && (
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs font-medium text-gray-500">Servings</div>
              <div className="text-lg font-semibold text-gray-900">{(recipe as any).servings}</div>
            </div>
          )}
          {(recipe as any).difficulty && (
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs font-medium text-gray-500">Difficulty</div>
              <div className="text-lg font-semibold capitalize text-gray-900">{(recipe as any).difficulty}</div>
            </div>
          )}
          {(recipe as any).cuisine && (
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs font-medium text-gray-500">Cuisine</div>
              <div className="text-lg font-semibold text-gray-900">{(recipe as any).cuisine}</div>
            </div>
          )}
        </div>
      </div>

      {((recipe as any).description || recipe.description) && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold text-gray-900">Description</h2>
          <p className="text-gray-700">{(recipe as any).description || recipe.description}</p>
        </div>
      )}

      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Ingredients</h2>
        {hasSeparateTables && recipeIngredients && recipeIngredients.length > 0 ? (
          <ul className="space-y-2">
            {recipeIngredients.map((ingredient: any, index: number) => (
              <li key={ingredient.id || index} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-700">
                  {ingredient.position}
                </span>
                <span className="text-gray-700">{ingredient.item}</span>
                {ingredient.section && (
                  <span className="ml-auto text-sm text-gray-500">({ingredient.section})</span>
                )}
              </li>
            ))}
          </ul>
        ) : hasSimpleSchema && (recipe as any).ingredients ? (
          <div className="whitespace-pre-wrap text-gray-700">
            {(recipe as any).ingredients}
          </div>
        ) : (
          <p className="text-gray-500">No ingredients listed</p>
        )}
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Instructions</h2>
        {hasSeparateTables && recipeSteps && recipeSteps.length > 0 ? (
          <ol className="space-y-4">
            {recipeSteps.map((step: any, index: number) => (
              <li key={step.id || index} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
                  {step.position}
                </span>
                <div className="flex-1">
                  <p className="text-gray-700">{step.text}</p>
                  {step.timer_seconds && (
                    <p className="mt-1 text-sm text-gray-500">
                      ⏱️ {Math.floor(step.timer_seconds / 60)} min {step.timer_seconds % 60} sec
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : hasSimpleSchema && (recipe as any).instructions ? (
          <div className="whitespace-pre-wrap text-gray-700">
            {(recipe as any).instructions}
          </div>
        ) : (
          <p className="text-gray-500">No instructions provided</p>
        )}
      </div>

      {/* Comments and Likes Section */}
      <CommentsSection recipeId={id} />
    </div>
  )
}

