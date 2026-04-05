export default function CategoryFilter({ categories, activeCategory, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
            activeCategory === cat
              ? 'bg-coffee-700 text-cream-50 shadow-warm'
              : 'bg-white text-coffee-600 border border-coffee-200 hover:border-coffee-400 hover:bg-coffee-50'
          }`}
        >
          {cat === 'all' ? 'All Items' : cat}
        </button>
      ))}
    </div>
  );
}
