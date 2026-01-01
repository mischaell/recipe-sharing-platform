'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import { getUser, getUserProfile } from '@/app/lib/auth/get-user'

export async function createRecipe(prevState: any, formData: FormData) {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Explicitly get the profile to ensure the connection through auth
  // Connection chain: auth.users -> profiles -> recipes
  const profile = await getUserProfile()
  
  if (!profile) {
    console.error('Profile not found for user:', user.id)
    return { error: 'Profile not found. Please complete your profile setup.' }
  }

  const supabase = await createClient()

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

  // Parse ingredients from JSON or fallback to individual ingredient fields
  let ingredients: string[] = []
  if (ingredientsJson) {
    try {
      ingredients = JSON.parse(ingredientsJson).filter((s: string) => s && s.trim())
    } catch (e) {
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

  // Parse steps from JSON or fallback to individual step fields
  let steps: string[] = []
  if (stepsJson) {
    try {
      steps = JSON.parse(stepsJson).filter((s: string) => s && s.trim())
    } catch (e) {
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

  // Convert to strings for simple schema compatibility
  const ingredientsString = ingredients.join('\n')
  const instructions = steps.join('\n')

  if (!title || !title.trim()) {
    return { error: 'Recipe title is required' }
  }

  if (ingredients.length === 0 || ingredients.every(i => !i.trim())) {
    return { error: 'At least one ingredient is required' }
  }

  if (steps.length === 0 || steps.every(s => !s.trim())) {
    return { error: 'At least one instruction step is required' }
  }

  if (!prepMinutes || isNaN(parseInt(prepMinutes, 10))) {
    return { error: 'Preparation time is required and must be a valid number' }
  }

  if (!cookingTime || isNaN(parseInt(cookingTime, 10))) {
    return { error: 'Cooking time is required and must be a valid number' }
  }

  if (!servings || isNaN(parseInt(servings, 10)) || parseInt(servings, 10) < 1) {
    return { error: 'Servings is required and must be at least 1' }
  }

  if (!difficulty || !difficulty.trim()) {
    return { error: 'Difficulty is required' }
  }

  console.log('Creating recipe with data:', {
    title,
    hasIngredients: !!ingredients,
    hasInstructions: !!instructions,
    profileId: profile.id,
    userId: user.id,
  })

  // Generate slug from title
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  let baseSlug = generateSlug(title)
  let slug = baseSlug
  let slugCounter = 1

  // Check if slug exists and make it unique
  const { data: existingSlug } = await supabase
    .from('recipes')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existingSlug) {
    // Slug exists, append number
    while (true) {
      slug = `${baseSlug}-${slugCounter}`
      const { data: checkSlug } = await supabase
        .from('recipes')
        .select('id')
        .eq('slug', slug)
        .single()
      if (!checkSlug) break
      slugCounter++
    }
  }

  // Try initial schema first (author_id, slug, prep_minutes, cook_minutes)
  let recipeData: any = {
    author_id: profile.id,
    title: title.trim(),
    slug: slug,
    description: description && description.trim() ? description.trim().substring(0, 500) : (steps.length > 0 ? steps[0].substring(0, 500) : ''), // Use provided description or first step as fallback
    prep_minutes: prepMinutes ? parseInt(prepMinutes, 10) : 0,
    cook_minutes: cookingTime ? parseInt(cookingTime, 10) : 0,
    servings: servings ? parseInt(servings, 10) : 1,
    difficulty: difficulty || 'medium',
    cuisine: category ? category.trim() : null,
    status: 'published', // Set to published so it's visible
  }

  if (imageUrl && imageUrl.trim()) {
    recipeData.image_path = imageUrl.trim()
  }

  console.log('Attempting to insert recipe with initial schema:', recipeData)
  let { data, error } = await supabase
    .from('recipes')
    .insert(recipeData)
    .select()
    .single()

  console.log('First insert attempt result:', { hasData: !!data, hasError: !!error, error: error?.message })

  // If initial schema fails, try simple schema (user_id, ingredients, instructions, cooking_time)
  if (error) {
    const errorMessage = error.message || ''
    console.log('Error with initial schema, trying simple schema. Error:', errorMessage)
    
    // Try simple schema
    recipeData = {
      user_id: profile.id,
      title: title.trim(),
      ingredients: ingredientsString,
      instructions: instructions,
      cooking_time: cookingTime ? parseInt(cookingTime, 10) : null,
      difficulty: difficulty || null,
      category: category ? category.trim() : null,
    }
    
    // Add description if provided (some simple schemas might have it)
    if (description && description.trim()) {
      recipeData.description = description.trim().substring(0, 500)
    }

    const retryResult = await supabase
      .from('recipes')
      .insert(recipeData)
      .select()
      .single()
    
    console.log('Simple schema insert result:', { hasData: !!retryResult.data, hasError: !!retryResult.error, error: retryResult.error?.message })
    
    if (retryResult.error) {
      console.error('Error creating recipe (simple schema):', retryResult.error)
      return { error: retryResult.error.message || 'Failed to create recipe. Please check the database schema.' }
    }
    
    data = retryResult.data
    error = null
  } else {
    // If initial schema worked, also insert ingredients and steps into separate tables
    if (data && data.id) {
      // Insert ingredients into recipe_ingredients table
      // Use the parsed ingredients array directly
      if (ingredients.length > 0) {
        const ingredientsData = ingredients.map((item, index) => ({
          recipe_id: data.id,
          position: index + 1,
          item: item.trim(),
        }))

        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(ingredientsData)

        if (ingredientsError) {
          console.error('Error inserting ingredients:', ingredientsError)
          // Don't fail the whole operation, just log it
        } else {
          console.log('Successfully inserted', ingredientsData.length, 'ingredients')
        }
      }

      // Insert instructions into recipe_steps table
      // Use the parsed steps array directly
      if (steps.length > 0) {
        const stepsData = steps.map((text, index) => ({
          recipe_id: data.id,
          position: index + 1,
          text: text.trim(),
        }))

        const { error: stepsError } = await supabase
          .from('recipe_steps')
          .insert(stepsData)

        if (stepsError) {
          console.error('Error inserting steps:', stepsError)
          // Don't fail the whole operation, just log it
        } else {
          console.log('Successfully inserted', stepsData.length, 'recipe steps')
        }
      }
    }
  }

  if (data) {
    console.log('Recipe created successfully:', {
      id: data.id,
      title: data.title,
      author_id: data.author_id,
      user_id: data.user_id,
      ingredients: data.ingredients?.substring(0, 50),
      instructions: data.instructions?.substring(0, 50),
    })
    
    // Revalidate the dashboard to ensure new recipe appears
    revalidatePath('/dashboard', 'page')
    revalidatePath('/dashboard', 'layout')
    
    // Return success - client will handle redirect
    return { success: true, recipeId: data.id, message: 'Recipe created successfully!' }
  } else {
    console.error('Recipe creation succeeded but no data returned')
    return { error: 'Recipe created but could not retrieve data' }
  }
}

