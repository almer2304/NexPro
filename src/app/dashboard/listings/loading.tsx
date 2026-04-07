export default function ListingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-[#e1e3e4] rounded-xl" />
          <div className="h-4 w-32 bg-[#f3f4f5] rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-[#e1e3e4] rounded-full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e1e3e4] p-5 space-y-3">
            <div className="w-9 h-9 bg-[#f3f4f5] rounded-xl" />
            <div className="h-7 w-10 bg-[#e1e3e4] rounded-lg" />
            <div className="h-3 w-20 bg-[#f3f4f5] rounded-md" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e1e3e4] overflow-hidden">
        <div className="h-12 bg-[#f8f9fa] border-b border-[#f3f4f5]" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[#f3f4f5] last:border-0">
            <div className="w-14 h-14 bg-[#f3f4f5] rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-[#e1e3e4] rounded-md" />
              <div className="h-3 w-32 bg-[#f3f4f5] rounded-md" />
            </div>
            <div className="h-5 w-20 bg-[#f3f4f5] rounded-full" />
            <div className="h-5 w-16 bg-[#f3f4f5] rounded-full" />
            <div className="flex gap-2">
              {[28, 28, 28].map((w, j) => (
                <div key={j} style={{ width: w, height: 28 }} className="bg-[#f3f4f5] rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
