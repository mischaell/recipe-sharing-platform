'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import { getUser, getUserProfile } from '@/app/lib/auth/get-user'

export async function updateRecipe(
  prevState: any,
  formData: FormData
) {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const profile = await getUserProfile()
  if (!profile) {
    return { error: 'Profile not found' }
  }

  const supabase = await createClient()

  const recipeId = formData.get('recipe_id') as string
  
  if (!recipeId) {
    console.error('No recipe_id found in form data')
    return { error: 'Recipe ID is required' }
  }

  console.log('Updating recipe with ID:', recipeId)
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const ingredientsJson = formData.get('ingredients_json') as string
  const stepsJson = formData.get('steps_json') as string
  const imageUrl = formData.get('image_url') as string
  const prepMinutes = formData.get('prep_minutes') as string
  const cookingTime = formData.get('cooking_time') as string
  const servings = formData.get('servings') as string
  const difficulty = formData.get('difficulty') as string
  const category = formData.get('category') as string

  // Validate required fields
  if (!recipeId || !title || !title.trim()) {
    return { error: 'Recipe ID and title are required' }
  }

  // Parse ingredients from JSON or fallback to individual ingredient fields
  let ingredients: string[] = []
  if (ingredientsJson && ingredientsJson.trim()) {
    try {
      const parsed = JSON.parse(ingredientsJson)
      ingredients = Array.isArray(parsed) ? parsed.filter((s: string) => s && s.trim()) : []
    } catch (e) {
      console.error('Error parsing ingredients JSON:', e)
      // Fallback: collect all ingredient-* fields
      let ingredientIndex = 0
      while (formData.get(`ingredient-${ingredientIndex}`)) {
        const ingredient = formData.get(`ingredient-${ingredientIndex}`) as string
        if (ingredient && ingredient.trim()) {
          ingredients.push(ingredient.trim())
        }
        ingredientIndex++
      }
    }
  } else {
    // Fallback: collect all ingredient-* fields
    let ingredientIndex = 0
    while (formData.get(`ingredient-${ingredientIndex}`)) {
      const ingredient = formData.get(`ingredient-${ingredientIndex}`) as string
      if (ingredient && ingredient.trim()) {
        ingredients.push(ingredient.trim())
      }
      ingredientIndex++
    }
  }

  if (ingredients.length === 0) {
    return { error: 'At least one ingredient is required' }
  }

  // Parse steps from JSON or fallback to individual step fields
  let steps: string[] = []
  if (stepsJson && stepsJson.trim()) {
    try {
      const parsed = JSON.parse(stepsJson)
      steps = Array.isArray(parsed) ? parsed.filter((s: string) => s && s.trim()) : []
    } catch (e) {
      console.error('Error parsing steps JSON:', e)
      // Fallback: collect all step-* fields
      let stepIndex = 0
      while (formData.get(`step-${stepIndex}`)) {
        const step = formData.get(`step-${stepIndex}`) as string
        if (step && step.trim()) {
          steps.push(step.trim())
        }
        stepIndex++
      }
    }
  } else {
    // Fallback: collect all step-* fields
    let stepIndex = 0
    while (formData.get(`step-${stepIndex}`)) {
      const step = formData.get(`step-${stepIndex}`) as string
      if (step && step.trim()) {
        steps.push(step.trim())
      }
      stepIndex++
    }
  }

  if (steps.length === 0) {
    return { error: 'At least one instruction step is required' }
  }

  // Convert to strings for simple schema compatibility
  const ingredientsString = ingredients.join('\n')
  const instructions = steps.join('\n')

  // Verify ownership - select all fields to ensure we get the recipe
  const { data: existingRecipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)
    .maybeSingle()

  if (recipeError) {
    console.error('Error fetching recipe for ownership check:', recipeError)
    return { error: `Error verifying recipe: ${recipeError.message || 'Unknown error'}` }
  }

  if (!existingRecipe) {
    console.error('Recipe not found with ID:', recipeId)
    return { error: 'Recipe not found' }
  }

  // Check ownership using profile ID
  const recipeAuthorId = (existingRecipe as any).author_id || (existingRecipe as any).user_id
  const userProfileId = profile?.id || user.id
  const isOwner = userProfileId && recipeAuthorId && recipeAuthorId === userProfileId
  
  if (!isOwner) {
    return { error: 'You do not have permission to edit this recipe' }
  }

  // Prepare update data - check which schema fields exist
  const hasSimpleSchema = 'ingredients' in existingRecipe || 'instructions' in existingRecipe
  const hasInitialSchema = 'prep_minutes' in existingRecipe || 'cook_minutes' in existingRecipe

  const updateData: any = {
    title: title.trim(),
    difficulty: difficulty || 'medium',
  }

  // Set description if provided, otherwise use first step as fallback
  if (description && description.trim()) {
    // Try to set description for both schemas if the column exists
    if ('description' in existingRecipe) {
      updateData.description = description.trim().substring(0, 500)
    }
  } else if (hasInitialSchema && steps.length > 0 && 'description' in existingRecipe) {
    // Fallback to first step if no description provided (only for initial schema)
    updateData.description = steps[0].substring(0, 500)
  }

  // Only set fields that exist in the schema
  if (hasSimpleSchema) {
    // Simple schema uses ingredients, instructions, and cooking_time fields
    updateData.ingredients = ingredientsString
    updateData.instructions = instructions
    if (cookingTime) {
      updateData.cooking_time = parseInt(cookingTime, 10)
    }
    // Simple schema might not have prep_minutes, cook_minutes, servings, description
    if ('prep_minutes' in existingRecipe) {
      updateData.prep_minutes = prepMinutes ? parseInt(prepMinutes, 10) : 0
    }
    if ('cook_minutes' in existingRecipe) {
      updateData.cook_minutes = cookingTime ? parseInt(cookingTime, 10) : 0
    }
    if ('servings' in existingRecipe) {
      updateData.servings = servings ? parseInt(servings, 10) : 1
    }
  } else if (hasInitialSchema) {
    // Initial schema uses prep_minutes, cook_minutes, servings, and description
    updateData.prep_minutes = prepMinutes ? parseInt(prepMinutes, 10) : 0
    updateData.cook_minutes = cookingTime ? parseInt(cookingTime, 10) : 0
    updateData.servings = servings ? parseInt(servings, 10) : 1
  }

  // Handle image
  if (imageUrl && imageUrl.trim()) {
    updateData.image_path = imageUrl.trim()
  } else if (imageUrl === '') {
    // Empty string means remove image
    updateData.image_path = null
  }

  // Handle category/cuisine based on schema
  if (category) {
    if ('category' in existingRecipe) {
      updateData.category = category.trim()
    } else if ('cuisine' in existingRecipe) {
      updateData.cuisine = category.trim()
    }
  }

  const { data, error } = await supabase
    .from('recipes')
    .update(updateData)
    .eq('id', recipeId)
    .select()
    .single()

  if (error) {
    console.error('Error updating recipe:', error)
    return { error: error.message }
  }

  if (!data) {
    return { error: 'Failed to update recipe' }
  }

  // Update recipe_ingredients table if it exists (initial schema)
  // First, delete existing ingredients
  await supabase
    .from('recipe_ingredients')
    .delete()
    .eq('recipe_id', recipeId)

  // Then insert new ingredients
  // Use the parsed ingredients array directly
  if (ingredients.length > 0) {
    const ingredientsData = ingredients.map((item, index) => ({
      recipe_id: recipeId,
      position: index + 1,
      item: item.trim(),
    }))

    const { error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .insert(ingredientsData)

    if (ingredientsError) {
      console.error('Error updating recipe ingredients:', ingredientsError)
      // Don't fail the whole operation, just log it
    }
  }

  // Update recipe_steps table if it exists (initial schema)
  // First, delete existing steps
  await supabase
    .from('recipe_steps')
    .delete()
    .eq('recipe_id', recipeId)

  // Then insert new steps
  if (steps.length > 0) {
    const stepsData = steps.map((text, index) => ({
      recipe_id: recipeId,
      position: index + 1,
      text: text.trim(),
    }))

    const { error: stepsError } = await supabase
      .from('recipe_steps')
      .insert(stepsData)

    if (stepsError) {
      console.error('Error updating recipe steps:', stepsError)
      // Don't fail the whole operation, just log it
    }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/recipes/${recipeId}`)
  revalidatePath(`/recipes/${recipeId}/edit`)
  redirect(`/recipes/${recipeId}`)
}

