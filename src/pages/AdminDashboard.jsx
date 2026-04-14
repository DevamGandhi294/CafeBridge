import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCafeStore } from '../store/cafeStore';
import AdminNav from '../components/admin/AdminNav';
import OverviewTab from '../components/admin/OverviewTab';
import OrdersTab from '../components/admin/OrdersTab';
import TablesTab from '../components/admin/TablesTab';
import MenuTab from '../components/admin/MenuTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const isAdmin = useCafeStore((s) => s.isAdminLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onTabChange={setActiveTab} />;
      case 'orders':
        return <OrdersTab />;
      case 'tables':
        return <TablesTab />;
      case 'menu':
        return <MenuTab />;
      default:
        return <OverviewTab onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <AdminNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="md:pl-60 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="section-label">CafeBridge Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-body text-xs text-emerald-700 font-medium">Live</span>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-up">
            {renderTab()}
          </div>
        </div>
      </main>
    </div>
  );
}
