import { useCafeStore } from '../../store/cafeStore';
import TableStatusBadge from '../ui/TableStatusBadge';

export default function TableAvailability() {
  const tables = useCafeStore((s) => s.tables);
  const orders = useCafeStore((s) => s.orders);
  const activeTableNumbers = new Set(
    orders
      .filter((o) => ['ordering', 'occupied'].includes(o.status))
      .map((o) => o.tableNumber)
  );

  const getEffectiveTableStatus = (table) => {
    if (activeTableNumbers.has(table.number) && table.status === 'empty') {
      return 'occupied';
    }
    return table.status;
  };

  const available = tables.filter((t) => getEffectiveTableStatus(t) === 'empty').length;

  return (
    <section className="py-16 md:py-20 px-6 md:px-12 bg-cream-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="section-label block mb-3">Live Availability</span>
            <h2 className="font-display text-3xl md:text-4xl font-light text-coffee-900 leading-tight">
              Table <em className="italic">Status</em>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-body text-emerald-700 text-sm font-medium">
                {available} Available
              </span>
            </div>
            <span className="font-body text-coffee-400 text-sm">
              of {tables.length} total
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {tables.map((table) => {
            const tableStatus = getEffectiveTableStatus(table);
            return (
              <div
                key={table.id}
                className={`card p-4 text-center transition-all duration-300 ${
                  tableStatus === 'empty'
                    ? 'border-emerald-200/60 hover:border-emerald-300'
                    : tableStatus === 'ordering'
                    ? 'border-amber-200/60'
                    : 'border-red-200/60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center text-lg font-display font-semibold ${
                    tableStatus === 'empty'
                      ? 'bg-emerald-50 text-emerald-700'
                      : tableStatus === 'ordering'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {table.number}
                </div>
                <p className="font-body text-xs text-coffee-500 mb-1.5">Table</p>
                <TableStatusBadge status={tableStatus} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
