import { Suspense } from 'react'
import Header from '@/app/components/Header'
import EditProfileContent from './EditProfileContent'
import FormSkeleton from '@/app/components/skeletons/FormSkeleton'

export default function EditProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<FormSkeleton />}>
          <EditProfileContent />
        </Suspense>
      </main>
    </div>
  )
}

