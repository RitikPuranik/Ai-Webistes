import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        scrollLineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.2'
      );

    return () => { tl.kill(); };
  }, []);

  const scrollToMenu = () => {
    const el = document.querySelector('#offerings');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      >
        <source src="/hero_video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(32,21,2,0.3) 0%, rgba(32,21,2,0.6) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-end h-full pb-24 px-6 text-center"
        style={{ zIndex: 3 }}
      >
        <h1
          ref={titleRef}
          className="font-display text-cream max-w-4xl opacity-0"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
            lineHeight: 1.1,
            textShadow: '0 2px 40px rgba(32,21,2,0.4)',
          }}
        >
          Where every cup tells a story.
        </h1>

        <p
          ref={subtitleRef}
          className="font-body text-sand mt-6 max-w-xl opacity-0"
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.125rem)',
            lineHeight: 1.7,
            letterSpacing: '0.02em',
          }}
        >
          Artisan coffee & letterpress in the heart of the city.
        </p>

        <a
          ref={ctaRef}
          onClick={scrollToMenu}
          className="font-body text-cream mt-8 uppercase text-sm tracking-[0.1em] cursor-pointer opacity-0 border-b border-cream/40 hover:border-cream pb-1 transition-colors duration-300"
        >
          Explore the Menu
        </a>

        {/* Scroll Indicator */}
        <div
          ref={scrollLineRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
        >
          <div className="w-px h-12 bg-cream/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-cream animate-scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}