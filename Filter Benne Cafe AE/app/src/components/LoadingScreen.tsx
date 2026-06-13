import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFadeOut(true), 300);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-charcoal flex flex-col items-center justify-center transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Coffee cup SVG animation */}
      <div className="relative mb-12">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="animate-spin"
          style={{ animationDuration: '8s' }}
        >
          {/* Outer circle with brush stroke effect */}
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke="#c25e00"
            strokeWidth="2"
            strokeDasharray="8 4"
            opacity="0.4"
          />
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="#e8d5c4"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.3"
            style={{ animationDirection: 'reverse' }}
          />
        </svg>

        {/* Center Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className="font-display text-3xl text-warm-white tracking-tight"
              style={{
                animation: 'logoRotate 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              <span className="text-burnt-orange">F</span>&B
            </div>
          </div>
        </div>

        {/* Steam lines */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute w-0.5 bg-gradient-to-t from-burnt-orange to-transparent"
              style={{
                height: '20px',
                left: `${(i - 1) * 12}px`,
                animation: `steam 2s ease-in-out ${i * 0.3}s infinite`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Brand name */}
      <div className="overflow-hidden mb-8">
        <h1
          className="font-display text-2xl md:text-3xl text-warm-white tracking-wide"
          style={{
            animation: 'fadeInUp 0.8s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          Filter <span className="text-burnt-orange">&</span> Benne
        </h1>
      </div>

      {/* Tagline */}
      <p
        className="font-body text-[11px] uppercase tracking-[0.2em] text-brown mb-12"
        style={{
          animation: 'fadeInUp 0.6s 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        Taste the Tradition
      </p>

      {/* Progress bar */}
      <div className="w-48 h-px bg-white/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-burnt-orange transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress percentage */}
      <p className="font-body text-[10px] text-brown mt-4 tracking-widest">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
