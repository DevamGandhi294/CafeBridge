import { useState } from 'react';
import { Plus, Trash2, RotateCcw, QrCode, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCafeStore } from '../../store/cafeStore';
import TableStatusBadge from '../ui/TableStatusBadge';

export default function TablesTab() {
  const tables = useCafeStore((s) => s.tables);
  const orders = useCafeStore((s) => s.orders);
  const addTable = useCafeStore((s) => s.addTable);
  const removeTable = useCafeStore((s) => s.removeTable);
  const resetTable = useCafeStore((s) => s.resetTable);

  const [confirmRemove, setConfirmRemove] = useState(null);

  const handleAddTable = () => {
    addTable();
    toast.success(`Table ${tables.length + 1} added`);
  };

  const handleReset = (tableNum) => {
    resetTable(tableNum);
    toast.success(`Table ${tableNum} reset to empty`);
  };

  const handleRemove = (tableNum) => {
    if (confirmRemove === tableNum) {
      removeTable(tableNum);
      setConfirmRemove(null);
      toast('Table removed', { icon: '🗑️' });
    } else {
      setConfirmRemove(tableNum);
      setTimeout(() => setConfirmRemove(null), 3000);
    }
  };

  const getTableOrder = (tableNum) => {
    const table = tables.find((t) => t.number === tableNum);
    if (!table?.currentOrderId) return null;
    return orders.find((o) => o.id === table.currentOrderId);
  };

  const available = tables.filter((t) => t.status === 'empty').length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-coffee-900 mb-1">Tables</h2>
          <p className="font-body text-sm text-coffee-500">
            {available} of {tables.length} available
          </p>
        </div>
        <button onClick={handleAddTable} className="btn-primary flex-shrink-0">
          <Plus size={16} /> Add Table
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs font-body text-coffee-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
        </span>
        <span className="flex items-center gap-1.5 text-xs font-body text-coffee-500">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Ordering
        </span>
        <span className="flex items-center gap-1.5 text-xs font-body text-coffee-500">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Occupied
        </span>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => {
          const order = getTableOrder(table.number);
          const tax = order ? order.total * 0.08 : 0;
          const grand = order ? order.total + tax : 0;

          return (
            <div
              key={table.id}
              className={`card p-5 animate-fade-in transition-all duration-300 ${
                table.status === 'empty'
                  ? 'border-emerald-200/60'
                  : table.status === 'ordering'
                  ? 'border-amber-200/60'
                  : 'border-red-200/60'
              }`}
            >
              {/* Table Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display text-xl font-semibold ${
                      table.status === 'empty'
                        ? 'bg-emerald-50 text-emerald-700'
                        : table.status === 'ordering'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {table.number}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-coffee-900">
                      Table {table.number}
                    </p>
                    <TableStatusBadge status={table.status} />
                  </div>
                </div>
              </div>

              {/* Order Info */}
              {order && (
                <div className="mb-4 p-3 rounded-xl bg-cream-50 border border-coffee-100">
                  <p className="font-body text-xs text-coffee-500 mb-1.5">Current order</p>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between text-xs font-body">
                        <span className="text-coffee-700">{item.qty}× {item.name}</span>
                        <span className="text-coffee-600">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-coffee-400 font-body">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>
                  <div className="border-t border-coffee-100 mt-2 pt-2 flex justify-between font-body text-sm font-semibold text-coffee-900">
                    <span>Total</span>
                    <span>${grand.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* QR Link */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream-50 border border-coffee-100 mb-3">
                <QrCode size={13} className="text-coffee-500 flex-shrink-0" />
                <span className="font-body text-xs text-coffee-500 truncate flex-1">
                  /menu?table={table.number}
                </span>
                <a
                  href={`/menu?table=${table.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coffee-600 hover:text-coffee-800 transition-colors flex-shrink-0"
                >
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {table.status !== 'empty' && (
                  <button
                    onClick={() => handleReset(table.number)}
                    className="flex-1 btn-ghost text-xs border border-coffee-200 justify-center"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                )}
                <button
                  onClick={() => handleRemove(table.number)}
                  className={`flex-shrink-0 btn-ghost text-xs border justify-center ${
                    confirmRemove === table.number
                      ? 'border-red-300 text-red-600 bg-red-50 hover:bg-red-100'
                      : 'border-coffee-200 text-coffee-500'
                  }`}
                >
                  <Trash2 size={12} />
                  {confirmRemove === table.number ? 'Confirm?' : ''}
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Table Card */}
        <button
          onClick={handleAddTable}
          className="card border-dashed border-2 border-coffee-200 p-5 flex flex-col items-center justify-center gap-2 hover:border-coffee-400 hover:bg-coffee-50/30 transition-all duration-200 min-h-[140px] text-coffee-400 hover:text-coffee-600"
        >
          <Plus size={24} />
          <span className="font-body text-sm font-medium">Add Table</span>
        </button>
      </div>
    </div>
  );
}
