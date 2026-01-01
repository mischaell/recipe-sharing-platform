import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Header from '@/app/components/Header'
import EditRecipeContent from './EditRecipeContent'
import FormSkeleton from '@/app/components/skeletons/FormSkeleton'

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id || typeof id !== 'string') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<FormSkeleton />}>
          <EditRecipeContent id={id} />
        </Suspense>
      </main>
    </div>
  )
}

