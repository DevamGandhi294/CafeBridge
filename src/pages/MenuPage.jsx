import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Coffee, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCafeStore, useCartStore } from '../store/cafeStore';
import MenuCard from '../components/menu/MenuCard';
import CategoryFilter from '../components/menu/CategoryFilter';
import CartPanel from '../components/cart/CartPanel';
import SkeletonCard from '../components/ui/SkeletonCard';

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');
  const tableNumber = parseInt(tableParam) || 0;

  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const menuItems = useCafeStore((s) => s.menuItems);
  const tables = useCafeStore((s) => s.tables);
  const orders = useCafeStore((s) => s.orders);
  const table = tables.find((t) => t.number === tableNumber);
  const itemCount = useCartStore((s) => s.getItemCount(tableNumber));

  // Derive status from the latest active order to avoid stale table.status.
  const linkedOrder = table?.currentOrderId ? orders.find((o) => o.id === table.currentOrderId) : null;
  const hasLinkedActiveOrder = linkedOrder && ['ordering', 'occupied'].includes(linkedOrder.status);
  const fallbackActiveOrder = [...orders]
    .filter((o) => o.tableNumber === tableNumber && ['ordering', 'occupied'].includes(o.status))
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())[0];
  const currentActiveOrder = hasLinkedActiveOrder ? linkedOrder : fallbackActiveOrder;

  // Block ordering if table has ANY active order (ordering OR occupied)
  const isOccupied = currentActiveOrder?.status === 'occupied';
  const isOrdering = currentActiveOrder?.status === 'ordering' || (!currentActiveOrder && table?.status === 'ordering');
  const isTableBusy = isOccupied || isOrdering;
  const isValidTable = tableNumber > 0 && !!table;

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const uniqueCats = Array.from(new Set(menuItems.map(m => m.category || 'Coffee')));

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-coffee-100/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="p-2 rounded-xl hover:bg-coffee-50 text-coffee-600 transition-colors"
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-semibold text-coffee-900">
                    Menu
                  </span>
                  {isValidTable && (
                    <span className="font-body text-xs px-2.5 py-0.5 rounded-full bg-coffee-100 text-coffee-700 font-medium">
                      Table {tableNumber}
                    </span>
                  )}
                </div>
                {!isValidTable && tableNumber === 0 && (
                  <p className="font-body text-xs text-coffee-400">Browse mode — scan QR to order</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isValidTable && (
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-body ${isOccupied
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : isOrdering
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isOccupied
                      ? 'bg-red-500'
                      : isOrdering
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-emerald-500'
                      }`}
                  />
                  {isOccupied ? 'Occupied' : isOrdering ? 'Order Placing' : 'Ready to Order'}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-32">
        {/* Table Order Status Message */}
        {(isOrdering || isOccupied) && (
          <div
            className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 animate-fade-in"
          >
            <Coffee size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-semibold text-amber-700">
                {isOrdering ? 'Your order is being preparing.' : 'Your order has been served.'}
              </p>
              <p className="font-body text-xs mt-0.5 text-amber-600">
                {isOrdering
                  ? 'Any item do you want to add?'
                  : 'How is the item taste? Any more item to add?'}
              </p>
            </div>
          </div>
        )}

        {/* Browse Warning (no table) */}
        {tableNumber === 0 && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-coffee-50 border border-coffee-200 animate-fade-in">
            <Coffee size={18} className="text-coffee-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-semibold text-coffee-700">You're browsing the menu</p>
              <p className="font-body text-xs text-coffee-500 mt-0.5">
                Scan the QR code at your table to start ordering.
              </p>
            </div>
          </div>
        )}

        {/* Category Jump Links */}
        {menuItems.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {uniqueCats.map((cat) => (
              <a
                key={cat}
                href={`#cat-${cat}`}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 bg-white text-coffee-600 border border-coffee-200 hover:border-coffee-400 hover:bg-coffee-50"
              >
                {cat}
              </a>
            ))}
          </div>
        )}

        {/* Menu Sections */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Coffee size={48} className="text-coffee-200 mb-4" />
            <p className="font-display text-xl text-coffee-600">Menu is empty</p>
          </div>
        ) : (
          <div className="space-y-10">
            {uniqueCats.map((cat) => (
              <div key={cat} id={`cat-${cat}`} className="scroll-mt-24">
                <h2 className="font-display text-xl font-semibold text-coffee-900 mb-4 px-1">{cat}</h2>
                <div className="flex flex-col gap-3">
                  {menuItems.filter(m => m.category === cat).map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      tableNumber={tableNumber}
                      disabled={!isValidTable || isOccupied}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart */}
      {isValidTable && !isTableBusy && <CartPanel tableNumber={tableNumber} />}
    </div>
  );
}
