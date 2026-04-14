import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';

const EMPTY_CART = { items: [], status: 'idle' };

// ─── Cart Store (per-table, session-based) ───────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      // { [tableNumber]: { items: [{...item, qty}], status } }
      tableCarts: {},

      getCart: (tableNumber) => {
        return get().tableCarts[tableNumber] || EMPTY_CART;
      },

      addItem: (tableNumber, item) => {
        set((state) => {
          const cart = state.tableCarts[tableNumber] || { items: [], status: 'idle' };
          const existing = cart.items.find((i) => i.id === item.id);
          const updatedItems = existing
            ? cart.items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            )
            : [...cart.items, { ...item, qty: 1 }];
          return {
            tableCarts: {
              ...state.tableCarts,
              [tableNumber]: { ...cart, items: updatedItems },
            },
          };
        });
      },

      updateQty: (tableNumber, itemId, qty) => {
        set((state) => {
          const cart = state.tableCarts[tableNumber] || { items: [], status: 'idle' };
          const updatedItems =
            qty <= 0
              ? cart.items.filter((i) => i.id !== itemId)
              : cart.items.map((i) => (i.id === itemId ? { ...i, qty } : i));
          return {
            tableCarts: {
              ...state.tableCarts,
              [tableNumber]: { ...cart, items: updatedItems },
            },
          };
        });
      },

      removeItem: (tableNumber, itemId) => {
        set((state) => {
          const cart = state.tableCarts[tableNumber] || { items: [], status: 'idle' };
          return {
            tableCarts: {
              ...state.tableCarts,
              [tableNumber]: {
                ...cart,
                items: cart.items.filter((i) => i.id !== itemId),
              },
            },
          };
        });
      },

      clearCart: (tableNumber) => {
        set((state) => ({
          tableCarts: {
            ...state.tableCarts,
            [tableNumber]: { items: [], status: 'idle' },
          },
        }));
      },

      getTotal: (tableNumber) => {
        const cart = get().tableCarts[tableNumber] || { items: [] };
        return cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
      },

      getItemCount: (tableNumber) => {
        const cart = get().tableCarts[tableNumber] || { items: [] };
        return cart.items.reduce((sum, i) => sum + i.qty, 0);
      },
    }),
    {
      name: 'brewnoire-carts',
    }
  )
);


