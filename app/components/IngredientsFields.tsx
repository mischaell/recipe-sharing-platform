'use client'

import { useState, useEffect } from 'react'

interface IngredientsFieldsProps {
  initialIngredients?: string[]
  namePrefix?: string
}

export default function IngredientsFields({ initialIngredients = [''], namePrefix = 'ingredient' }: IngredientsFieldsProps) {
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients.length > 0 ? initialIngredients : [''])

  useEffect(() => {
    if (initialIngredients && initialIngredients.length > 0) {
      setIngredients(initialIngredients)
    }
  }, [initialIngredients])

  const addIngredient = () => {
    const newIngredients = [...ingredients, '']
    setIngredients(newIngredients)
    // Update hidden JSON field
    setTimeout(() => {
      const hiddenInput = document.querySelector('input[name="ingredients_json"]') as HTMLInputElement
      if (hiddenInput) {
        hiddenInput.value = JSON.stringify(newIngredients.filter(s => s.trim()))
      }
    }, 0)
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index)
      setIngredients(newIngredients)
      // Update hidden JSON field after removal
      setTimeout(() => {
        const hiddenInput = document.querySelector('input[name="ingredients_json"]') as HTMLInputElement
        if (hiddenInput) {
          const inputs = document.querySelectorAll(`input[name^="${namePrefix}-"]`) as NodeListOf<HTMLInputElement>
          const currentIngredients = Array.from(inputs).map(input => input.value).filter(s => s.trim())
          hiddenInput.value = JSON.stringify(currentIngredients)
        }
      }, 0)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Ingredients *
        </label>
        <button
          type="button"
          onClick={addIngredient}
          className="inline-flex items-center rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          + Add Ingredient
        </button>
      </div>
      
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-2">
          <div className="flex-1">
            <label htmlFor={`${namePrefix}-${index}`} className="sr-only">
              Ingredient {index + 1}
            </label>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                {index + 1}
              </span>
              <input
                type="text"
                id={`${namePrefix}-${index}`}
                name={`${namePrefix}-${index}`}
                defaultValue={ingredient}
                onChange={(e) => {
                  // Update hidden JSON field
                  const hiddenInput = document.querySelector('input[name="ingredients_json"]') as HTMLInputElement
                  if (hiddenInput) {
                    const currentIngredients = [...ingredients]
                    currentIngredients[index] = e.target.value
                    hiddenInput.value = JSON.stringify(currentIngredients.filter(s => s.trim()))
                  }
                }}
                required={index === 0}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                placeholder={`Ingredient ${index + 1}: e.g., 2 cups flour`}
              />
            </div>
          </div>
          {ingredients.length > 1 && (
            <button
              type="button"
              onClick={() => {
                removeIngredient(index)
                // Update hidden JSON field after removal
                setTimeout(() => {
                  const hiddenInput = document.querySelector('input[name="ingredients_json"]') as HTMLInputElement
                  if (hiddenInput) {
                    const inputs = document.querySelectorAll(`input[name^="${namePrefix}-"]`) as NodeListOf<HTMLInputElement>
                    const currentIngredients = Array.from(inputs).map(input => input.value).filter(s => s.trim())
                    hiddenInput.value = JSON.stringify(currentIngredients)
                  }
                }, 0)
              }}
              className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-300 bg-white text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Remove ingredient ${index + 1}`}
            >
              ×
            </button>
          )}
        </div>
      ))}
      
      {/* Hidden input to store all ingredients as JSON for form submission */}
      <input
        type="hidden"
        name="ingredients_json"
        defaultValue={JSON.stringify(ingredients.filter(s => s.trim()))}
      />
    </div>
  )
}


