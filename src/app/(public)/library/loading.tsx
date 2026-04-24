export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 pb-24 animate-in fade-in duration-500 text-slate-100">
      {/* Header Skeleton */}
      <div className="bg-slate-950 border-b-[6px] border-[#b18c39] p-10 md:p-24 relative overflow-hidden mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
         <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-4">
            <div className="h-6 w-48 bg-slate-800 rounded-full animate-pulse"></div>
            <div className="h-16 w-80 bg-slate-800/50 rounded animate-pulse"></div>
            <div className="h-5 w-96 max-w-full bg-slate-800/30 rounded animate-pulse"></div>
         </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-center gap-4 mb-20">
            {[1, 2, 3].map(i => (
               <div key={i} className="h-12 w-28 bg-slate-800 rounded-none animate-pulse"></div>
            ))}
         </div>
         <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="bg-slate-800 border border-slate-700 animate-pulse break-inside-avoid" style={{ height: `${200 + (i % 3) * 80}px` }}></div>
            ))}
         </div>
      </div>
    </div>
  );
}
