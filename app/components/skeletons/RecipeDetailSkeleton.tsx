export default function RecipeDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      {/* Image Skeleton */}
      <div className="relative mb-8 h-96 w-full rounded-lg bg-gray-200" />

      {/* Header Skeleton */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 h-10 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-48 rounded bg-gray-200" />
          </div>
        </div>

        {/* Metadata Skeleton */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg bg-gray-50 p-3">
              <div className="mb-1 h-3 w-16 rounded bg-gray-200" />
              <div className="h-6 w-12 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-3 h-7 w-32 rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </div>
      </div>

      {/* Ingredients Skeleton */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 h-7 w-32 rounded bg-gray-200" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-5 w-5 shrink-0 rounded-full bg-gray-200" />
              <div className="h-4 flex-1 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Steps Skeleton */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 h-7 w-32 rounded bg-gray-200" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-5/6 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


