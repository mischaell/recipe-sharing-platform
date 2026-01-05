'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase/client'
import { useEffect, useState } from 'react'

export default function AuthButtons() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let supabase
    try {
      supabase = createClient()
    } catch (error) {
      console.error('Error creating Supabase client:', error)
      setLoading(false)
      return
    }

    // Get initial session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Error checking session:', error)
        setLoading(false)
      }
    }

    checkUser()

    // Re-check session after a short delay (helps after server-side redirects)
    const timeoutId = setTimeout(() => {
      checkUser()
    }, 500)

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | undefined
    try {
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        // Force a router refresh to update server components
        router.refresh()
      })
      subscription = sub
    } catch (error) {
      console.error('Error setting up auth state listener:', error)
    }

    // Re-check session on window focus (helps after redirects)
    const handleFocus = () => {
      checkUser()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      clearTimeout(timeoutId)
      if (subscription) {
        subscription.unsubscribe()
      }
      window.removeEventListener('focus', handleFocus)
    }
  }, [router])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
      // Still try to navigate even if sign out fails
      router.push('/')
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Dashboard
        </Link>
        <Link
          href="/saved"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Saved
        </Link>
        <Link
          href="/profile"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Profile
        </Link>
        <button
          onClick={handleSignOut}
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/login"
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
      >
        Sign Up
      </Link>
    </div>
  )
}

