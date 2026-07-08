import { useEffect, useRef, useState } from 'react';

const showcaseItems = [
  {
    id: 1,
    name: "Benne Mysore Masala Dosa",
    description: "Crispy on the outside, soft on the inside, and generously smeared with our signature golden benne. Served with fresh coconut chutney and piping hot sambar.",
    image: "/assets/rec_ghee_podi_dosa.jpg"
  },
  {
    id: 2,
    name: "Thatte Idli",
    description: "Pillowy soft and uniquely flat, this Davangere specialty is steamed to perfection. A heavenly match with our spicy red chutney and benne.",
    image: "/assets/rec_thatte_idli.jpg"
  },
  {
    id: 3,
    name: "Bisi Bele Bath",
    description: "A warming hug in a bowl. Rice and lentils slow-cooked with fresh vegetables, tamarind, and our house-ground spice blend, topped with crunchy boondi.",
    image: "/assets/rec_bisi_bele_bhath.jpg"
  },
  {
    id: 4,
    name: "Baby Podi Idli",
    description: "Bite-sized delights tossed in our fiery, house-made gunpowder (podi) and tempered with pure ghee. Dangerously addictive.",
    image: "/assets/rec_baby_podi_idli.jpg"
  },
  {
    id: 5,
    name: "Kesari Bath",
    description: "The perfect sweet ending. Semolina roasted in ghee, cooked with saffron, and studded with roasted cashews and raisins.",
    image: "/assets/rec_kesari_baat.jpg"
  }
];

export default function FoodShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleItems(prev => prev.includes(index) ? prev : [...prev, index]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll('.showcase-row');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Scroll listener for the thread animation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !pathRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress: starts when section enters, ends when it leaves
      let progress = (windowHeight - rect.top) / (rect.height + windowHeight / 2);
      progress = Math.max(0, Math.min(1, progress));
      
      const path = pathRef.current;
      const length = path.getTotalLength();
      
      if (!path.style.strokeDasharray) {
        path.style.strokeDasharray = `${length}`;
      }
      
      path.style.strokeDashoffset = `${length * (1 - progress)}`;
      path.style.opacity = '1';
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Small timeout to ensure layout is calculated
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="specials" className="bg-sand py-24 md:py-40 overflow-hidden relative" ref={containerRef}>
      {/* Animated Scroll Thread */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          className="w-full h-full text-burnt-orange"
        >
          <path 
            ref={pathRef}
            d="M 50 0 C 100 10, 100 15, 50 20 C 0 25, 0 35, 50 40 C 100 45, 100 55, 50 60 C 0 65, 0 75, 50 80 C 100 85, 100 95, 50 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-300 ease-out"
            style={{ opacity: 0 }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="text-center mb-24">
          <p className="font-body text-[11px] uppercase tracking-[0.12em] text-burnt-orange mb-4">
            Our Masterpieces
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.1]">
            A Visual Feast
          </h2>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {showcaseItems.map((item, index) => {
            const isVisible = visibleItems.includes(index);
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                className="showcase-row flex flex-col md:flex-row items-center gap-12 md:gap-24"
                data-index={index}
              >
                {/* Image Section */}
                <div
                  className={`w-full md:w-1/2 transition-all duration-1000 ${isVisible
                      ? 'opacity-100 translate-x-0'
                      : `opacity-0 ${isEven ? '-translate-x-12' : 'translate-x-12'}`
                    } ${!isEven && 'md:order-last'}`}
                >
                  <div className="relative w-full aspect-square md:aspect-[4/5] bg-sand overflow-hidden group flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Text Section */}
                <div
                  className={`w-full md:w-1/2 transition-all duration-1000 delay-300 ${isVisible
                      ? 'opacity-100 translate-x-0'
                      : `opacity-0 ${isEven ? 'translate-x-12' : '-translate-x-12'}`
                    }`}
                >
                  <h3 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
                    {item.name}
                  </h3>
                  <p className="font-body text-base md:text-lg text-brown leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
