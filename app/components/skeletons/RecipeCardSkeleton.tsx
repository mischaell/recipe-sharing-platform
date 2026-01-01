export default function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative h-48 w-full animate-pulse bg-gray-200" />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="mt-auto space-y-2">
          <div className="flex gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

