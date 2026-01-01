'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import { getUser } from '@/app/lib/auth/get-user'

export async function updateProfile(formData: FormData) {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  const displayName = formData.get('display_name') as string
  const fullName = formData.get('full_name') as string
  const avatarUrl = formData.get('avatar_url') as string
  const bio = formData.get('bio') as string

  // Check which schema is being used by checking the current profile
  let updateData: any = {
    avatar_url: avatarUrl ? avatarUrl.trim() : null,
    bio: bio ? bio.trim() : null,
  }

  // Try to determine which field exists by checking the current profile
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (currentProfile) {
    // Use display_name if it exists in schema, otherwise use user_name
    if ('display_name' in currentProfile) {
      updateData.display_name = displayName.trim()
    } else if ('user_name' in currentProfile) {
      updateData.user_name = displayName.trim()
      // Also update full_name if provided
      if (fullName) {
        updateData.full_name = fullName.trim()
      }
    } else if ('full_name' in currentProfile) {
      updateData.full_name = displayName.trim()
    }
  } else {
    // Default to display_name (from image schema)
    updateData.display_name = displayName.trim()
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return { error: error.message }
  }

  if (data) {
    revalidatePath('/profile')
    revalidatePath('/profile/edit')
    redirect('/profile')
  }

  return { success: true }
}

