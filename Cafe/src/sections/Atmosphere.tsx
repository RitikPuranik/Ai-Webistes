import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const bentoImages = [
  { src: '/bento_barista.jpg', alt: 'Barista crafting latte art', main: true },
  { src: '/bento_machine.jpg', alt: 'Vintage espresso machine' },
  { src: '/bento_press.jpg', alt: 'Letterpress printing' },
  { src: '/bento_cup.jpg', alt: 'Coffee cup on linen' },
  { src: '/bento_interior.jpg', alt: 'Café interior' },
  { src: '/bento_pastry.jpg', alt: 'Fresh croissant' },
];

export default function Atmosphere() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const items = gsap.utils.toArray<HTMLElement>('.bento-item');
    const title = titleRef.current;

    if (!section || !grid || items.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        end: 'bottom 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      title,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    items.forEach((item, index) => {
      const direction = index % 2 === 0 ? 100 : -100;
      tl.fromTo(
        item,
        { opacity: 0, y: direction, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
        },
        `-=${0.5}`
      );
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-32 paper-texture"
      style={{ backgroundColor: '#f8ebd5' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <h2
          ref={titleRef}
          className="font-display text-charcoal text-center mb-16 opacity-0"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          Crafted with Intention
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {bentoImages.map((img, idx) => (
            <div
              key={idx}
              className={`bento-item overflow-hidden rounded-lg relative group opacity-0 ${
                img.main
                  ? 'col-span-2 row-span-2'
                  : 'col-span-1 row-span-1'
              }`}
              style={{
                aspectRatio: img.main ? '1/1' : '1/1',
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
              {img.main && (
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-body text-cream/90 text-sm uppercase tracking-[0.1em]">
                    The Art of Coffee
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}