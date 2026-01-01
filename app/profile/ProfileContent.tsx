import { getUserProfile, getUser } from '@/app/lib/auth/get-user'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import Link from 'next/link'

export default async function ProfileContent() {
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <Link
          href="/profile/edit"
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
        >
          Edit Profile
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        {profile ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Display Name</label>
              <p className="mt-1 text-lg text-gray-900">
                {(profile as any).display_name || (profile as any).user_name || (profile as any).full_name || 'Not set'}
              </p>
            </div>

            {profile.avatar_url && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Avatar</label>
                <img
                  src={profile.avatar_url}
                  alt="Profile avatar"
                  className="mt-2 h-24 w-24 rounded-full object-cover"
                />
              </div>
            )}

            {profile.bio && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <p className="mt-1 text-gray-900">{profile.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <p className="mt-1 font-mono text-sm text-gray-600">{profile.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-sm text-gray-600">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Profile not found</p>
        )}
      </div>
    </div>
  )
}


