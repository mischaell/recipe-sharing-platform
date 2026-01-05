'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'

export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const userName = formData.get('userName') as string

    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_name: userName,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      // Wait a moment for session cookies to be set
      await new Promise(resolve => setTimeout(resolve, 100))
      revalidatePath('/', 'layout')
      redirect('/')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in signUp:', error)
    return { error: error?.message || 'An error occurred during sign up. Please check your environment variables.' }
  }
}

export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      // Wait a moment for session cookies to be set
      await new Promise(resolve => setTimeout(resolve, 100))
      revalidatePath('/', 'layout')
      redirect('/dashboard')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in signIn:', error)
    return { error: error?.message || 'An error occurred during sign in. Please check your environment variables.' }
  }
}

export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error: any) {
    console.error('Error in signOut:', error)
    // Even if signOut fails, try to redirect
    revalidatePath('/', 'layout')
    redirect('/')
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string

    if (!email) {
      return { error: 'Email is required' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3000'}/reset-password/confirm`,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true, message: 'Check your email for the password reset link' }
  } catch (error: any) {
    console.error('Error in resetPassword:', error)
    return { error: error?.message || 'An error occurred. Please check your environment variables.' }
  }
}

