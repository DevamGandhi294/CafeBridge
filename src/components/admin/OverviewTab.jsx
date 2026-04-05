import { Coffee, Table2, Receipt, TrendingUp } from 'lucide-react';
import { useCafeStore } from '../../store/cafeStore';
import TableStatusBadge from '../ui/TableStatusBadge';

export default function OverviewTab({ onTabChange }) {
  const tables = useCafeStore((s) => s.tables);
  const orders = useCafeStore((s) => s.orders);
  const menuItems = useCafeStore((s) => s.menuItems);

  const activeOrders = orders.filter((o) => ['ordering', 'occupied'].includes(o.status));
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const availableTables = tables.filter((t) => t.status === 'empty').length;
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: 'Active Orders',
      value: activeOrders.length,
      icon: Receipt,
      color: 'amber',
      sub: 'In progress',
    },
    {
      label: 'Available Tables',
      value: availableTables,
      icon: Table2,
      color: 'emerald',
      sub: `of ${tables.length} total`,
    },
    {
      label: 'Menu Items',
      value: menuItems.filter((m) => m.available).length,
      icon: Coffee,
      color: 'blue',
      sub: `${menuItems.length} total`,
    },
    {
      label: "Today's Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'violet',
      sub: `${paidOrders.length} paid orders`,
    },
  ];

  const colorMap = {
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-coffee-900 mb-1">Overview</h2>
        <p className="font-body text-sm text-coffee-500">Café at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5 animate-fade-up">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 border ${colorMap[stat.color]}`}>
                <Icon size={18} />
              </div>
              <p className="font-display text-2xl font-semibold text-coffee-900">{stat.value}</p>
              <p className="font-body text-sm font-medium text-coffee-700 mt-0.5">{stat.label}</p>
              <p className="font-body text-xs text-coffee-400 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-coffee-900">Active Orders</h3>
            <button onClick={() => onTabChange('orders')} className="btn-ghost text-xs">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {activeOrders.slice(0, 4).map((order) => (
              <ActiveOrderRow key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Table Status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-coffee-900">Table Status</h3>
          <button onClick={() => onTabChange('tables')} className="btn-ghost text-xs">
            Manage tables
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`card p-3 text-center ${
                table.status === 'empty'
                  ? 'border-emerald-200/60'
                  : table.status === 'ordering'
                  ? 'border-amber-200/60'
                  : 'border-red-200/60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-display font-semibold ${
                  table.status === 'empty'
                    ? 'bg-emerald-50 text-emerald-700'
                    : table.status === 'ordering'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {table.number}
              </div>
              <TableStatusBadge status={table.status} />
            </div>
          ))}
        </div>
      </div>
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
          <p className="font-body text-sm font-semibold text-coffee-900">
            Table {order.tableNumber}
          </p>
          <p className="font-body text-xs text-coffee-500">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
            {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-body text-sm font-semibold text-coffee-900">
          ₹{(order.total * 1.08).toFixed(2)}
        </p>
        <span
          className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
            order.status === 'ordering'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {order.status === 'ordering' ? 'New' : 'Occupied'}
        </span>
      </div>
    </div>
  );
}
