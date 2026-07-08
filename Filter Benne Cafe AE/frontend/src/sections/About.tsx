import { useEffect, useRef, useState } from 'react';

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-warm-white py-24 md:py-40 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Text Column */}
          <div className="lg:col-span-5 space-y-8">
            <div
              className={`transition-all duration-1000 ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
              }`}
            >
              <p className="font-body text-[11px] uppercase tracking-[0.12em] text-burnt-orange mb-4">
                Our Story
              </p>

              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.1] mb-6">
                Where Coffee
                <br />
                Meets{' '}
                <span className="italic text-burnt-orange">Tradition</span>
              </h2>

              <p className="font-body text-sm md:text-base text-brown leading-relaxed">
                Nestled in the heart of Jabalpur, Filter & Benne is a love letter to South Indian cafe culture. We source single-origin beans from the hills of Chikmagalur and pair them with timeless recipes passed through generations - dosas crisped in pure ghee, filter coffee decoction simmered to perfection, and sweets that carry the warmth of home.
              </p>
            </div>

            <div
              className={`transition-all duration-1000 delay-200 ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
              }`}
            >
              <p className="font-body text-sm text-brown/70 leading-relaxed mb-8">
                Our name celebrates two pillars of South Indian culinary heritage: the iconic 
                <span className="text-burnt-orange"> Filter Coffee</span> that awakens the senses, 
                and <span className="text-burnt-orange">Benne</span> (ghee) — the golden elixir 
                that transforms every dish into something extraordinary.
              </p>

              <a
                href="#menu"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block font-body text-xs uppercase tracking-[0.08em] bg-charcoal text-warm-white px-10 py-4 hover:bg-burnt-orange transition-colors duration-300"
              >
                Explore Our Menu
              </a>
            </div>
          </div>

          {/* Image Column */}
          <div
            className={`lg:col-span-7 transition-all duration-1000 delay-300 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="/assets/ambience_mural.png"
                  alt="Filter & Benne cafe interior with South Indian village mural"
                  className="w-full h-full object-cover"
                />
                
              </div>

              {/* Secondary floating image */}
              <div
                className={`absolute -top-8 -right-4  md:-right-8 w-32 rounded-full  md:w-48 aspect-square overflow-hidden shadow-2xl transition-all duration-700 delay-500 ${
                  visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
              >
                <img
                  src="/assets/logo.png"
                  alt="Filter & Benne logo"
                  className=" rounded-full w-full h-full"
        
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 md:mt-32 pt-12 border-t border-charcoal/10 transition-all duration-1000 delay-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            { value: '20+', label: 'Signature Dishes' },
            { value: '100%', label: 'Authentic Recipes' },
            { value: '7am', label: 'Opening Time' },
            { value: '10pm', label: 'Closing Time' },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="font-display text-3xl md:text-4xl text-charcoal mb-1">{stat.value}</p>
              <p className="font-body text-[11px] uppercase tracking-[0.1em] text-brown">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
