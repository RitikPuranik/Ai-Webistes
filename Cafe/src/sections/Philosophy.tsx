import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const chars = text.querySelectorAll('.phil-char');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 50%',
        end: 'bottom 60%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      chars,
      { opacity: 0.1 },
      {
        opacity: 1,
        stagger: {
          each: 0.02,
          from: 'random',
        },
        duration: 0.5,
        ease: 'power2.out',
      }
    );

    return () => {
      tl.kill();
    };
  }, []);

  const philosophyText =
    'We believe in the slow pour, the perfect roast, and the quiet beauty of physical things. Good coffee should feel as considered as a well-set typeface.';

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative py-32 lg:py-48 overflow-hidden"
      style={{ backgroundColor: '#201502' }}
    >
      <div ref={containerRef} className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <p
          className="text-label text-sand/50 mb-12"
          style={{ letterSpacing: '0.15em' }}
        >
          Our Philosophy
        </p>

        <p
          ref={textRef}
          className="font-display leading-[1.15] tracking-tight"
          style={{
            fontSize: 'clamp(1.8rem, 4.5vw, 4.5rem)',
            color: '#e1d5b5',
          }}
        >
          {philosophyText.split('').map((char, i) => (
            <span
              key={i}
              className="phil-char inline"
              style={{ opacity: 0.1 }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>

        <div className="mt-16 flex items-center gap-6">
          <div className="w-16 h-px bg-saddle" />
          <p className="font-body text-sand/60 text-sm">
            Est. 2019 — Paris
          </p>
        </div>
      </div>

      {/* Subtle paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1616410011236-7a42121dd981?q=80&w=1932&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          mixBlendMode: 'overlay',
        }}
      />
    </section>
  );
}