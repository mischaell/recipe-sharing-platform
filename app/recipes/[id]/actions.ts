'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/app/lib/supabase/server'
import { getUser, getUserProfile } from '@/app/lib/auth/get-user'
import { redirect } from 'next/navigation'

// Add a comment
export async function addComment(prevState: any, formData: FormData) {
  // Get user and profile in parallel for better performance
  const [user, supabase] = await Promise.all([
    getUser(),
    createClient()
  ])

  if (!user) {
    redirect('/login')
  }

  // Get profile and session in parallel
  const [profile, { data: { session }, error: sessionError }] = await Promise.all([
    getUserProfile(),
    supabase.auth.getSession()
  ])

  if (!profile) {
    redirect('/login')
  }

  if (sessionError || !session) {
    console.error('No valid session:', sessionError)
    return { error: 'Authentication error: Please sign in again' }
  }

  // Verify the session user matches our user
  if (session.user.id !== user.id) {
    console.error('Session user mismatch:', { 
      sessionUserId: session.user.id, 
      expectedUserId: user.id 
    })
    return { error: 'Authentication error: Session mismatch' }
  }

  const recipeId = formData.get('recipe_id') as string
  const content = formData.get('content') as string
  const parentId = formData.get('parent_id') as string | null

  if (!recipeId || !content || !content.trim()) {
    return { error: 'Comment content is required' }
  }

  if (content.length > 2000) {
    return { error: 'Comment must be 2000 characters or less' }
  }

  // Verify user.id matches profile.id (they should be the same)
  if (user.id !== profile.id) {
    console.error('User ID mismatch:', { userId: user.id, profileId: profile.id })
    return { error: 'Authentication error: User ID mismatch' }
  }

  // Use user.id (which equals auth.uid() and profile.id)
  const userId = user.id

  // Verify userId exists in profiles before inserting
  const { data: profileCheck, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()

  if (profileError || !profileCheck) {
    console.error('🔴 [SERVER] User ID not found in profiles:', {
      userId,
      profileError: profileError?.message,
      profileId: profile?.id,
      userAuthId: user.id,
    })
    return { 
      error: 'User profile not found. Please ensure your profile exists.',
      debug: process.env.NODE_ENV === 'development' ? {
        userId,
        profileId: profile?.id,
      } : undefined
    }
  }

  // Verify session is still valid before insert
  const { data: { session: verifySession }, error: verifyError } = await supabase.auth.getSession()
  
  if (!verifySession) {
    console.error('🔴 [SERVER] No session when trying to insert:', verifyError)
    return { error: 'Session expired. Please sign in again.' }
  }

  console.log('🔵 [SERVER] Inserting comment with:', {
    recipeId,
    userId,
    profileId: profile.id,
    profileCheckId: profileCheck.id,
    match: userId === profileCheck.id,
    hasSession: !!verifySession,
    sessionUserId: verifySession.user.id,
    sessionRole: verifySession.user.role,
  })

  // Use direct insert - the RLS policy should allow it
  // The policy is: TO authenticated WITH CHECK (true)
  const { data, error } = await supabase
    .from('comments')
    .insert({
      recipe_id: recipeId,
      user_id: userId,
      parent_id: parentId || null,
      content: content.trim(),
    })
    .select()
    .single()
    
  if (error) {
    console.error('🔴 [SERVER] Error adding comment:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      userId,
      hasSession: !!session,
      sessionUserId: session?.user?.id,
    })
    
    // Return detailed error for debugging
    return { 
      error: error.message || 'Failed to add comment',
      debug: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        details: error.details,
        hint: error.hint,
      } : undefined
    }
  }

  // Log success with comment data
  console.log('🟢 [SERVER] Comment inserted successfully:', {
    commentId: data?.id,
    recipeId: data?.recipe_id,
    userId: data?.user_id,
    contentLength: data?.content?.length,
  })

  revalidatePath(`/recipes/${recipeId}`)
  return { success: true, comment: data }
}

// Delete a comment (soft delete)
export async function deleteComment(commentId: string, recipeId: string) {
  const user = await getUser()
  const profile = await getUserProfile()

  if (!user || !profile) {
    return { error: 'Not authenticated' }
  }

  const supabase = await createClient()

  // Verify ownership
  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .single()

  if (fetchError || !comment) {
    return { error: 'Comment not found' }
  }

  if (comment.user_id !== profile.id) {
    return { error: 'You can only delete your own comments' }
  }

  // Soft delete
  const { error } = await supabase
    .from('comments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', commentId)

  if (error) {
    console.error('Error deleting comment:', error)
    return { error: error.message || 'Failed to delete comment' }
  }

  revalidatePath(`/recipes/${recipeId}`)
  return { success: true }
}

// Like a recipe
export async function likeRecipe(recipeId: string) {
  const user = await getUser()
  const profile = await getUserProfile()

  if (!user || !profile) {
    return { error: 'Not authenticated' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('recipe_likes')
    .insert({
      recipe_id: recipeId,
      user_id: profile.id,
    })
    .select()
    .single()

  if (error) {
    // If it's a unique constraint violation, the user already liked it
    if (error.code === '23505') {
      return { error: 'You have already liked this recipe' }
    }
    console.error('Error liking recipe:', error)
    return { error: error.message || 'Failed to like recipe' }
  }

  revalidatePath(`/recipes/${recipeId}`)
  return { success: true, like: data }
}

// Unlike a recipe
export async function unlikeRecipe(recipeId: string) {
  const user = await getUser()
  const profile = await getUserProfile()

  if (!user || !profile) {
    return { error: 'Not authenticated' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('recipe_likes')
    .delete()
    .eq('recipe_id', recipeId)
    .eq('user_id', profile.id)

  if (error) {
    console.error('Error unliking recipe:', error)
    return { error: error.message || 'Failed to unlike recipe' }
  }

  revalidatePath(`/recipes/${recipeId}`)
  return { success: true }
}

// Get like count and status
export async function getRecipeLikes(recipeId: string) {
  const user = await getUser()
  const profile = await getUserProfile()
  const supabase = await createClient()

  // Get like count
  const { count, error: countError } = await supabase
    .from('recipe_likes')
    .select('*', { count: 'exact', head: true })
    .eq('recipe_id', recipeId)

  if (countError) {
    console.error('Error getting like count:', countError)
    return { likeCount: 0, isLiked: false }
  }

  // Check if current user liked it
  let isLiked = false
  if (profile) {
    const { data } = await supabase
      .from('recipe_likes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('user_id', profile.id)
      .single()

    isLiked = !!data
  }

  return { likeCount: count || 0, isLiked }
}

