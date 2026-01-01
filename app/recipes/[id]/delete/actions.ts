'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import { getUser, getUserProfile } from '@/app/lib/auth/get-user'

export async function deleteRecipe(recipeId: string) {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const profile = await getUserProfile()
  if (!profile) {
    return { error: 'Profile not found' }
  }

  const supabase = await createClient()

  // Verify ownership - use maybeSingle to avoid errors
  const { data: existingRecipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)
    .maybeSingle()

  if (recipeError) {
    console.error('Error fetching recipe for deletion:', recipeError)
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
    return { error: 'You do not have permission to delete this recipe' }
  }

  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId)

  if (error) {
    console.error('Error deleting recipe:', error)
    return { error: error.message || 'Failed to delete recipe' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/recipes', 'layout')
  redirect('/dashboard')
}

