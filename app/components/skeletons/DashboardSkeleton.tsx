export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 h-9 w-48 rounded bg-gray-200" />
          <div className="h-5 w-64 rounded bg-gray-200" />
        </div>
        <div className="h-10 w-32 rounded bg-gray-200" />
      </div>

      {/* Search and Filters Skeleton */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-7 w-32 rounded bg-gray-200" />
          <div className="h-5 w-24 rounded bg-gray-200" />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="h-12 flex-1 rounded-lg bg-gray-200" />
          <div className="h-12 w-48 rounded-lg bg-gray-200" />
          <div className="h-12 w-48 rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Recipe Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="relative h-48 w-full bg-gray-200" />
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
              <div className="mb-3 h-4 w-full rounded bg-gray-200" />
              <div className="mb-3 h-4 w-2/3 rounded bg-gray-200" />
              <div className="mt-auto space-y-2">
                <div className="flex gap-2">
                  <div className="h-4 w-16 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="h-4 w-16 rounded bg-gray-200" />
                </div>
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

