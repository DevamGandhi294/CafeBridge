import { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCafeStore } from '../../store/cafeStore';

const BLANK_ITEM = {
  name: '',
  description: '',
  price: '',
  category: 'Coffee',
  available: true,
  featured: false,
};

export default function MenuTab() {
  const menuItems = useCafeStore((s) => s.menuItems);
  const addMenuItem = useCafeStore((s) => s.addMenuItem);
  const updateMenuItem = useCafeStore((s) => s.updateMenuItem);
  const deleteMenuItem = useCafeStore((s) => s.deleteMenuItem);
  const toggleItemAvailability = useCafeStore((s) => s.toggleItemAvailability);

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(BLANK_ITEM);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const uniqueCategories = Array.from(new Set(menuItems.map(m => m.category || 'Coffee')));
  const filterCategories = ['all', ...uniqueCategories];

  const filtered = menuItems
    .filter((m) =>
      (filterCat === 'all' || m.category === filterCat) &&
      (m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.description || '').toLowerCase().includes(search.toLowerCase()))
    );

  const openAdd = () => {
    setEditingItem(null);
    setForm(BLANK_ITEM);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item.id);
    setForm({ ...item, price: item.price.toString() });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price) };
    if (editingItem) {
      updateMenuItem(editingItem, payload);
      toast.success('Item updated');
    } else {
      addMenuItem(payload);
      toast.success('Item added to menu');
    }
    setShowForm(false);
    setForm(BLANK_ITEM);
    setEditingItem(null);
  };

  const handleDelete = (id, name) => {
    if (confirmDelete === id) {
      deleteMenuItem(id);
      setConfirmDelete(null);
      toast('Item removed', { icon: '🗑️' });
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-coffee-900 mb-1">Menu Items</h2>
          <p className="font-body text-sm text-coffee-500">
            {menuItems.filter((m) => m.available).length} available · {menuItems.length} total
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex-shrink-0">
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-body font-medium transition-all ${
                filterCat === cat
                  ? 'bg-coffee-700 text-cream-50'
                  : 'bg-white border border-coffee-200 text-coffee-600 hover:bg-coffee-50'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-coffee-100 bg-cream-50/50">
                <th className="text-left px-4 py-3 font-body text-xs font-semibold text-coffee-500 tracking-wide uppercase">Item</th>
                <th className="text-left px-4 py-3 font-body text-xs font-semibold text-coffee-500 tracking-wide uppercase">Category</th>
                <th className="text-right px-4 py-3 font-body text-xs font-semibold text-coffee-500 tracking-wide uppercase">Price</th>
                <th className="text-center px-4 py-3 font-body text-xs font-semibold text-coffee-500 tracking-wide uppercase">Status</th>
                <th className="text-right px-4 py-3 font-body text-xs font-semibold text-coffee-500 tracking-wide uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center font-body text-coffee-400 text-sm">
                    No items found
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-body text-sm font-medium text-coffee-900">{item.name}</p>
                          <p className="font-body text-xs text-coffee-400 truncate max-w-[200px]">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-xs text-coffee-600 px-2 py-1 bg-coffee-50 rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-body text-sm font-semibold text-coffee-900">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          toggleItemAvailability(item.id);
                          toast(item.available ? `${item.name} marked unavailable` : `${item.name} is now available`);
                        }}
                        className="inline-flex items-center gap-1.5 transition-colors"
                      >
                        {item.available ? (
                          <>
                            <ToggleRight size={22} className="text-emerald-500" />
                            <span className="font-body text-xs text-emerald-600">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={22} className="text-coffee-300" />
                            <span className="font-body text-xs text-coffee-400">Off</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 rounded-lg hover:bg-coffee-100 text-coffee-500 hover:text-coffee-800 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className={`p-2 rounded-lg transition-colors ${
                            confirmDelete === item.id
                              ? 'bg-red-100 text-red-600'
                              : 'hover:bg-red-50 text-coffee-400 hover:text-red-500'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0 bg-coffee-900/40 backdrop-blur-sm animate-fade-in" />
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-warm-xl animate-scale-in overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-coffee-100 sticky top-0 bg-white z-10">
              <h3 className="font-display text-xl font-semibold text-coffee-900">
                {editingItem ? 'Edit Item' : 'Add Menu Item'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-xl hover:bg-coffee-100 transition-colors text-coffee-500"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="font-body text-xs font-medium text-coffee-700 mb-1.5 block">Item Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Signature Espresso"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="font-body text-xs font-medium text-coffee-700 mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of the item"
                  rows={2}
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs font-medium text-coffee-700 mb-1.5 block">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="font-body text-xs font-medium text-coffee-700 mb-1.5 block">Category *</label>
                  <input
                    type="text"
                    list="category-list"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                    required
                  />
                  <datalist id="category-list">
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="w-4 h-4 accent-coffee-700 rounded"
                  />
                  <span className="font-body text-sm text-coffee-700">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-coffee-700 rounded"
                  />
                  <span className="font-body text-sm text-coffee-700">Featured</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Check size={15} />
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
