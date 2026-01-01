import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Header from '@/app/components/Header'
import RecipeDetailContent from './RecipeDetailContent'
import RecipeDetailSkeleton from '@/app/components/skeletons/RecipeDetailSkeleton'

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  if (!id || typeof id !== 'string') {
    console.error('Invalid recipe ID:', id)
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<RecipeDetailSkeleton />}>
          <RecipeDetailContent id={id} />
        </Suspense>
      </main>
    </div>
  )
}

