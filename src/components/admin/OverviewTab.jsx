import { useState, useMemo } from 'react';
import { Coffee, Table2, Receipt, TrendingUp, Star, BarChart2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCafeStore } from '../../store/cafeStore';
import TableStatusBadge from '../ui/TableStatusBadge';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDateKey(iso) {
  return iso ? iso.slice(0, 10) : null; // "YYYY-MM-DD"
}

function formatINR(val) {
  return `₹${Number(val).toFixed(2)}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sun
}

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, sub }) {
  const colorMap = {
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue:    'bg-blue-50 text-blue-700 border-blue-200',
    violet:  'bg-violet-50 text-violet-700 border-violet-200',
  };
  return (
    <div className="card p-5 animate-fade-up">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 border ${colorMap[color]}`}>
        <Icon size={18} />
      </div>
      <p className="font-display text-2xl font-semibold text-coffee-900">{value}</p>
      <p className="font-body text-sm font-medium text-coffee-700 mt-0.5">{label}</p>
      <p className="font-body text-xs text-coffee-400 mt-0.5">{sub}</p>
    </div>
  );
}

function ActiveOrderRow({ order }) {
  return (
    <div className="card p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center font-display text-lg font-semibold text-amber-700 flex-shrink-0">
          {order.tableNumber}
        </div>
        <div>
          <p className="font-body text-sm font-semibold text-coffee-900">Table {order.tableNumber}</p>
          <p className="font-body text-xs text-coffee-500">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
            {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-body text-sm font-semibold text-coffee-900">
          {formatINR(order.total * 1.08)}
        </p>
        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
          order.status === 'ordering' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
        }`}>
          {order.status === 'ordering' ? 'New' : 'Occupied'}
        </span>
      </div>
    </div>
  );
}

// ─── Day Detail Modal ─────────────────────────────────────────────────────────

function DayDetailModal({ dateKey, orders, onClose }) {
  const dayOrders = orders.filter(
    (o) => o.status === 'paid' && toDateKey(o.paidAt) === dateKey
  );

  const totalRevenue = dayOrders.reduce((s, o) => s + o.total, 0);

  // Best item that day
  const itemMap = {};
  dayOrders.forEach((o) =>
    o.items.forEach((i) => {
      if (!itemMap[i.name]) itemMap[i.name] = { qty: 0, revenue: 0 };
      itemMap[i.name].qty += i.qty;
      itemMap[i.name].revenue += i.price * i.qty;
    })
  );
  const topItems = Object.entries(itemMap)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5);

  const [d, m, y] = (() => {
    const dt = new Date(dateKey);
    return [dt.getDate(), MONTH_NAMES[dt.getMonth()], dt.getFullYear()];
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div>
            <h3 className="font-display text-lg font-semibold text-coffee-900">
              {d} {m} {y}
            </h3>
            <p className="font-body text-xs text-coffee-400 mt-0.5">Daily breakdown</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
            <X size={15} />
          </button>
        </div>

        {dayOrders.length === 0 ? (
          <div className="p-8 text-center text-coffee-400 font-body text-sm">No paid orders on this day.</div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Summary pills */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Orders', value: dayOrders.length },
                { label: 'Avg Order', value: formatINR(totalRevenue / dayOrders.length) },
                { label: 'Revenue', value: formatINR(totalRevenue) },
              ].map((s) => (
                <div key={s.label} className="bg-stone-50 rounded-2xl p-3 text-center">
                  <p className="font-display text-base font-semibold text-coffee-900">{s.value}</p>
                  <p className="font-body text-[11px] text-coffee-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Top items */}
            {topItems.length > 0 && (
              <div>
                <p className="font-display text-sm font-semibold text-coffee-700 mb-2">Top Items</p>
                <div className="space-y-2">
                  {topItems.map(([name, data], idx) => (
                    <div key={name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                          ${idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-coffee-500'}`}>
                          {idx + 1}
                        </span>
                        <span className="font-body text-coffee-800">{name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-body text-coffee-500 text-xs">{data.qty} sold · </span>
                        <span className="font-body font-medium text-coffee-800">{formatINR(data.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order list */}
            <div>
              <p className="font-display text-sm font-semibold text-coffee-700 mb-2">Orders</p>
              <div className="space-y-2">
                {dayOrders.map((o, idx) => (
                  <div key={o.id} className="flex items-center justify-between bg-stone-50 rounded-2xl px-4 py-2.5">
                    <div>
                      <p className="font-body text-xs font-semibold text-coffee-800">
                        #{idx + 1} · Table {o.tableNumber}
                      </p>
                      <p className="font-body text-[11px] text-coffee-400">
                        {o.items.length} item{o.items.length !== 1 ? 's' : ''} ·{' '}
                        {new Date(o.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="font-body text-sm font-semibold text-coffee-900">{formatINR(o.total)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Revenue Calendar ─────────────────────────────────────────────────────────

function RevenueCalendar({ orders }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  // Build revenue map: { "YYYY-MM-DD": number }
  const revenueByDay = useMemo(() => {
    const map = {};
    orders
      .filter((o) => o.status === 'paid' && o.paidAt)
      .forEach((o) => {
        const key = toDateKey(o.paidAt);
        map[key] = (map[key] || 0) + o.total;
      });
    return map;
  }, [orders]);

  const maxRevenue = useMemo(() => Math.max(0, ...Object.values(revenueByDay)), [revenueByDay]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells = [];
  // Empty leading cells
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayKey = toDateKey(today.toISOString());

  return (
    <>
      <div className="card p-5">
        {/* Nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
            <ChevronLeft size={15} />
          </button>
          <h3 className="font-display text-base font-semibold text-coffee-900">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>
          <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center font-body text-[11px] text-coffee-400 py-1">{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;

            const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const rev = revenueByDay[key] || 0;
            const isToday = key === todayKey;
            const isSelected = key === selectedDate;
            const intensity = maxRevenue > 0 ? rev / maxRevenue : 0;

            // Amber bg opacity based on revenue intensity
            const bgStyle = rev > 0
              ? { backgroundColor: `rgba(217, 119, 6, ${0.08 + intensity * 0.35})` }
              : {};

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(isSelected ? null : key)}
                style={bgStyle}
                className={`rounded-xl p-1 text-center transition-all hover:ring-2 hover:ring-amber-300
                  ${isSelected ? 'ring-2 ring-amber-500' : ''}
                  ${isToday ? 'ring-2 ring-coffee-400' : ''}
                `}
              >
                <p className={`font-body text-xs font-medium ${isToday ? 'text-coffee-900' : 'text-coffee-600'}`}>
                  {day}
                </p>
                {rev > 0 && (
                  <p className="font-body text-[9px] text-amber-700 font-semibold leading-tight mt-0.5">
                    ₹{rev >= 1000 ? `${(rev / 1000).toFixed(1)}k` : rev.toFixed(0)}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="font-body text-[10px] text-coffee-400">Less</span>
          {[0.08, 0.2, 0.35, 0.5, 0.65].map((op) => (
            <div key={op} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(217,119,6,${op})` }} />
          ))}
          <span className="font-body text-[10px] text-coffee-400">More</span>
        </div>
      </div>

      {/* Day detail modal */}
      {selectedDate && (
        <DayDetailModal
          dateKey={selectedDate}
          orders={orders}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </>
  );
}

// ─── All-time Best Items ──────────────────────────────────────────────────────

function BestItems({ orders }) {
  const paidOrders = orders.filter((o) => o.status === 'paid');

  const itemStats = useMemo(() => {
    const map = {};
    paidOrders.forEach((o) =>
      o.items.forEach((i) => {
        if (!map[i.name]) map[i.name] = { name: i.name, category: i.category || '—', qty: 0, revenue: 0, orders: 0 };
        map[i.name].qty += i.qty;
        map[i.name].revenue += i.price * i.qty;
        map[i.name].orders += 1;
      })
    );
    return Object.values(map).sort((a, b) => b.qty - a.qty);
  }, [paidOrders]);

  if (itemStats.length === 0) return null;

  const maxQty = itemStats[0].qty;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Star size={16} className="text-amber-500" />
        <h3 className="font-display text-lg font-semibold text-coffee-900">All-time Best Items</h3>
      </div>
      <div className="card divide-y divide-stone-100">
        {itemStats.slice(0, 8).map((item, idx) => (
          <div key={item.name} className="flex items-center gap-4 px-5 py-3">
            {/* Rank */}
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
              ${idx === 0 ? 'bg-amber-100 text-amber-700' :
                idx === 1 ? 'bg-stone-100 text-stone-600' :
                idx === 2 ? 'bg-orange-50 text-orange-500' : 'text-coffee-400 font-body'}`}>
              {idx < 3 ? idx + 1 : <span className="text-[10px]">{idx + 1}</span>}
            </span>

            {/* Name + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-body text-sm font-medium text-coffee-800 truncate">{item.name}</p>
                <p className="font-body text-xs text-coffee-400 flex-shrink-0 ml-2">{item.qty} sold</p>
              </div>
              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${(item.qty / maxQty) * 100}%` }}
                />
              </div>
              <p className="font-body text-[11px] text-coffee-400 mt-1">{item.category} · {formatINR(item.revenue)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Table Occupancy Stats ────────────────────────────────────────────────────

function TableOccupancy({ orders, tables }) {
  const paidOrders = orders.filter((o) => o.status === 'paid');

  const tableStats = useMemo(() => {
    const map = {};
    tables.forEach((t) => {
      map[t.number] = { tableNumber: t.number, orderCount: 0, revenue: 0 };
    });
    paidOrders.forEach((o) => {
      if (!map[o.tableNumber]) map[o.tableNumber] = { tableNumber: o.tableNumber, orderCount: 0, revenue: 0 };
      map[o.tableNumber].orderCount += 1;
      map[o.tableNumber].revenue += o.total;
    });
    return Object.values(map).sort((a, b) => b.orderCount - a.orderCount);
  }, [paidOrders, tables]);

  if (tableStats.every((t) => t.orderCount === 0)) return null;

  const maxOrders = Math.max(...tableStats.map((t) => t.orderCount), 1);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={16} className="text-violet-500" />
        <h3 className="font-display text-lg font-semibold text-coffee-900">Table Occupancy (All-time)</h3>
      </div>
      <div className="card divide-y divide-stone-100">
        {tableStats.map((t, idx) => (
          <div key={t.tableNumber} className="flex items-center gap-4 px-5 py-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-display text-sm font-semibold flex-shrink-0
              ${idx === 0 ? 'bg-violet-50 text-violet-700' : 'bg-stone-50 text-coffee-600'}`}>
              {t.tableNumber}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-body text-sm font-medium text-coffee-800">Table {t.tableNumber}</p>
                <p className="font-body text-xs text-coffee-400">{t.orderCount} orders</p>
              </div>
              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-400 rounded-full"
                  style={{ width: `${(t.orderCount / maxOrders) * 100}%` }}
                />
              </div>
              <p className="font-body text-[11px] text-coffee-400 mt-1">{formatINR(t.revenue)} total revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OverviewTab({ onTabChange }) {
  const tables    = useCafeStore((s) => s.tables);
  const orders    = useCafeStore((s) => s.orders);
  const menuItems = useCafeStore((s) => s.menuItems);

  const activeOrders = orders.filter((o) => ['ordering', 'occupied'].includes(o.status));
  const paidOrders   = orders.filter((o) => o.status === 'paid');

  const activeTableNumbers = new Set(activeOrders.map((o) => o.tableNumber));
  const getEffectiveTableStatus = (table) => {
    if (activeTableNumbers.has(table.number) && table.status === 'empty') return 'occupied';
    return table.status;
  };

  const availableTables = tables.filter((t) => getEffectiveTableStatus(t) === 'empty').length;
  const totalRevenue    = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: 'Active Orders',    value: activeOrders.length,                          icon: Receipt,    color: 'amber',   sub: 'In progress' },
    { label: 'Available Tables', value: availableTables,                              icon: Table2,     color: 'emerald', sub: `of ${tables.length} total` },
    { label: 'Menu Items',       value: menuItems.filter((m) => m.available).length,  icon: Coffee,     color: 'blue',    sub: `${menuItems.length} total` },
    { label: "Today's Revenue",  value: formatINR(totalRevenue),                      icon: TrendingUp, color: 'violet',  sub: `${paidOrders.length} paid orders` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-coffee-900 mb-1">Overview</h2>
        <p className="font-body text-sm text-coffee-500">Café at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-coffee-900">Active Orders</h3>
            <button onClick={() => onTabChange('orders')} className="btn-ghost text-xs">View all</button>
          </div>
          <div className="space-y-3">
            {activeOrders.slice(0, 4).map((order) => <ActiveOrderRow key={order.id} order={order} />)}
          </div>
        </div>
      )}

      {/* Table Status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-coffee-900">Table Status</h3>
          <button onClick={() => onTabChange('tables')} className="btn-ghost text-xs">Manage tables</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
          {tables.map((table) => {
            const tableStatus = getEffectiveTableStatus(table);
            return (
              <div key={table.id} className={`card p-3 text-center ${
                tableStatus === 'empty'    ? 'border-emerald-200/60' :
                tableStatus === 'ordering' ? 'border-amber-200/60'   : 'border-red-200/60'
              }`}>
                <div className={`w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-display font-semibold ${
                  tableStatus === 'empty'    ? 'bg-emerald-50 text-emerald-700' :
                  tableStatus === 'ordering' ? 'bg-amber-50 text-amber-700'     : 'bg-red-50 text-red-600'
                }`}>
                  {table.number}
                </div>
                <TableStatusBadge status={tableStatus} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Calendar */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-emerald-500" />
          <h3 className="font-display text-lg font-semibold text-coffee-900">Revenue Calendar</h3>
        </div>
        <RevenueCalendar orders={orders} />
      </div>

      {/* Analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BestItems orders={orders} />
        <TableOccupancy orders={orders} tables={tables} />
      </div>
    </div>
  );
}