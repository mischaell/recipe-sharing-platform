'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteRecipe } from './delete/actions'

export default function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      const result = await deleteRecipe(recipeId)
      if (result?.error) {
        setError(result.error)
        setIsDeleting(false)
      } else {
        // Redirect happens in the action, but refresh if it doesn't
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Error deleting recipe:', error)
      setError(error?.message || 'Failed to delete recipe. Please try again.')
      setIsDeleting(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-2">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : '🗑️ Confirm Delete'}
          </button>
          <button
            onClick={() => {
              setShowConfirm(false)
              setError(null)
            }}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    >
      🗑️ Delete Recipe
    </button>
  )
}

