import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMenuItems, getCategories } from '@/lib/data';
import type { MenuItem, Category } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export default function MenuWheel() {
  const sectionRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const rotationRef = useRef([0, 0, 0, 0]);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const [containerSize, setContainerSize] = useState(400);

  useEffect(() => {
    setMenuItems(getMenuItems());
    setCategories(getCategories());

    const handleStorage = () => {
      setMenuItems(getMenuItems());
      setCategories(getCategories());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      setContainerSize(Math.min(400, window.innerWidth * 0.8));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.menu-title',
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    ).fromTo(
      '.menu-desc',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    ).fromTo(
      '.menu-wheel-container',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    );

    return () => { tl.kill(); };
  }, []);

  const sortedCats = [...categories].sort((a, b) => a.order - b.order);
  const rings = sortedCats
    .filter((cat) => menuItems.some((m) => m.category === cat.name))
    .slice(0, 4);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
    if (wheelRef.current) wheelRef.current.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - lastXRef.current;
    velocityRef.current = delta;
    lastXRef.current = e.clientX;

    const ringElements = wheelRef.current?.querySelectorAll('.spin-ring');
    ringElements?.forEach((ring, i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      const speed = 0.5 - i * 0.08;
      rotationRef.current[i] += delta * speed * direction;
      (ring as HTMLElement).style.transform = `rotate(${rotationRef.current[i]}deg)`;
    });
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (wheelRef.current) wheelRef.current.style.cursor = 'grab';

    const animate = () => {
      velocityRef.current *= 0.95;
      if (Math.abs(velocityRef.current) < 0.1) return;

      const ringElements = wheelRef.current?.querySelectorAll('.spin-ring');
      ringElements?.forEach((ring, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        const speed = 0.5 - i * 0.08;
        rotationRef.current[i] += velocityRef.current * speed * direction;
        (ring as HTMLElement).style.transform = `rotate(${rotationRef.current[i]}deg)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      id="offerings"
      ref={sectionRef}
      className="relative py-24 lg:py-40 overflow-hidden"
      style={{ backgroundColor: '#f8ebd5' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text */}
          <div>
            <h2
              className="menu-title font-display text-charcoal opacity-0"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              Seasonal Offerings
            </h2>
            <p className="menu-desc font-body text-warmgray mt-6 leading-relaxed text-lg opacity-0">
              Our menu rotates with the seasons, featuring single-origin
              pour-overs, expertly crafted espresso drinks, and house-made
              pastries. Each item is made with intention and the finest
              ingredients.
            </p>

            <div className="menu-desc mt-10 space-y-4 opacity-0">
              {sortedCats.map((cat) => {
                const catItems = menuItems.filter(
                  (m) => m.category === cat.name
                );
                if (catItems.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <h4 className="font-body text-sm uppercase tracking-[0.1em] text-saddle font-medium mb-2">
                      {cat.name}
                    </h4>
                    <div className="space-y-1">
                      {catItems.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-baseline"
                        >
                          <span className="font-body text-charcoal text-sm">
                            {item.name}
                          </span>
                          <span className="font-body text-warmgray text-sm">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="menu-desc font-body text-xs text-warmgray/60 mt-6 uppercase tracking-[0.1em] opacity-0">
              Drag the wheel to explore
            </p>
          </div>

          {/* Right - Rotating Wheel */}
          <div className="menu-wheel-container flex justify-center opacity-0">
            <div
              ref={wheelRef}
              className="relative select-none"
              style={{
                width: containerSize,
                height: containerSize,
                cursor: 'grab',
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {rings.map((ring, ringIdx) => {
                const ringRadius = ((rings.length - ringIdx) / rings.length) * 48;
                const size = `${ringRadius * 2}%`;
                const fontSize = Math.max(0.5, 0.75 - ringIdx * 0.1);
                const ringText = `${ring.name.toUpperCase()} \u2022 `.repeat(4);
                const charCount = ringText.length;

                return (
                  <div
                    key={ringIdx}
                    className="spin-ring absolute rounded-full border border-sand/60"
                    style={{
                      width: size,
                      height: size,
                      top: `${50 - ringRadius}%`,
                      left: `${50 - ringRadius}%`,
                    }}
                  >
                    {ringText.split('').map((char, charIdx) => {
                      const angle = (charIdx / charCount) * 360;
                      const translateY = -(containerSize * ringRadius) / 100;
                      return (
                        <span
                          key={charIdx}
                          className="absolute font-body uppercase font-medium"
                          style={{
                            fontSize: `${fontSize}rem`,
                            color: ringIdx === 0 ? '#924942' : '#7a685a',
                            letterSpacing: '0.05em',
                            transform: `rotate(${angle}deg) translateY(${translateY}px)`,
                            transformOrigin: 'center center',
                            height: '100%',
                            top: 0,
                            left: '50%',
                            marginLeft: '-0.3em',
                          }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      );
                    })}
                  </div>
                );
              })}

              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-saddle flex items-center justify-center shadow-lg">
                  <span className="font-body text-cream text-[0.6rem] uppercase tracking-[0.1em] text-center leading-tight">
                    Our
                    <br />
                    Menu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}