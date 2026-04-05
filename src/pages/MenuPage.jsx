import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, Coffee, ArrowLeft, ShoppingBag } from 'lucide-react';
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
  const table = tables.find((t) => t.number === tableNumber);
  const itemCount = useCartStore((s) => s.getItemCount(tableNumber));

  const isOccupied = table?.status === 'occupied';
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-body ${
                    isOccupied
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : table?.status === 'ordering'
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOccupied
                        ? 'bg-red-500'
                        : table?.status === 'ordering'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-emerald-500'
                    }`}
                  />
                  {isOccupied ? 'Occupied' : table?.status === 'ordering' ? 'Order Placed' : 'Ready to Order'}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-32">
        {/* Table Occupied Warning */}
        {isOccupied && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 animate-fade-in">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-semibold text-red-700">Table is currently in use</p>
              <p className="font-body text-xs text-red-600 mt-0.5">
                This table is occupied. Please wait or ask a staff member for assistance.
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

        {/* Order placed notification */}
        {table?.status === 'ordering' && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 animate-fade-in">
            <Coffee size={18} className="text-amber-600 flex-shrink-0 mt-0.5 animate-bounce" />
            <div>
              <p className="font-body text-sm font-semibold text-amber-700">Order in progress!</p>
              <p className="font-body text-xs text-amber-600 mt-0.5">
                Your order has been received. Our staff will bring it to your table shortly.
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
      {isValidTable && !isOccupied && <CartPanel tableNumber={tableNumber} />}
    </div>
  );
}
