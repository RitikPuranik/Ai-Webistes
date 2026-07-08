import { useEffect, useRef, useState } from 'react';

const galleryImages = [
  {
    src: '/assets/ambience_mural.png',
    alt: 'Beautiful South Indian village mural with hanging lights',
    span: 'col-span-2 row-span-2',
  },
  {
    src: '/pics/IMG_0855.png',
    alt: 'Filter & Benne Ambience',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/pics/IMG_0859.JPG',
    alt: 'Cafe Interior',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/pics/IMG_0943.JPG',
    alt: 'Delicious Offerings',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/pics/IMG_0974.JPG',
    alt: 'South Indian Vibes',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/pics/IMG_1011.JPG',
    alt: 'Cozy Atmosphere',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/assets/ambience_seating.png',
    alt: 'Cozy seating area with warm lighting',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/assets/ambience_interior.jpg',
    alt: 'Spacious dining area with wooden furniture',
    span: 'col-span-1 row-span-2',
  },
  {
    src: '/assets/cafe_exterior.jpg',
    alt: 'Filter & Benne exterior at night',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/assets/sign_lit.png',
    alt: 'Illuminated circular sign',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/assets/logo_text.png',
    alt: 'Filter & Benne brand text',
    span: 'col-span-1 row-span-1',
    objectFit: 'object-contain p-8',
    bgClass: 'bg-[#F2E5CE]',
  },
];

export default function Ambience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  // Intersection Observer for fade-in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // NEW: Prevent background scrolling when the modal is open
  useEffect(() => {
    if (clickedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [clickedIndex]);

  return (
    <>
      <section
        id="ambience"
        ref={sectionRef}
        className="bg-charcoal py-24 md:py-40 px-6 md:px-12 lg:px-24 relative"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            className={`mb-16 md:mb-24 transition-all duration-1000 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="font-body text-[11px] uppercase tracking-[0.12em] text-burnt-orange mb-4">
              The Space
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-warm-white leading-[1.1]">
              Where Every Corner
              <br />
              <span className="italic text-sand">Tells a Story</span>
            </h2>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[250px]">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                onClick={() => setClickedIndex(i)}
                className={`gallery-item relative overflow-hidden cursor-pointer group ${img.span} ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${img.bgClass || 'bg-charcoal'}`}
                style={{
                  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1 + 0.2}s`,
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${
                    img.objectFit || 'object-cover'
                  }`}
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end p-4 md:p-6">
                  <p className="font-body text-[10px] uppercase tracking-[0.1em] text-warm-white/0 group-hover:text-warm-white/90 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {img.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div
            className={`mt-16 md:mt-24 text-center transition-all duration-1000 delay-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="font-display text-xl md:text-2xl text-warm-white/60 italic max-w-2xl mx-auto">
              "The warmth of South India, served with love in every detail."
            </p>
          </div>
        </div>
      </section>

      {/* NEW: Full-Screen Modal Overlay */}
      {clickedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
          onClick={() => setClickedIndex(null)} // Close when clicking the background
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-burnt-orange transition-colors p-2"
            onClick={() => setClickedIndex(null)}
            aria-label="Close image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 md:w-10 md:h-10"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Centered Image */}
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <img
              src={galleryImages[clickedIndex].src}
              alt={galleryImages[clickedIndex].alt}
              className="max-h-[80vh] w-auto max-w-full object-contain shadow-2xl animate-fade-in-up"
              onClick={(e) => e.stopPropagation()} // Prevent closing if they click directly on the image itself
            />
            
            {/* Image Caption */}
            <p className="text-warm-white mt-6 font-body text-xs md:text-sm uppercase tracking-[0.15em] text-center">
              {galleryImages[clickedIndex].alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}