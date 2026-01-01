import { Suspense } from 'react'
import Header from '@/app/components/Header'
import DashboardContent from './DashboardContent'
import DashboardSkeleton from '@/app/components/skeletons/DashboardSkeleton'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  )
}


