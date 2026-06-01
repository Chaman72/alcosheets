export function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="h-4 bg-gray-800 rounded w-2/3" />
        <div className="h-10 bg-gray-800 rounded mt-4" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-4 bg-gray-800 rounded ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="min-h-screen bg-gray-950 pt-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse mb-12 text-center space-y-3">
          <div className="h-4 bg-gray-800 rounded w-32 mx-auto" />
          <div className="h-10 bg-gray-800 rounded w-64 mx-auto" />
          <div className="h-4 bg-gray-800 rounded w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );
}
