const SkeletonTable = () => (
  <div className="divide-y divide-slate-100 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="p-4 flex items-center justify-between space-x-4">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-1/4" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-20" />
        <div className="h-4 bg-slate-200 rounded w-16" />
        <div className="h-6 bg-slate-200 rounded-full w-24" />
      </div>
    ))}
  </div>
);

export default SkeletonTable;
