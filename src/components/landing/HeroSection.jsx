import { ArrowDown, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCafeStore } from '../../store/cafeStore';

export default function HeroSection() {
  const tables = useCafeStore((s) => s.tables);
  const availableCount = tables.filter((t) => t.status === 'empty').length;

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1800&q=85"
          alt="Café interior"
          className="w-full h-full object-cover object-center scale-105"
          style={{ filter: 'brightness(0.45)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/30 via-transparent to-coffee-900/80" />
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 pt-8">
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl font-light tracking-wide text-cream-50">
              Brew<span className="font-semibold italic">noire</span>
            </span>
            <span className="font-body text-[10px] tracking-[0.28em] uppercase text-cream-300 mt-0.5">
              Coffee & Co.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="font-body text-xs text-cream-200/70 hover:text-cream-100 transition-colors tracking-wide"
            >

            </Link>
            <a
              href="#menu-preview"
              className="font-body text-sm font-medium px-5 py-2.5 rounded-full border border-cream-100/40 text-cream-50 hover:bg-cream-50/10 transition-all duration-200"
            >
              Our Menu
            </a>
          </div>
        </nav>

        {/* Hero Text */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-50/10 border border-cream-100/20 text-cream-200 font-body text-xs tracking-widest uppercase mb-8 backdrop-blur-sm">
              <Coffee size={12} />
              Est. 2018 · Artisan Coffee House
            </span>
          </div>

          <h1
            className="font-display font-light text-cream-50 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-6 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Where Every
            <br />
            <em className="italic font-light">Cup Tells</em>
            <br />
            a Story
          </h1>

          <p
            className="font-body text-cream-200/80 text-base md:text-lg max-w-md leading-relaxed mb-10 animate-fade-up"
            style={{ animationDelay: '0.35s' }}
          >
            Specialty coffee sourced from single-origin farms. Crafted with precision, served with warmth.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up"
            style={{ animationDelay: '0.5s' }}
          >
            <a
              href="#menu-preview"
              className="px-8 py-3.5 rounded-full bg-coffee-400 hover:bg-coffee-300 text-coffee-900 font-body font-semibold text-sm transition-all duration-300 hover:shadow-warm-lg active:scale-95"
            >
              Explore Menu
            </a>
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-cream-50/10 backdrop-blur-sm border border-cream-100/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-body text-cream-100 text-sm">
                <strong>{availableCount}</strong> of {tables.length} tables available
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-8 animate-bounce">
          <a href="#menu-preview" className="text-cream-200/60 hover:text-cream-200 transition-colors">
            <ArrowDown size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
