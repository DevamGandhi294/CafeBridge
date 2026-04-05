import { Coffee, MapPin, Clock, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-coffee-900 text-cream-200 py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-4">
              <span className="font-display text-2xl font-light text-cream-50">
                Brew<span className="font-semibold italic">noire</span>
              </span>
              <span className="font-body text-[10px] tracking-[0.28em] uppercase text-cream-400 mt-0.5">
                Coffee & Co.
              </span>
            </div>
            <p className="font-body text-cream-400 text-sm leading-relaxed max-w-xs">
              A premium coffee experience, crafted for those who appreciate the art of a perfect brew.
            </p>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-coffee-400 mb-5">
              Find Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={14} className="text-coffee-400 mt-0.5 flex-shrink-0" />
                <span>42 Artisan Lane, Soho<br />London, W1D 3QX</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Clock size={14} className="text-coffee-400 flex-shrink-0" />
                <span>Mon–Fri: 7am – 8pm<br />Sat–Sun: 8am – 9pm</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={14} className="text-coffee-400 flex-shrink-0" />
                <span>+44 20 7123 4567</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-coffee-400 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#menu-preview" className="hover:text-cream-50 transition-colors">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="#tables" className="hover:text-cream-50 transition-colors">
                  Table Availability
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-cream-50 transition-colors">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-coffee-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-coffee-500 text-xs">
            © 2024 Brewnoire Coffee & Co. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-coffee-500 text-xs font-body">
            <Coffee size={12} />
            Made with care
          </div>
        </div>
      </div>
    </footer>
  );
}
