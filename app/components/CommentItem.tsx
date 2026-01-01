'use client'

import { useState } from 'react'
import CommentForm from './CommentForm'
import { deleteComment } from '@/app/recipes/[id]/actions'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  parent_id: string | null
  author: {
    id: string
    display_name: string
    avatar_url?: string
  }
  replies?: Comment[]
  like_count?: number
}

interface CommentItemProps {
  comment: Comment
  recipeId: string
  currentUserId?: string
}

export default function CommentItem({ comment, recipeId, currentUserId }: CommentItemProps) {
  const router = useRouter()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthor = currentUserId === comment.user_id
  const hasReplies = comment.replies && comment.replies.length > 0

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    setIsDeleting(true)
    setError(null)

    const result = await deleteComment(comment.id, recipeId)
    
    if (result?.error) {
      setError(result.error)
      setIsDeleting(false)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author.avatar_url ? (
            <img
              src={comment.author.avatar_url}
              alt={comment.author.display_name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                // Fallback to initial if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
          ) : null}
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 ${
              comment.author.avatar_url ? 'hidden' : ''
            }`}
          >
            {comment.author.display_name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 space-y-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {comment.author.display_name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
                {comment.updated_at !== comment.created_at && (
                  <span className="text-xs text-gray-400">(edited)</span>
                )}
              </div>
              {isAuthor && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700" role="alert">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm">
            {!comment.parent_id && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-gray-600 hover:text-orange-600"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && !comment.parent_id && (
            <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-4">
              <CommentForm
                recipeId={recipeId}
                parentId={comment.id}
                onSuccess={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {/* Replies */}
          {hasReplies && (
            <div className="ml-4 mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  recipeId={recipeId}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

