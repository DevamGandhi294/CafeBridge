const STATUS_CONFIG = {
  empty: {
    label: 'Available',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  ordering: {
    label: 'Ordering',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500 animate-pulse',
  },
  occupied: {
    label: 'Occupied',
    className: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
};

export default function TableStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.empty;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-body ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
