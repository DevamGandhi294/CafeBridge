export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-fade-in">
      <div className="skeleton h-44 w-full rounded-t-2xl rounded-b-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/5" />
        <div className="flex items-center justify-between pt-1">
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 animate-fade-in">
      <div className="skeleton h-12 w-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-3 w-1/3" />
      </div>
      <div className="skeleton h-8 w-20 rounded-full" />
    </div>
  );
}
