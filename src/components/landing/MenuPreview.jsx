import { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCafeStore } from '../../store/cafeStore';

export default function MenuPreview() {
  const menuItems = useCafeStore((s) => s.menuItems);
  const featured = menuItems.filter((m) => m.featured && m.available).slice(0, 6);

  return (
    <section id="menu-preview" className="py-20 md:py-28 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="section-label block mb-3">Curated Selection</span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-coffee-900 leading-tight">
              Our Finest <em className="italic">Offerings</em>
            </h2>
            <p className="font-body text-coffee-600 mt-3 max-w-md">
              Each item is prepared to order, using ingredients we're proud to know by name.
            </p>
          </div>
          <Link
            to="/menu?table=0"
            className="btn-secondary flex-shrink-0 self-start md:self-auto"
          >
            View Full Menu <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item, i) => (
            <FeaturedCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80"
            alt="Coffee beans"
            className="w-full h-48 object-cover object-center"
            style={{ filter: 'brightness(0.5)' }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <p className="font-display text-2xl md:text-3xl text-cream-50 font-light mb-4">
              Dine in? <em className="italic">Scan the QR code</em> at your table to order.
            </p>
            <p className="font-body text-cream-200/80 text-sm">
              Seamless table ordering — no waiting, just great coffee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ item, index }) {
  const [imgError, setImgError] = useState(false);
  const placeholders = [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
  ];

  return (
    <div
      className="card-hover overflow-hidden group cursor-default animate-fade-up"
      style={{ animationDelay: `₹{index * 0.08}s` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgError ? placeholders[index % placeholders.length] : item.image}
          alt={item.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-coffee-700 text-xs font-medium font-body shadow-sm">
            <Star size={10} fill="currentColor" /> Featured
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display text-lg font-medium text-coffee-900">{item.name}</h3>
          <span className="font-body text-coffee-700 font-semibold text-sm flex-shrink-0">
            ₹{item.price.toFixed(2)}
          </span>
        </div>
        <p className="font-body text-coffee-500 text-xs leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}
