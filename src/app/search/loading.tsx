export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-20">
      {/* Filter bar skeleton */}
      <div className="bg-white border-b border-[#e1e3e4] h-[96px] animate-pulse">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex gap-4">
          <div className="flex-1 max-w-md h-10 bg-[#f3f4f5] rounded-xl" />
          <div className="flex gap-2">
            {[80, 72, 72, 88].map((w, i) => (
              <div key={i} style={{ width: w }} className="h-10 bg-[#f3f4f5] rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="mb-6 space-y-1 animate-pulse">
          <div className="h-6 w-48 bg-[#e1e3e4] rounded-lg" />
          <div className="h-4 w-32 bg-[#f3f4f5] rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#e1e3e4] animate-pulse">
              <div className="h-[220px] bg-[#f3f4f5]" />
              <div className="p-5 space-y-3">
                <div className="flex justify-between">
                  <div className="h-5 w-40 bg-[#e1e3e4] rounded-lg" />
                  <div className="h-5 w-24 bg-[#e1e3e4] rounded-lg" />
                </div>
                <div className="h-4 w-32 bg-[#f3f4f5] rounded-md" />
                <div className="flex gap-4 pt-2 border-t border-[#f3f4f5]">
                  {[40, 40, 56].map((w, j) => (
                    <div key={j} style={{ width: w }} className="h-4 bg-[#f3f4f5] rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
