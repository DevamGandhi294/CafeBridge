import { LogOut, LayoutDashboard, UtensilsCrossed, Table2, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCafeStore } from '../../store/cafeStore';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: Receipt },
  { id: 'tables', label: 'Tables', icon: Table2 },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
];

export default function AdminNav({ activeTab, onTabChange }) {
  const logout = useCafeStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast('Signed out', { icon: '👋' });
    navigate('/admin');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-coffee-900 text-cream-100 fixed left-0 top-0 z-30">
        {/* Logo */}
        <div className="px-6 pt-7 pb-6 border-b border-coffee-700">
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-light text-cream-50">
              Brew<span className="font-semibold italic">noire</span>
            </span>
            <span className="font-body text-[9px] tracking-[0.28em] uppercase text-cream-400 mt-0.5">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-coffee-700 text-cream-50 shadow-inner'
                  : 'text-cream-400 hover:bg-coffee-800 hover:text-cream-200'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 pt-4 border-t border-coffee-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-cream-500 hover:bg-coffee-800 hover:text-cream-300 transition-all duration-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-coffee-900 border-t border-coffee-700 flex">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-body transition-colors ${
              activeTab === id ? 'text-caramel-300' : 'text-cream-500'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
