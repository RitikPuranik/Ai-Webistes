import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete,
        });
      },
    });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power2.inOut' },
        '-=0.3'
      )
      .fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: 'power2.inOut' },
        '-=0.2'
      )
      .to({}, { duration: 0.4 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#201502' }}
    >
      <div ref={logoRef} className="text-center opacity-0">
        <h1
          className="font-display text-cream tracking-[0.15em]"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          LINDEN
        </h1>
        <p
          className="font-body text-sand mt-2 uppercase tracking-[0.3em]"
          style={{ fontSize: '0.75rem' }}
        >
          Café & Atelier
        </p>
      </div>

      <div
        ref={lineRef}
        className="w-24 h-px bg-sand/30 mt-8 origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      <div className="w-48 h-px bg-sand/10 mt-3 relative overflow-hidden rounded-full">
        <div
          ref={progressRef}
          className="absolute inset-y-0 left-0 bg-saddle origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <p className="font-body text-warmgray text-xs mt-6 uppercase tracking-[0.2em]">
        Loading experience
      </p>
    </div>
  );
}