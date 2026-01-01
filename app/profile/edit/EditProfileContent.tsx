import { getUserProfile, getUser } from '@/app/lib/auth/get-user'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import { updateProfile } from './actions'

export default async function EditProfileContent() {
  const user = await getUser()
  const userProfile = await getUserProfile()

  if (!user || !userProfile) {
    redirect('/login')
  }

  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Edit Profile</h1>

      <form action={updateProfile} className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
            {(profile as any)?.display_name !== undefined ? 'Display Name' : 
             (profile as any)?.user_name !== undefined ? 'Username' : 'Full Name'} *
          </label>
          <input
            type="text"
            id="display_name"
            name="display_name"
            required
            defaultValue={(profile as any)?.display_name || (profile as any)?.user_name || (profile as any)?.full_name || ''}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
            placeholder={(profile as any)?.display_name !== undefined ? 'Your display name' : 
                        (profile as any)?.user_name !== undefined ? 'Your username' : 'Your full name'}
          />
        </div>

        {(profile as any)?.user_name !== undefined && (
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              defaultValue={(profile as any)?.full_name || ''}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
              placeholder="Your full name"
            />
          </div>
        )}

        <div>
          <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
            Avatar URL
          </label>
          <input
            type="url"
            id="avatar_url"
            name="avatar_url"
            defaultValue={profile?.avatar_url || 'https://images-v2.aventure.vc/pictures/ecs/ECsUmQMetNvu4QtJO19CQSw.jpeg'}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
            placeholder="https://example.com/avatar.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            Michael Stephan Blome photo URL is pre-filled. You can change it if needed.
          </p>
          {(profile?.avatar_url || 'https://images-v2.aventure.vc/pictures/ecs/ECsUmQMetNvu4QtJO19CQSw.jpeg') && (
            <img
              src={profile?.avatar_url || 'https://images-v2.aventure.vc/pictures/ecs/ECsUmQMetNvu4QtJO19CQSw.jpeg'}
              alt="Current avatar"
              className="mt-2 h-16 w-16 rounded-full object-cover"
            />
          )}
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={profile?.bio || ''}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <a
            href="/profile"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

