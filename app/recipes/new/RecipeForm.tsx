'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createRecipe } from './actions'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StepFields from '@/app/components/StepFields'
import IngredientsFields from '@/app/components/IngredientsFields'

export default function RecipeForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(createRecipe, null)

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      // Small delay to show success message, then redirect
      const timer = setTimeout(() => {
        // Use window.location for a hard redirect to ensure page refresh and data reload
        window.location.href = '/dashboard'
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [state?.success])

  return (
    <form action={formAction} className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      {state?.error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error creating recipe
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{state.error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {state?.success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Recipe created successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Recipe Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
          placeholder="e.g., Classic Margherita Pizza"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
          placeholder="A brief description of your recipe..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional: Provide a short description of your recipe
        </p>
      </div>

      <IngredientsFields namePrefix="ingredient" />

      <StepFields namePrefix="step" />

      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
          Recipe Image URL
        </label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
          placeholder="https://example.com/recipe-image.jpg"
        />
        <p className="mt-1 text-xs text-gray-500">
          Paste a URL to an image, or leave blank to use default
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="prep_minutes" className="block text-sm font-medium text-gray-700">
            Preparation Time (minutes) *
          </label>
          <input
            type="number"
            id="prep_minutes"
            name="prep_minutes"
            required
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
            placeholder="15"
          />
        </div>

        <div>
          <label htmlFor="cooking_time" className="block text-sm font-medium text-gray-700">
            Cooking Time (minutes) *
          </label>
          <input
            type="number"
            id="cooking_time"
            name="cooking_time"
            required
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
            placeholder="30"
          />
        </div>

        <div>
          <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
            Servings *
          </label>
          <input
            type="number"
            id="servings"
            name="servings"
            required
            min="1"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
            placeholder="4"
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
            Difficulty *
          </label>
          <select
            id="difficulty"
            name="difficulty"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category / Cuisine
        </label>
        <input
          type="text"
          id="category"
          name="category"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
          placeholder="e.g., Italian, Dessert"
        />
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        <a
          href="/dashboard"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancel
        </a>
        <SubmitButton />
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-50"
    >
      {pending ? 'Creating...' : 'Create Recipe'}
    </button>
  )
}

