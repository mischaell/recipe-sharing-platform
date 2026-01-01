'use client'

import { useState, useMemo } from 'react'
import RecipeCard from './RecipeCard'
import SearchBar from './SearchBar'

interface Recipe {
  id: string
  title: string
  description?: string
  instructions?: string
  ingredients?: string // For simple schema
  prep_minutes?: number
  cook_minutes?: number
  cooking_time?: number
  servings?: number
  difficulty?: string
  cuisine?: string
  category?: string
  image_path?: string
  image_url?: string
  user_id?: string
  author_id?: string
  created_at?: string
}

interface Profile {
  id: string
  display_name?: string
  full_name?: string
  user_name?: string
}

interface RecipeListProps {
  recipes: Recipe[]
  profilesMap: Record<string, Profile>
  currentUserId: string
  sectionTitle: string
  showSection: boolean
}

export default function RecipeList({
  recipes,
  profilesMap,
  currentUserId,
  sectionTitle,
  showSection,
}: RecipeListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')

  // Extract unique cuisines from recipes
  const availableCuisines = useMemo(() => {
    const cuisines = new Set<string>()
    recipes.forEach((recipe) => {
      if (recipe.cuisine && recipe.cuisine.trim()) {
        cuisines.add(recipe.cuisine.trim())
      }
      if (recipe.category && recipe.category.trim()) {
        cuisines.add(recipe.category.trim())
      }
    })
    return Array.from(cuisines).sort()
  }, [recipes])

  // Filter recipes based on search query, cuisine, and difficulty
  const filteredRecipes = useMemo(() => {
    let filtered = recipes

    // Filter by cuisine
    if (selectedCuisine) {
      filtered = filtered.filter((recipe) => {
        const cuisine = (recipe.cuisine || recipe.category || '').trim().toLowerCase()
        return cuisine === selectedCuisine.toLowerCase()
      })
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter((recipe) => {
        const difficulty = (recipe.difficulty || '').trim().toLowerCase()
        return difficulty === selectedDifficulty.toLowerCase()
      })
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((recipe) => {
        // Search in title
        if (recipe.title?.toLowerCase().includes(query)) {
          return true
        }

        // Search in description
        if (recipe.description?.toLowerCase().includes(query)) {
          return true
        }

        // Search in instructions
        if (recipe.instructions?.toLowerCase().includes(query)) {
          return true
        }

        // Search in ingredients (for simple schema)
        if (recipe.ingredients?.toLowerCase().includes(query)) {
          return true
        }

        // Search in cuisine/category
        if (recipe.cuisine?.toLowerCase().includes(query) || recipe.category?.toLowerCase().includes(query)) {
          return true
        }

        // Search in difficulty
        if (recipe.difficulty?.toLowerCase().includes(query)) {
          return true
        }

        // Search in author name
        const authorId = recipe.user_id || recipe.author_id
        const author = profilesMap[authorId]
        if (author) {
          const authorName = author.display_name || author.full_name || author.user_name || ''
          if (authorName.toLowerCase().includes(query)) {
            return true
          }
        }

        return false
      })
    }

    return filtered
  }, [recipes, searchQuery, selectedCuisine, selectedDifficulty, profilesMap])

  if (!showSection || recipes.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">{sectionTitle}</h2>
        {recipes.length > 0 && (
          <span className="text-sm text-gray-500">
            {filteredRecipes.length} of {recipes.length} recipes
          </span>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Search Bar */}
          <div className="flex-1">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          {/* Cuisine Dropdown */}
          <div className="w-full sm:w-48">
            <label htmlFor="cuisine-filter" className="sr-only">
              Filter by Cuisine
            </label>
            <select
              id="cuisine-filter"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="">All Cuisines</option>
              {availableCuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="w-full sm:w-48">
            <label htmlFor="difficulty-filter" className="sr-only">
              Filter by Difficulty
            </label>
            <select
              id="difficulty-filter"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(selectedCuisine || selectedDifficulty || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCuisine('')
                setSelectedDifficulty('')
              }}
              className="whitespace-nowrap rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => {
            // Get author info from profiles map
            const authorId = recipe.user_id || recipe.author_id
            const author = profilesMap[authorId]
            const authorName = author?.display_name || author?.full_name || author?.user_name || 'Unknown'

            // Map recipe data to RecipeCard props
            const description = recipe.description || recipe.instructions
              ? (recipe.description || recipe.instructions || '').substring(0, 150) + 
                ((recipe.description || recipe.instructions || '').length > 150 ? '...' : '')
              : 'No description available'

            // Use prep_minutes and cook_minutes (from initial schema) or cooking_time (from simple schema)
            const prepTime = recipe.prep_minutes ?? 0
            const cookTime = recipe.cook_minutes ?? recipe.cooking_time ?? 0
            const servings = recipe.servings ?? 4

            return (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                description={description}
                author={authorName}
                authorId={authorId}
                imageUrl={recipe.image_path || recipe.image_url || undefined}
                prepTime={prepTime}
                cookTime={cookTime}
                servings={servings}
                difficulty={recipe.difficulty || 'medium'}
                tags={recipe.cuisine ? [recipe.cuisine] : (recipe.category ? [recipe.category] : [])}
                cuisine={recipe.cuisine || recipe.category}
              />
            )
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">
            {searchQuery.trim() || selectedCuisine || selectedDifficulty
              ? `No recipes found matching your filters. Try adjusting your search criteria.`
              : 'No recipes to display.'}
          </p>
        </div>
      )}
    </div>
  )
}

