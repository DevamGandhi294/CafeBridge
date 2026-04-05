import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Coffee } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCafeStore } from '../store/cafeStore';

export default function AdminLoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCafeStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 700));
    const success = login(id, password);
    setLoading(false);
    if (success) {
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3e1d08 0%, #7d4014 50%, #9a5318 100%)' }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80"
            alt="Coffee"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-coffee-900/50 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col leading-none">
            <span className="font-display text-3xl font-light text-cream-50">
              Brew<span className="font-semibold italic">noire</span>
            </span>
            <span className="font-body text-[10px] tracking-[0.28em] uppercase text-cream-300/80 mt-0.5">
              Staff Portal
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote className="font-display text-3xl font-light text-cream-100 leading-snug mb-6">
            "Great coffee is not just a beverage,{' '}
            <em className="italic">it's an experience.</em>"
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-caramel-400/30 flex items-center justify-center">
              <Coffee size={18} className="text-caramel-300" />
            </div>
            <div>
              <p className="font-body text-cream-200 text-sm font-medium">Brewnoire Admin</p>
              <p className="font-body text-cream-400 text-xs">Café Management System</p>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full border border-cream-100/10" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-cream-100/10" />
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex flex-col leading-none mb-10 lg:hidden">
            <span className="font-display text-2xl font-light text-coffee-900">
              Brew<span className="font-semibold italic">noire</span>
            </span>
            <span className="font-body text-[10px] tracking-[0.28em] uppercase text-coffee-500 mt-0.5">
              Staff Portal
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-light text-coffee-900 mb-2">
              Welcome back
            </h1>
            <p className="font-body text-coffee-500 text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Demo hint */}
          <div className="mb-6 p-3 rounded-xl bg-coffee-50 border border-coffee-200">
            <p className="font-body text-xs text-coffee-600">
              <span className="font-semibold">Demo credentials:</span> admin / brewnoire2024
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-body text-xs font-medium text-coffee-700 tracking-wide">
                Admin ID
              </label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter your ID"
                  className="input-field pl-10"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-body text-xs font-medium text-coffee-700 tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-11"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-coffee-400 hover:text-coffee-600 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-body text-xs text-red-600 animate-fade-in">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-cream-200/40 border-t-cream-50 rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 font-body text-xs text-coffee-400 text-center">
            For access, contact your café manager.
          </p>
        </div>
      </div>
    </div>
  );
}
