import { Suspense } from 'react'
import Header from '@/app/components/Header'
import ProfileContent from './ProfileContent'
import ProfileSkeleton from '@/app/components/skeletons/ProfileSkeleton'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent />
        </Suspense>
      </main>
    </div>
  )
}

