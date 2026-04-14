import { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ChevronUp, User, Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore, useCafeStore } from '../../store/cafeStore';

// ─── Phone validation (10-digit Indian) ──────────────────────────────────────
function isValidPhone(ph) {
  return /^[6-9]\d{9}$/.test(ph.replace(/\s/g, ''));
}

// ─── Customer Details Modal ───────────────────────────────────────────────────
function CustomerModal({ onConfirm, onClose }) {
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Enter a valid name';
    if (!isValidPhone(phone)) e.phone = 'Enter a valid 10-digit mobile number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await onConfirm({ name: name.trim(), phone: phone.replace(/\s/g, '') });
    setLoading(false);
  };

  const formatPhone = (val) => {
    // Allow only digits, max 10
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-coffee-900/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-warm-xl overflow-hidden animate-slide-in-bottom">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-coffee-100 flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-coffee-900">Your Details</h3>
            <p className="font-body text-xs text-coffee-400 mt-0.5">
              Required for bill &amp; payment confirmation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-coffee-100 transition-colors mt-0.5"
          >
            <X size={16} className="text-coffee-500" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="font-body text-xs font-medium text-coffee-600 mb-1.5 block">
              Full Name
            </label>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border bg-cream-50 transition-colors
              ${errors.name ? 'border-red-300 bg-red-50' : 'border-coffee-200 focus-within:border-coffee-400'}`}>
              <User size={15} className={errors.name ? 'text-red-400' : 'text-coffee-400'} />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
                }}
                placeholder="e.g. Rahul Shah"
                className="flex-1 bg-transparent font-body text-sm text-coffee-900 placeholder:text-coffee-300 outline-none"
              />
            </div>
            {errors.name && (
              <p className="font-body text-[11px] text-red-500 mt-1 ml-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="font-body text-xs font-medium text-coffee-600 mb-1.5 block">
              Mobile Number
            </label>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border bg-cream-50 transition-colors
              ${errors.phone ? 'border-red-300 bg-red-50' : 'border-coffee-200 focus-within:border-coffee-400'}`}>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Phone size={15} className={errors.phone ? 'text-red-400' : 'text-coffee-400'} />
                <span className="font-body text-sm text-coffee-500">+91</span>
                <div className="w-px h-4 bg-coffee-200" />
              </div>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => formatPhone(e.target.value)}
                placeholder="98765 43210"
                className="flex-1 bg-transparent font-body text-sm text-coffee-900 placeholder:text-coffee-300 outline-none tracking-wide"
              />
            </div>
            {errors.phone ? (
              <p className="font-body text-[11px] text-red-500 mt-1 ml-1">{errors.phone}</p>
            ) : (
              <p className="font-body text-[11px] text-coffee-400 mt-1 ml-1">
                Bill &amp; payment link will be sent to this number
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-cream-200/40 border-t-cream-50 rounded-full animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                Continue to Place Order
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main CartPanel ───────────────────────────────────────────────────────────
export default function CartPanel({ tableNumber }) {
  const [isOpen, setIsOpen]           = useState(false);
  const [ordering, setOrdering]       = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);

  const cart       = useCartStore((s) => s.getCart(tableNumber));
  const itemCount  = useCartStore((s) => s.getItemCount(tableNumber));
  const total      = useCartStore((s) => s.getTotal(tableNumber));
  const updateQty  = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart  = useCartStore((s) => s.clearCart);

  const placeOrder    = useCafeStore((s) => s.placeOrder);
  const saveCustomer  = useCafeStore((s) => s.saveCustomer);
  const table         = useCafeStore((s) => s.tables.find((t) => t.number === tableNumber));

  const isOccupied     = table?.status === 'occupied';
  const hasActiveOrder = table?.status === 'ordering';

  const tax        = total * 0.08;
  const grandTotal = total + tax;

  // Step 1: open customer modal
  const handlePlaceOrderClick = () => {
    if (cart.items.length === 0) return;
    setShowCustomer(true);
  };

  // Step 2: customer confirmed → place order + save customer
  const handleCustomerConfirm = async ({ name, phone }) => {
    setShowCustomer(false);
    setOrdering(true);

    try {
      const orderId = await placeOrder(tableNumber, cart.items, total);

      if (orderId) {
        // Save / update customer in Firestore
        await saveCustomer({ name, phone, orderId });

        clearCart(tableNumber);
        setIsOpen(false);
        toast.success(`Order placed! See you soon, ${name} ☕`);
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Order error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  if (tableNumber === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      {!isOpen && itemCount > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-6 py-3.5 bg-coffee-800 text-cream-50 rounded-full shadow-warm-xl hover:bg-coffee-900 transition-all duration-300 animate-slide-in-bottom active:scale-95 font-body text-sm font-medium"
        >
          <div className="relative">
            <ShoppingBag size={18} />
            <span className="absolute -top-2 -right-2 w-4.5 h-4.5 rounded-full bg-caramel-400 text-coffee-900 text-[10px] font-bold flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span>View Order</span>
          <span className="font-semibold">₹{grandTotal.toFixed(2)}</span>
          <ChevronUp size={14} />
        </button>
      )}

      {/* Cart Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-end">
          <div
            className="absolute inset-0 bg-coffee-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-full md:w-[420px] md:h-full bg-white md:rounded-none rounded-t-3xl shadow-warm-xl flex flex-col animate-slide-in-bottom md:animate-slide-in-right overflow-hidden max-h-[90vh] md:max-h-full">
            {/* Handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-coffee-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-coffee-100">
              <div>
                <h2 className="font-display text-xl font-semibold text-coffee-900">Your Order</h2>
                <p className="font-body text-xs text-coffee-500 mt-0.5">Table {tableNumber}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-coffee-100 transition-colors"
              >
                <X size={18} className="text-coffee-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-hide">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingBag size={40} className="text-coffee-200 mb-4" />
                  <p className="font-display text-lg text-coffee-600">Your cart is empty</p>
                  <p className="font-body text-xs text-coffee-400 mt-1">
                    Add items from the menu to get started
                  </p>
                </div>
              ) : (
                cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    tableNumber={tableNumber}
                    onUpdateQty={updateQty}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>

            {/* Summary + CTA */}
            {cart.items.length > 0 && (
              <div className="px-6 py-5 border-t border-coffee-100 bg-cream-50/50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between font-body text-sm text-coffee-600">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-coffee-600">
                    <span>Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-display text-lg font-semibold text-coffee-900 pt-2 border-t border-coffee-100">
                    <span>Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {hasActiveOrder ? (
                  <div className="w-full py-3 rounded-xl bg-amber-50 border border-amber-200 text-center text-amber-700 font-body text-sm font-medium">
                    Order already placed — Staff will serve you shortly
                  </div>
                ) : (
                  <button
                    onClick={handlePlaceOrderClick}
                    disabled={ordering || isOccupied}
                    className="btn-primary w-full py-3.5 rounded-xl"
                  >
                    {ordering ? (
                      <>
                        <span className="w-4 h-4 border-2 border-cream-200/40 border-t-cream-50 rounded-full animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Details Modal — renders above cart drawer */}
      {showCustomer && (
        <CustomerModal
          onConfirm={handleCustomerConfirm}
          onClose={() => setShowCustomer(false)}
        />
      )}
    </>
  );
}

// ─── Cart Item ────────────────────────────────────────────────────────────────
function CartItem({ item, tableNumber, onUpdateQty, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-cream-50 border border-coffee-100/50 animate-fade-in">
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-coffee-900 truncate">{item.name}</p>
        <p className="font-body text-xs text-coffee-500">₹{(item.price * item.qty).toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onUpdateQty(tableNumber, item.id, item.qty - 1)}
          className="w-7 h-7 rounded-full bg-white border border-coffee-200 flex items-center justify-center text-coffee-600 hover:bg-coffee-50 transition-colors active:scale-90"
        >
          {item.qty === 1 ? <Trash2 size={11} /> : <Minus size={11} />}
        </button>
        <span className="font-body text-sm font-semibold text-coffee-900 w-5 text-center">
          {item.qty}
        </span>
        <button
          onClick={() => onUpdateQty(tableNumber, item.id, item.qty + 1)}
          className="w-7 h-7 rounded-full bg-coffee-700 text-cream-50 flex items-center justify-center hover:bg-coffee-800 transition-colors active:scale-90"
        >
          <Plus size={11} />
        </button>
      </div>
    </div>
  );
}