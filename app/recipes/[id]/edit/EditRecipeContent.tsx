import { getUser, getUserProfile } from '@/app/lib/auth/get-user'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import EditRecipeForm from './EditRecipeForm'

export default async function EditRecipeContent({ id }: { id: string }) {
  const user = await getUser()
  const userProfile = await getUserProfile()

  if (!user || !userProfile) {
    redirect('/login')
  }

  const supabase = await createClient()

  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !recipe) {
    console.error('Error fetching recipe:', error)
    notFound()
  }

  const recipeAuthorId = (recipe as any).author_id || (recipe as any).user_id
  const userProfileId = userProfile?.id || user?.id
  const isAuthor = userProfileId && recipeAuthorId === userProfileId
  
  if (!isAuthor) {
    redirect('/dashboard')
  }

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

  let initialIngredients: string[] = []
  if (recipeIngredients && recipeIngredients.length > 0) {
    initialIngredients = recipeIngredients.map((ing: any) => ing.item).filter(Boolean)
  } else if ((recipe as any).ingredients) {
    const ingredientText = (recipe as any).ingredients
    const lines = ingredientText.split('\n').filter((line: string) => line.trim())
    if (lines.length > 0) {
      initialIngredients = lines
    } else {
      initialIngredients = ingredientText.split(',').map((item: string) => item.trim()).filter((item: string) => item)
    }
  }
  
  if (initialIngredients.length === 0) {
    initialIngredients = ['']
  }

  let initialSteps: string[] = []
  if (recipeSteps && recipeSteps.length > 0) {
    initialSteps = recipeSteps.map((step: any) => step.text).filter(Boolean)
  } else if ((recipe as any).instructions) {
    const instructionLines = (recipe as any).instructions.split('\n').filter((line: string) => line.trim())
    initialSteps = instructionLines.length > 0 ? instructionLines : [(recipe as any).instructions]
  } else {
    initialSteps = ['']
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Edit Recipe</h1>

      <EditRecipeForm
        recipeId={id}
        initialTitle={recipe.title}
        initialDescription={(recipe as any).description || ''}
        initialIngredients={initialIngredients}
        initialSteps={initialSteps}
        initialImageUrl={(recipe as any).image_path || (recipe as any).image_url || ''}
        initialPrepMinutes={(recipe as any).prep_minutes ?? 0}
        initialCookMinutes={(recipe as any).cook_minutes ?? (recipe as any).cooking_time ?? 0}
        initialServings={(recipe as any).servings ?? 4}
        initialDifficulty={recipe.difficulty || 'medium'}
        initialCategory={recipe.category || (recipe as any).cuisine || ''}
      />
    </div>
  )
}


