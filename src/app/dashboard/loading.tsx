export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-[#e1e3e4] rounded-xl" />
          <div className="h-4 w-40 bg-[#e1e3e4] rounded-lg" />
        </div>
        <div className="h-9 w-28 bg-[#e1e3e4] rounded-full" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e1e3e4] p-5 space-y-3">
            <div className="w-10 h-10 bg-[#f3f4f5] rounded-xl" />
            <div className="h-7 w-12 bg-[#e1e3e4] rounded-lg" />
            <div className="h-4 w-24 bg-[#f3f4f5] rounded-md" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e1e3e4] overflow-hidden">
            <div className="p-5 border-b border-[#f3f4f5] flex justify-between">
              <div className="h-5 w-32 bg-[#e1e3e4] rounded-lg" />
              <div className="h-4 w-16 bg-[#f3f4f5] rounded-md" />
            </div>
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center gap-4 px-5 py-4 border-b border-[#f3f4f5] last:border-0">
                <div className="w-12 h-12 bg-[#f3f4f5] rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-[#e1e3e4] rounded-md" />
                  <div className="h-3 w-1/2 bg-[#f3f4f5] rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
