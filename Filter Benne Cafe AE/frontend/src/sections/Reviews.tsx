import { useRef, useEffect } from 'react';

const reviewsData = [
  { id: 5, src: '/reviews/fifth.mp4', link: 'https://www.instagram.com/reel/DY7bB4qT_UV/?igsh=OWRsZWZ3OThwbnl4' },
  { id: 9, src: '/reviews/nine.mp4', link: 'https://www.instagram.com/reel/DZNhs0jNjXm/?igsh=Y2hyZm42dHF0NHJv' },
  { id: 2, src: '/reviews/second.mp4', link: 'https://www.instagram.com/reel/DY5QDIMTTtR/?igsh=MXc3enNmM25vMnBseg==' },
  { id: 4, src: '/reviews/fourth.mp4', link: 'https://www.instagram.com/reel/DZfuMF0N--I/?igsh=MWd5bjBqZGtrZGJ3OA==' },
  { id: 10, src: '/reviews/tenth.mp4', link: 'https://www.instagram.com/p/DZP7DC9Jo2P/' },
  { id: 1, src: '/reviews/first.mp4', link: 'https://www.instagram.com/reel/DZcKkE1RHO7/?igsh=MWMxY2I5NWhwMGtvcg==' },
  { id: 7, src: '/reviews/seventh.mp4', link: 'https://www.instagram.com/reel/DZSryK5NR_N/?igsh=dHY0ZHJrMzM0ZTdj' },
  { id: 3, src: '/reviews/third.mp4', link: 'https://www.instagram.com/reel/DZDftftz7sM/?igsh=MWNzNnkyOTMwZ3k2bQ==' },
  { id: 8, src: '/reviews/eight.mp4', link: 'https://www.instagram.com/reel/DZFsGrGTeOK/?igsh=MTdtcTA3czI3dGF5eA==' },
  { id: 6, src: '/reviews/sixth.mp4', link: 'https://www.instagram.com/reel/DY49DzPsOP8/?igsh=ZHFrODNtbjk4a3M1' },
  { id: 11,src: '/reviews/eleventh.mp4', link: 'https://www.instagram.com/reel/DY49DzPsOP8/?i'}
];

const VideoCard = ({ review }: { review: typeof reviewsData[0] }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (window.innerWidth < 1024) {
            if (entry.isIntersecting) {
              videoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
            } else {
              videoRef.current?.pause();
            }
          }
        });
      },
      {
        rootMargin: '-33% 0px -33% 0px',
        threshold: 0
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024 && videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024 && videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <a
      ref={containerRef}
      href={review.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block break-inside-avoid mb-6 rounded-3xl overflow-hidden shadow-xl transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-black relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={review.src}
        loop
        muted
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        className="w-full h-auto block object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
      />
      {/* Play Icon Overlay (visible when not hovered, or just as a hint) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/10">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default function Reviews() {
  return (
    <section id="reviews" className="bg-[#fdfbf7] py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Desktop Layout (4 columns with text in middle) */}
        <div className="hidden lg:flex gap-6 items-start">
          
          {/* Column 1 */}
          <div className="flex-1 flex flex-col gap-6">
            <VideoCard review={reviewsData[0]} />
            <VideoCard review={reviewsData[4]} />
            <VideoCard review={reviewsData[8]} />
          </div>

          {/* Columns 2 & 3 + Header */}
          <div className="flex-[2] flex flex-col gap-6">
            {/* Header taking full width of this middle section */}
            <div className="text-center pt-4 pb-12">
              <h2 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] text-[#3e2723] uppercase tracking-tighter mb-6 leading-none flex items-center justify-center gap-4">
                TASTY = TALKS
                
        
              </h2>
              <p className="font-body text-base md:text-lg text-brown max-w-md mx-auto leading-relaxed">
                At Filter & Benne, we serve authentic Davangere flavors, daring you to rediscover the true taste of tradition with every bite.
              </p>
            </div>
            
            {/* Split into 2 columns for the remaining videos */}
            <div className="flex gap-6">
              <div className="flex-1 flex flex-col gap-6">
                <VideoCard review={reviewsData[1]} />
                <VideoCard review={reviewsData[5]} />
                <VideoCard review={reviewsData[10]} />

              </div>
              <div className="flex-1 flex flex-col gap-6 pt-12">
                <VideoCard review={reviewsData[2]} />
                <VideoCard review={reviewsData[6]} />
                
              </div>
            </div>
          </div>

          {/* Column 4 */}
          <div className="flex-1 flex flex-col gap-6 pt-16">
            <VideoCard review={reviewsData[3]} />
            <VideoCard review={reviewsData[7]} />
            <VideoCard review={reviewsData[9]} />
            
          </div>
        </div>

        {/* Mobile / Tablet Layout (standard masonry) */}
        <div className="lg:hidden">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-6xl text-[#3e2723] uppercase tracking-tighter mb-4 flex items-center justify-center gap-3">
              TASTY
              <div className="flex flex-col gap-1 w-8">
                <span className="w-full h-[2px] bg-[#3e2723]"></span>
                <span className="w-full h-[2px] bg-[#3e2723]"></span>
              </div>
              TALKS
            </h2>
            <p className="font-body text-sm md:text-base text-brown">
               At Filter & Benne, we serve authentic Davangere flavors, daring you to rediscover the true taste of tradition with every bite.
            </p>
          </div>
          <div className="columns-1 sm:columns-2 gap-6">
            {reviewsData.map((review) => (
              <VideoCard key={review.id} review={review} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
