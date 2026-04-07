export default function PropertyLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-20 pb-16 animate-pulse">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="h-4 w-48 bg-[#e1e3e4] rounded my-4" />

        {/* Gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-2xl overflow-hidden mb-10">
          <div className="col-span-2 row-span-2 bg-[#e1e3e4]" />
          <div className="bg-[#e7e8e9]" />
          <div className="bg-[#e7e8e9]" />
          <div className="bg-[#e7e8e9]" />
          <div className="bg-[#e7e8e9]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                {[60, 80].map((w, i) => <div key={i} style={{ width: w }} className="h-6 bg-[#e1e3e4] rounded-full" />)}
              </div>
              <div className="h-10 w-3/4 bg-[#e1e3e4] rounded-xl" />
              <div className="h-5 w-1/2 bg-[#f3f4f5] rounded-lg" />
            </div>

            <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6 h-32" />
            <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6 h-40" />
            <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6 h-56" />
          </div>

          {/* Right */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6 h-80" />
          </div>
        </div>
      </div>
    </div>
  );
}