// ─── Admin / Café Store ───────────────────────────────────────────────────────
export const useCafeStore = create(
  persist(
    (set, get) => ({
      // ── Auth ──
      isAdminLoggedIn: false,
      login: (id, password) => {
        if (id === 'admin' && password === 'cafebridge') {
          set({ isAdminLoggedIn: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdminLoggedIn: false }),

      // ── Data Ingestion via Listeners (from App.jsx) ──
      menuItems: [],
      tables: [],
      orders: [],

      setMenuItems: (items) => set({ menuItems: items }),
      setTables: (tables) => set({ tables }),
      setOrders: (orders) => set({ orders }),

      // ── Menu (Firestore Async writes) ──
      addMenuItem: async (item) => {
        try {
          await addDoc(collection(db, 'menu'), { ...item });
        } catch (error) {
          console.error('Error adding menu item:', error);
        }
      },

      updateMenuItem: async (id, updates) => {
        try {
          await updateDoc(doc(db, 'menu', id), updates);
        } catch (error) {
          console.error('Error updating menu item:', error);
        }
      },

      deleteMenuItem: async (id) => {
        try {
          await deleteDoc(doc(db, 'menu', id));
        } catch (error) {
          console.error('Error deleting menu item:', error);
        }
      },

      toggleItemAvailability: async (id) => {
        try {
          const item = get().menuItems.find((m) => m.id === id);
          if (item) {
            await updateDoc(doc(db, 'menu', id), { available: !item.available });
          }
        } catch (error) {
          console.error('Error toggling item:', error);
        }
      },

      // ── Tables (Firestore Async writes) ──
      addTable: async () => {
        try {
          const currentTables = get().tables;
          const maxNum = Math.max(...currentTables.map((t) => t.number), 0);
          const newNumber = maxNum + 1;
          await setDoc(
            doc(db, 'tables', 'allTables'),
            {
              [`${newNumber}`]: {
                id: newNumber,
                number: newNumber,
                status: 'empty',
                currentOrderId: null,
              },
            },
            { merge: true }
          );
        } catch (error) {
          console.error('Error adding table:', error);
        }
      },

      removeTable: async (tableNumber) => {
        try {
          const { deleteField } = await import('firebase/firestore');
          await setDoc(
            doc(db, 'tables', 'allTables'),
            { [`${tableNumber}`]: deleteField() },
            { merge: true }
          );
        } catch (error) {
          console.error('Error removing table:', error);
        }
      },

      // ✅ FIXED: use nested object instead of dot-notation keys
      updateTableStatus: async (tableNumber, status, orderId = null) => {
        try {
          const table = get().tables.find((t) => t.number === tableNumber);
          const newOrderId = orderId !== null ? orderId : table?.currentOrderId;

          await setDoc(
            doc(db, 'tables', 'allTables'),
            {
              [`${tableNumber}`]: {
                status: status,
                currentOrderId: newOrderId,
              },
            },
            { merge: true }
          );
        } catch (e) {
          console.error('Error updating table status:', e);
        }
      },

      // ✅ FIXED: use nested object instead of dot-notation keys
      resetTable: async (tableNumber) => {
        try {
          await setDoc(
            doc(db, 'tables', 'allTables'),
            {
              [`${tableNumber}`]: {
                status: 'empty',
                currentOrderId: null,
              },
            },
            { merge: true }
          );
        } catch (e) {
          console.error('Error resetting table:', e);
        }
      },

      getAvailableTables: () =>
        get().tables.filter((t) => t.status === 'empty').length,

      // ── Orders ──

      // ✅ FIXED: use nested object instead of dot-notation keys
      placeOrder: async (tableNumber, items, total) => {
        try {
          const orderPayload = {
            tableNumber,
            items,
            total,
            status: 'ordering',
            placedAt: new Date().toISOString(),
            paidAt: null,
          };
          const orderRef = await addDoc(collection(db, 'orders'), orderPayload);
          const orderId = orderRef.id;

          // ✅ FIXED: nested object so Firestore updates correctly
          await setDoc(
            doc(db, 'tables', 'allTables'),
            {
                [`${tableNumber}`]: {
                status: 'occupied',
                currentOrderId: orderId,
              },
            },
            { merge: true }
          );

          return orderId;
        } catch (error) {
          console.error('Error placing order:', error);
          return null;
        }
      },

      // ✅ FIXED: use nested object instead of dot-notation keys
      updateOrderStatus: async (orderId, status) => {
        try {
          const updates = { status };
          if (status === 'paid') {
            updates.paidAt = new Date().toISOString();
          }
          await updateDoc(doc(db, 'orders', orderId), updates);

          const order = get().orders.find((o) => o.id === orderId);
          if (order) {
            const tableNum = order.tableNumber;

            if (status === 'paid' || status === 'cancelled') {
              // ✅ FIXED: nested object
              await setDoc(
                doc(db, 'tables', 'allTables'),
                {
                  [`${tableNum}`]: {
                    status: 'empty',
                    currentOrderId: null,
                  },
                },
                { merge: true }
              );
            } else if (status === 'occupied') {
              // ✅ FIXED: nested object
              await setDoc(
                doc(db, 'tables', 'allTables'),
                {
                  [`${tableNum}`]: {
                    status: 'occupied',
                  },
                },
                { merge: true }
              );
            }
          }
        } catch (e) {
          console.error('Error changing status:', e);
        }
      },

      getOrdersByTable: (tableNumber) =>
        get().orders.filter((o) => o.tableNumber === tableNumber),

      getActiveOrders: () =>
        get().orders.filter((o) => ['ordering', 'occupied'].includes(o.status)),
    }),
    {
      name: 'brewnoire-cafe',
      partialize: (state) => ({ isAdminLoggedIn: state.isAdminLoggedIn }),
    }
  )
);