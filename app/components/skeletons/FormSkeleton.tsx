export default function FormSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="mb-8 h-9 w-48 rounded bg-gray-200" />
      
      <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i}>
            <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
        ))}
        
        <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
        <div className="h-32 w-full rounded bg-gray-200" />
        
        <div className="flex justify-end gap-4 pt-4">
          <div className="h-10 w-24 rounded bg-gray-200" />
          <div className="h-10 w-32 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}



