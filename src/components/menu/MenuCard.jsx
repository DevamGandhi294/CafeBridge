import { useState } from 'react';
import { Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/cafeStore';

export default function MenuCard({ item, tableNumber, disabled }) {
  const [added, setAdded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const cart = useCartStore((s) => s.getCart(tableNumber));
  const cartQty = cart.items.find((i) => i.id === item.id)?.qty || 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (disabled || !item.available) return;
    addItem(tableNumber, item);
    setAdded(true);
    toast.success(`${item.name} added to cart`);
    setTimeout(() => setAdded(false), 1500);
  };


  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`card overflow-hidden group transition-all duration-300 cursor-pointer ${
        !item.available ? 'opacity-60' : 'hover:shadow-card-hover'
      }`}
    >
      {/* Body */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 flex items-center gap-2">
            {!item.available && (
              <span className="font-body text-[10px] font-medium text-red-600 px-1.5 py-0.5 bg-red-50 rounded-full border border-red-200 uppercase tracking-wider flex-shrink-0">
                Out
              </span>
            )}
            <h3 className="font-display text-base font-medium text-coffee-900 leading-snug truncate">
              {item.name}
            </h3>
            {cartQty > 0 && (
              <span className="w-5 h-5 rounded-full bg-coffee-700 text-cream-50 flex items-center justify-center text-[10px] font-bold font-body flex-shrink-0 animate-scale-in">
                {cartQty}
              </span>
            )}
            {item.description && (
               expanded ? <ChevronUp size={14} className="text-coffee-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-coffee-400 flex-shrink-0" />
            )}
          </div>
          
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="font-body text-coffee-700 font-semibold text-sm">
              ₹{item.price.toFixed(2)}
            </span>
            <button
              onClick={handleAdd}
              disabled={!item.available || disabled}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
                added
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : item.available && !disabled
                  ? 'bg-coffee-100 text-coffee-700 hover:bg-coffee-200'
                  : 'bg-cream-100 text-coffee-400 cursor-not-allowed'
              }`}
            >
              {added ? <Check size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
        
        {expanded && item.description && (
          <div className="mt-3 text-xs text-coffee-500 font-body leading-relaxed animate-fade-in pr-12">
            {item.description}
          </div>
        )}
      </div>
    </div>
  );
}
