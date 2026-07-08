import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

const headlines = [
  { main: 'Ghee & Grace', sub: 'South Indian soul' },
  { main: 'Slow Brewed', sub: 'Patience in every cup' },
  { main: 'Authentic Flavors', sub: 'Taste the tradition' },
  { main: 'Crispy & Golden', sub: 'Perfectly crafted delights' },
];

const heroImages = [
  '/assets/food_spread.png',
  '/assets/ambience_interior.jpg',
  '/pics/IMG_0871.JPG',
  '/pics/IMG_0838.JPG',
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 4500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev + 1) % headlines.length);
    setTimeout(() => setIsTransitioning(false), 1200);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleScrollDown = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden bg-charcoal hero-overlay"
    >
      {/* Background Images */}
      {heroImages.map((img, i) => (
        <div
          key={i}
          className="hero-image-layer transition-all duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
          style={{
            backgroundImage: `url(${img})`,
            opacity: currentIndex === i ? 1 : 0,
            transform: currentIndex === i ? 'scale(1)' : 'scale(1.1)',
            zIndex: currentIndex === i ? 2 : 1,
          }}
        />
      ))}

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 z-[3]" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 py-24 md:py-32">
        {/* Top - Brand name */}
        <div className="flex items-start justify-between">
          <div className="overflow-hidden">
            <p
              className="font-body text-[10px] md:text-xs uppercase tracking-[0.2em] text-warm-white/60"
              style={{
                animation: 'fadeInUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
              }}
            >
              Est. 2026 / Jabalpur
            </p>
          </div>

          <a
            href="https://www.google.com/maps/place/23%C2%B009'58.4%22N+79%C2%B055'47.0%22E/@23.1662292,79.9271401,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-warm-white/60 hover:text-burnt-orange transition-colors"
            style={{
              animation: 'fadeInUp 0.8s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          >
            <MapPin size={12} />
            <span className="font-body text-[10px] uppercase tracking-[0.1em]">Find Us</span>
          </a>
        </div>

        {/* Center - Main Headline */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="overflow-hidden mb-4">
            <h1
              key={`headline-${currentIndex}`}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-warm-white leading-[1.05] tracking-tight"
              style={{
                animation: 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) both',
              }}
            >
              {headlines[currentIndex].main}
            </h1>
          </div>

          <div className="overflow-hidden">
            <p
              key={`subline-${currentIndex}`}
              className="font-body text-sm md:text-base text-warm-white/70 tracking-[0.05em] hover:text-[#f5f5dc] transition-colors duration-300 cursor-default"
              style={{
                animation: 'fadeInUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
              }}
            >
              {headlines[currentIndex].sub}
            </p>
          </div>

          {/* Rolling text indicator */}
          <div className="mt-8 flex gap-2">
            {headlines.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex(i);
                    startAutoPlay();
                    setTimeout(() => setIsTransitioning(false), 1200);
                  }
                }}
                className={`w-8 h-0.5 rounded-full transition-all duration-500 ${
                  currentIndex === i ? 'bg-burnt-orange' : 'bg-warm-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom - Scroll indicator */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleScrollDown}
            className="flex flex-col items-center gap-2 text-warm-white/50 hover:text-burnt-orange transition-colors group"
          >
            <span className="font-body text-[10px] uppercase tracking-[0.15em]">Explore</span>
            <ChevronDown
              size={20}
              className="group-hover:translate-y-1 transition-transform"
              style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
            />
          </button>
        </div>
      </div>

      {/* Side rolling text */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div
          className="flex flex-col gap-3"
          style={{ animation: 'fadeInUp 1s 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          {[
            'filter',
            '&',
            'benne'
          ].map((word, i) => (
            <div key={i} className="rolling-text-item">
              <div
                className={`rolling-text-inner font-body text-[10px] uppercase tracking-[0.15em] ${
                  word === '&' ? 'text-burnt-orange' : 'text-warm-white/40'
                }`}
                style={{
                  transform: currentIndex % 2 === 0 ? 'translateY(0)' : 'translateY(-50%)',
                }}
              >
                <div>{word}</div>
                <div>{word}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instagram link */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <a
          href="https://www.instagram.com/filterbenne/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[10px] uppercase tracking-[0.15em] text-warm-white/40 hover:text-burnt-orange transition-colors"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            animation: 'fadeInUp 1s 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          @filterbenne
        </a>
      </div>
    </section>
  );
}
