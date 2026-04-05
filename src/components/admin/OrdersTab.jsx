import { useState } from 'react';
import { CheckCircle, XCircle, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCafeStore } from '../../store/cafeStore';

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ordering', label: 'New' },
  { id: 'occupied', label: 'Serving' },
  { id: 'paid', label: 'Paid' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function OrdersTab() {
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [billOrder, setBillOrder] = useState(null);

  const orders = useCafeStore((s) => s.orders);
  const updateOrderStatus = useCafeStore((s) => s.updateOrderStatus);

  const filtered =
    filter === 'all'
      ? [...orders].reverse()
      : [...orders].filter((o) => o.status === filter).reverse();

  const handleMarkServing = (orderId) => {
    updateOrderStatus(orderId, 'occupied');
    toast.success('Order marked as serving');
  };

  const handleMarkPaid = (orderId) => {
    updateOrderStatus(orderId, 'paid');
    toast.success('Order marked as paid ✓');
  };

  const handleCancel = (orderId) => {
    updateOrderStatus(orderId, 'cancelled');
    toast('Order cancelled', { icon: '❌' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-coffee-900 mb-1">Orders</h2>
        <p className="font-body text-sm text-coffee-500">
          {orders.length} total · {orders.filter((o) => ['ordering','occupied'].includes(o.status)).length} active
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
              filter === f.id
                ? 'bg-coffee-700 text-cream-50'
                : 'bg-white text-coffee-600 border border-coffee-200 hover:bg-coffee-50'
            }`}
          >
            {f.label}
            {f.id !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                {orders.filter((o) => o.status === f.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Clock size={40} className="text-coffee-200 mx-auto mb-3" />
          <p className="font-display text-lg text-coffee-600">No orders here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrder === order.id}
              onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              onMarkServing={handleMarkServing}
              onMarkPaid={handleMarkPaid}
              onCancel={handleCancel}
              onViewBill={() => setBillOrder(order)}
            />
          ))}
        </div>
      )}

      {/* Bill Modal */}
      {billOrder && (
        <BillModal order={billOrder} onClose={() => setBillOrder(null)} />
      )}
    </div>
  );
}

function OrderCard({ order, isExpanded, onToggle, onMarkServing, onMarkPaid, onCancel, onViewBill }) {
  const tax = order.total * 0.08;
  const grand = order.total + tax;

  const statusConfig = {
    ordering: { label: 'New Order', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500 animate-pulse' },
    occupied: { label: 'Serving', cls: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
    paid: { label: 'Paid', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    cancelled: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
  };
  const sc = statusConfig[order.status] || statusConfig.ordering;

  return (
    <div className="card overflow-hidden animate-fade-in">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-cream-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-coffee-50 border border-coffee-200 flex items-center justify-center font-display text-lg font-semibold text-coffee-700">
            {order.tableNumber}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p className="font-body text-sm font-semibold text-coffee-900">
                Table {order.tableNumber}
              </p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
              </span>
            </div>
            <p className="font-body text-xs text-coffee-500">
              {order.items.length} items ·{' '}
              {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ·{' '}
              {order.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-body font-semibold text-coffee-900">₹{grand.toFixed(2)}</p>
          {isExpanded ? <ChevronUp size={16} className="text-coffee-400" /> : <ChevronDown size={16} className="text-coffee-400" />}
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-coffee-100 animate-fade-in">
          {/* Items */}
          <div className="px-4 py-3 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm font-body">
                <span className="text-coffee-700">
                  <span className="font-medium text-coffee-900">{item.qty}×</span> {item.name}
                </span>
                <span className="text-coffee-600">₹{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-coffee-100 space-y-1">
              <div className="flex justify-between text-xs text-coffee-500 font-body">
                <span>Subtotal</span><span>₹{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-coffee-500 font-body">
                <span>Tax (8%)</span><span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-coffee-900 font-body pt-1">
                <span>Total</span><span>₹{grand.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 px-4 pb-4 flex-wrap">
            <button
              onClick={() => onViewBill(order)}
              className="btn-ghost text-xs gap-1.5 border border-coffee-200"
            >
              <FileText size={13} /> View Bill
            </button>
            {order.status === 'ordering' && (
              <>
                <button
                  onClick={() => onMarkServing(order.id)}
                  className="btn-ghost text-xs gap-1.5 border border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  <Clock size={13} /> Mark Serving
                </button>
                <button
                  onClick={() => onMarkPaid(order.id)}
                  className="btn-ghost text-xs gap-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <CheckCircle size={13} /> Mark Paid
                </button>
                <button
                  onClick={() => onCancel(order.id)}
                  className="btn-ghost text-xs gap-1.5 border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <XCircle size={13} /> Cancel
                </button>
              </>
            )}
            {order.status === 'occupied' && (
              <button
                onClick={() => onMarkPaid(order.id)}
                className="btn-ghost text-xs gap-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <CheckCircle size={13} /> Mark Paid
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BillModal({ order, onClose }) {
  const tax = order.total * 0.08;
  const grand = order.total + tax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-coffee-900/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-warm-xl animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bill Header */}
        <div className="bg-coffee-900 text-cream-50 px-6 py-6 text-center">
          <p className="font-display text-2xl font-light mb-0.5">
            Brew<span className="font-semibold italic">noire</span>
          </p>
          <p className="font-body text-[9px] tracking-[0.25em] uppercase text-cream-400">
            42 Artisan Lane · London W1D 3QX
          </p>
          <div className="mt-4 border-t border-coffee-700 pt-4">
            <p className="font-body text-xs text-cream-400">
              {new Date(order.placedAt).toLocaleString()}
            </p>
            <p className="font-body text-sm font-medium text-cream-200 mt-1">
              Table {order.tableNumber} · {order.id}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 py-4 space-y-2 max-h-60 overflow-y-auto">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-2 font-body text-sm">
              <div>
                <span className="text-coffee-600">{item.qty}× </span>
                <span className="text-coffee-900">{item.name}</span>
                <span className="block text-xs text-coffee-400">₹{item.price.toFixed(2)} each</span>
              </div>
              <span className="font-medium text-coffee-900 flex-shrink-0">
                ₹{(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-dashed border-coffee-200 mx-6" />
        <div className="px-6 py-4 space-y-1.5 font-body text-sm">
          <div className="flex justify-between text-coffee-600">
            <span>Subtotal</span><span>₹{order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-coffee-600">
            <span>Tax (8%)</span><span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-coffee-900 text-base border-t border-coffee-100 pt-2 mt-2">
            <span>Total</span><span>₹{grand.toFixed(2)}</span>
          </div>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="font-body text-xs text-coffee-400 mb-4">Thank you for visiting Brewnoire ☕</p>
          <button
            onClick={onClose}
            className="btn-primary w-full py-3 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
