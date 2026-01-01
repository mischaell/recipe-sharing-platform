import { getUser, getUserProfile } from '@/app/lib/auth/get-user'
import { createClient } from '@/app/lib/supabase/server'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import LikeButton from './LikeButton'
import { getRecipeLikes } from '@/app/recipes/[id]/actions'

interface CommentsSectionProps {
  recipeId: string
}

export default async function CommentsSection({ recipeId }: CommentsSectionProps) {
  const user = await getUser()
  const profile = await getUserProfile()
  const supabase = await createClient()

  // Fetch comments
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*')
    .eq('recipe_id', recipeId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })

  // Fetch author profiles for comments
  let profilesMap: Record<string, any> = {}
  if (comments && comments.length > 0) {
    const userIds = [...new Set(comments.map((c: any) => c.user_id).filter(Boolean))]
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', userIds)
      
      if (profiles) {
        profilesMap = profiles.reduce((acc: Record<string, any>, p: any) => {
          acc[p.id] = p
          return acc
        }, {})
      }
    }
  }

  if (commentsError) {
    console.error('Error fetching comments:', commentsError)
  }

  // Organize comments into parent-child structure
  const commentsMap = new Map<string, any>()
  const rootComments: any[] = []

  if (comments) {
    comments.forEach((comment: any) => {
      const author = profilesMap[comment.user_id] || {
        id: comment.user_id,
        display_name: 'Unknown',
        avatar_url: null,
      }
      
      const commentData = {
        ...comment,
        author,
        replies: [],
      }
      commentsMap.set(comment.id, commentData)

      if (comment.parent_id) {
        const parent = commentsMap.get(comment.parent_id)
        if (parent) {
          parent.replies = parent.replies || []
          parent.replies.push(commentData)
        }
      } else {
        rootComments.push(commentData)
      }
    })
  }

  // Get like count and status
  const likesData = await getRecipeLikes(recipeId)

  return (
    <div className="space-y-6">
      {/* Like Button */}
      <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900">Interactions</h2>
        <LikeButton
          recipeId={recipeId}
          initialLikeCount={likesData.likeCount}
          initialIsLiked={likesData.isLiked}
        />
      </div>

      {/* Comments Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          Comments ({rootComments.length})
        </h2>

        {/* Comment Form */}
        {user && profile ? (
          <div className="mb-8">
            <CommentForm recipeId={recipeId} />
          </div>
        ) : (
          <div className="mb-8 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-600">
            <a href="/login" className="text-orange-600 hover:text-orange-700">
              Sign in
            </a>{' '}
            to leave a comment
          </div>
        )}

        {/* Comments List */}
        {rootComments.length > 0 ? (
          <div className="space-y-6">
            {rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                recipeId={recipeId}
                currentUserId={profile?.id}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  )
}

