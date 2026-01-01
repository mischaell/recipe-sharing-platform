'use client'

import { useState, useEffect } from 'react'

interface StepFieldsProps {
  initialSteps?: string[]
  namePrefix?: string
}

export default function StepFields({ initialSteps = [''], namePrefix = 'step' }: StepFieldsProps) {
  const [steps, setSteps] = useState<string[]>(initialSteps.length > 0 ? initialSteps : [''])

  useEffect(() => {
    if (initialSteps && initialSteps.length > 0) {
      setSteps(initialSteps)
    }
  }, [initialSteps])

  const addStep = () => {
    const newSteps = [...steps, '']
    setSteps(newSteps)
    // Update hidden JSON field
    setTimeout(() => {
      const hiddenInput = document.querySelector('input[name="steps_json"]') as HTMLInputElement
      if (hiddenInput) {
        hiddenInput.value = JSON.stringify(newSteps.filter(s => s.trim()))
      }
    }, 0)
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index)
      setSteps(newSteps)
    }
  }

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Instructions (Steps) *
        </label>
        <button
          type="button"
          onClick={addStep}
          className="inline-flex items-center rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          + Add Step
        </button>
      </div>
      
      {steps.map((step, index) => (
        <div key={index} className="flex gap-2">
          <div className="flex-1">
            <label htmlFor={`${namePrefix}-${index}`} className="sr-only">
              Step {index + 1}
            </label>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                {index + 1}
              </span>
              <input
                type="text"
                id={`${namePrefix}-${index}`}
                name={`${namePrefix}-${index}`}
                defaultValue={step}
                onChange={(e) => {
                  updateStep(index, e.target.value)
                  // Update hidden JSON field
                  const hiddenInput = document.querySelector('input[name="steps_json"]') as HTMLInputElement
                  if (hiddenInput) {
                    const currentSteps = [...steps]
                    currentSteps[index] = e.target.value
                    hiddenInput.value = JSON.stringify(currentSteps.filter(s => s.trim()))
                  }
                }}
                required={index === 0}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                placeholder={`Step ${index + 1}: Describe what to do...`}
              />
            </div>
          </div>
          {steps.length > 1 && (
            <button
              type="button"
              onClick={() => {
                removeStep(index)
                // Update hidden JSON field after removal
                setTimeout(() => {
                  const hiddenInput = document.querySelector('input[name="steps_json"]') as HTMLInputElement
                  if (hiddenInput) {
                    const inputs = document.querySelectorAll(`input[name^="${namePrefix}-"]`) as NodeListOf<HTMLInputElement>
                    const currentSteps = Array.from(inputs).map(input => input.value).filter(s => s.trim())
                    hiddenInput.value = JSON.stringify(currentSteps)
                  }
                }, 0)
              }}
              className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-300 bg-white text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Remove step ${index + 1}`}
            >
              ×
            </button>
          )}
        </div>
      ))}
      
      {/* Hidden input to store all steps as JSON for form submission */}
      <input
        type="hidden"
        name="steps_json"
        defaultValue={JSON.stringify(steps.filter(s => s.trim()))}
      />
    </div>
  )
}

