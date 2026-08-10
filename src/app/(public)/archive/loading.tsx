export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50/30 pb-24 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-[6px] border-[#b18c39] p-10 md:p-20 relative overflow-hidden mb-16 shadow-2xl">
         <div className="max-w-7xl mx-auto space-y-4">
            <div className="h-6 w-40 bg-slate-700/50 rounded-sm animate-pulse"></div>
            <div className="h-14 w-80 bg-slate-700/30 rounded-sm animate-pulse"></div>
            <div className="h-5 w-[500px] max-w-full bg-slate-700/20 rounded-sm animate-pulse"></div>
         </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid md:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map((i) => (
               <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-pulse">
                  <div className="h-4 w-24 bg-slate-200 rounded-full mb-6"></div>
                  <div className="h-8 w-3/4 bg-slate-200 rounded mb-4"></div>
                  <div className="space-y-2 mb-8">
                     <div className="h-4 w-full bg-slate-100 rounded"></div>
                     <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                     <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
                  </div>
                  <div className="h-10 w-32 bg-slate-100 rounded-full self-end"></div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
