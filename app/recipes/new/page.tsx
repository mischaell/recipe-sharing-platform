import { Suspense } from 'react'
import { getUserProfile, getUser } from '@/app/lib/auth/get-user'
import { redirect } from 'next/navigation'
import Header from '@/app/components/Header'
import RecipeForm from './RecipeForm'
import FormSkeleton from '@/app/components/skeletons/FormSkeleton'

async function NewRecipeContent() {
  const user = await getUser()
  const userProfile = await getUserProfile()

  if (!user || !userProfile) {
    redirect('/login')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Add New Recipe</h1>
      <RecipeForm />
    </div>
  )
}

export default function NewRecipePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<FormSkeleton />}>
          <NewRecipeContent />
        </Suspense>
      </main>
    </div>
  )
}


