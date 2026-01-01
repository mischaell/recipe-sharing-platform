export default function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="mb-2 h-8 w-48 rounded bg-gray-200" />
            <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
            <div className="h-4 w-64 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Bio Section Skeleton */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 h-6 w-24 rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 h-6 w-32 rounded bg-gray-200" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="mb-1 h-8 w-16 mx-auto rounded bg-gray-200" />
              <div className="h-4 w-20 mx-auto rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


