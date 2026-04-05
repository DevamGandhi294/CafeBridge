import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { useCafeStore } from './store/cafeStore';
import Toast from './components/ui/Toast';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const setMenuItems = useCafeStore((s) => s.setMenuItems);
  const setTables = useCafeStore((s) => s.setTables);
  const setOrders = useCafeStore((s) => s.setOrders);

  useEffect(() => {
    // 1. Listen to Menu
    const unsubMenu = onSnapshot(collection(db, 'menu'), (snap) => {
      setMenuItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Listen to Tables (stored as a Map, parsed into Array)
    const unsubTables = onSnapshot(doc(db, 'tables', 'allTables'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const tablesArray = Object.values(data).sort((a, b) => a.number - b.number);
        setTables(tablesArray);
      } else {
        setTables([]);
      }
    });

    // 3. Listen to Orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubMenu();
      unsubTables();
      unsubOrders();
    };
  }, [setMenuItems, setTables, setOrders]);

  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
