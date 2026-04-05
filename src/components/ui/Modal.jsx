import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-coffee-900/40 backdrop-blur-sm animate-fade-in" />
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-3xl shadow-warm-xl animate-scale-in overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-coffee-100">
            <h3 className="font-display text-xl font-semibold text-coffee-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-coffee-100 transition-colors text-coffee-500"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
