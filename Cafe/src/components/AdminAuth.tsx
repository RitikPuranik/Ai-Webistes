import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { setAuthenticated } from '@/lib/data';
import { Eye, EyeOff } from 'lucide-react';

interface AdminAuthProps {
  onAuth: () => void;
}

export default function AdminAuth({ onAuth }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setAuthenticated(true);
      onAuth();
    } else {
      setError('Invalid password');
      gsap.fromTo(
        cardRef.current,
        { x: -10 },
        { x: 10, duration: 0.1, repeat: 3, yoyo: true, ease: 'power2.inOut' }
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '#201502' }}
    >
      <div
        ref={cardRef}
        className="w-full max-w-md rounded-xl p-10 opacity-0"
        style={{ backgroundColor: '#f8ebd5' }}
      >
        <div className="text-center mb-8">
          <h1 className="font-body text-charcoal text-xl font-medium uppercase tracking-[0.1em]">
            LINDEN
          </h1>
          <p className="font-body text-warmgray text-sm mt-1">
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-sand/50 border border-transparent focus:border-saddle rounded-lg px-4 py-3 font-body text-charcoal text-sm outline-none transition-colors pr-12"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray hover:text-charcoal transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="font-body text-saddle text-xs mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-body text-sm uppercase tracking-[0.1em] text-cream transition-colors duration-300 hover:opacity-90"
            style={{ backgroundColor: '#924942' }}
          >
            Enter Admin
          </button>
        </form>
      </div>
    </div>
  );
}