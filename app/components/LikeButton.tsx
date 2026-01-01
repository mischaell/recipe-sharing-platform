'use client'

import { useState, useTransition } from 'react'
import { likeRecipe, unlikeRecipe } from '@/app/recipes/[id]/actions'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  recipeId: string
  initialLikeCount: number
  initialIsLiked: boolean
}

export default function LikeButton({
  recipeId,
  initialLikeCount,
  initialIsLiked,
}: LikeButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [error, setError] = useState<string | null>(null)

  const handleLike = () => {
    setError(null)
    startTransition(async () => {
      if (isLiked) {
        const result = await unlikeRecipe(recipeId)
        if (result?.error) {
          setError(result.error)
        } else {
          setIsLiked(false)
          setLikeCount((prev) => Math.max(0, prev - 1))
        }
      } else {
        const result = await likeRecipe(recipeId)
        if (result?.error) {
          setError(result.error)
        } else {
          setIsLiked(true)
          setLikeCount((prev) => prev + 1)
        }
      }
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLike}
        disabled={isPending}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          isLiked
            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
      >
        <svg
          className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{likeCount}</span>
      </button>
      {error && (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}


