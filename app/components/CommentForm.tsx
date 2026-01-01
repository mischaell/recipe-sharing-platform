'use client'

import { useActionState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { addComment } from '@/app/recipes/[id]/actions'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface CommentFormProps {
  recipeId: string
  parentId?: string | null
  onSuccess?: () => void
}

export default function CommentForm({ recipeId, parentId, onSuccess }: CommentFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(addComment, null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (state?.success) {
      console.log('🟢 [CLIENT] Comment posted successfully')
      // Reset form immediately (optimistic)
      const form = document.getElementById(`comment-form-${parentId || 'root'}`) as HTMLFormElement
      if (form) {
        form.reset()
      }
      
      // Use requestIdleCallback or setTimeout to make refresh non-blocking
      // This prevents the click handler from blocking
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          startTransition(() => {
            router.refresh()
          })
        })
      } else {
        setTimeout(() => {
          startTransition(() => {
            router.refresh()
          })
        }, 0)
      }
      
      if (onSuccess) {
        onSuccess()
      }
    }
    
    if (state?.error) {
      console.error('🔴 [CLIENT] Error posting comment:', state.error)
      if (state.debug) {
        console.error('🔴 [CLIENT] Debug info:', state.debug)
      }
    }
  }, [state, router, onSuccess, parentId, startTransition])

  return (
    <form
      id={`comment-form-${parentId || 'root'}`}
      action={formAction}
      className="space-y-3"
    >
      <input type="hidden" name="recipe_id" value={recipeId} />
      {parentId && <input type="hidden" name="parent_id" value={parentId} />}

      <div>
        <textarea
          name="content"
          required
          rows={3}
          maxLength={2000}
          placeholder={parentId ? 'Write a reply...' : 'Write a comment...'}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
        <p className="mt-1 text-xs text-gray-500">
          Maximum 2000 characters
        </p>
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {state.error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <SubmitButton isReply={!!parentId} />
      </div>
    </form>
  )
}

function SubmitButton({ isReply }: { isReply: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors ${
        pending
          ? 'cursor-not-allowed bg-gray-400'
          : 'bg-orange-600 hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'
      }`}
    >
      {pending ? 'Posting...' : isReply ? 'Reply' : 'Post Comment'}
    </button>
  )
}

