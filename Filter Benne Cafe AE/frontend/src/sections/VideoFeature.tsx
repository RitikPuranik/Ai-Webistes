import { useEffect, useRef, useState } from 'react';
import { Play, MapPin, Clock, Phone } from 'lucide-react';

export default function VideoFeature() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          videoRef.current?.play();
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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section ref={sectionRef} className="bg-warm-white">
      {/* Video and Image Split Section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left - Video */}
        <div
          className={`relative aspect-square lg:aspect-auto lg:h-[70vh] transition-all duration-1200 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/assets/video1_noaudio.mp4" type="video/mp4" />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center px-6">
              <h2
                className={`font-display text-3xl md:text-5xl text-warm-white mb-6 leading-tight transition-all duration-1000 delay-300 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}
              >
                The Ritual of
                <br />
                <span className="italic">Filter Coffee</span>
              </h2>

              <button
                onClick={togglePlay}
                className={`inline-flex items-center gap-3 border border-warm-white/40 text-warm-white px-8 py-3 font-body text-xs uppercase tracking-[0.08em] hover:bg-warm-white hover:text-charcoal transition-all duration-300 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '0.5s' }}
              >
                <Play size={14} />
                {isPlaying ? 'Pause' : 'Watch Our Story'}
              </button>
            </div>
          </div>
        </div>

        {/* Right - Food Collage */}
        <div
          className={`relative aspect-square lg:aspect-auto lg:h-[70vh] transition-all duration-1200 delay-300 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}
        >
          <img
            src="/assets/food_collage.jpg"
            alt="A spread of delicious South Indian dishes"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 flex items-center justify-center">
            <div className="text-center">
              <p className="font-display text-3xl md:text-5xl text-warm-white mb-2" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>10/10</p>
              <p className="font-body text-[11px] uppercase tracking-[0.15em] text-warm-white/90" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Rated by our guests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Info Section */}
      <div
        id="visit"
        className="py-24 md:py-40 px-6 md:px-12 lg:px-24"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left - Info */}
            <div
              className={`transition-all duration-1000 ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <p className="font-body text-[11px] uppercase tracking-[0.12em] text-burnt-orange mb-4">
                Visit Us
              </p>
              
              <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-[1.1] mb-8">
                Come Say
                <br />
                <span className="italic">Hello</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-burnt-orange mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm text-charcoal font-medium mb-1">Address</p>
                    <p className="font-body text-sm text-brown">
                      5W8H+FVW, Napier Town
                      <br />
                      Jabalpur, Madhya Pradesh 482001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock size={18} className="text-burnt-orange mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm text-charcoal font-medium mb-1">Hours</p>
                    <p className="font-body text-sm text-brown">
                      Monday - Sunday
                      <br />
                      9:30 AM - 9:30 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone size={18} className="text-burnt-orange mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm text-charcoal font-medium mb-1">Contact</p>
                    <p className="font-body text-sm text-brown">
                      +91 7489501812
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="https://www.google.com/maps/place/23%C2%B009'58.4%22N+79%C2%B055'47.0%22E/@23.1662292,79.9271401,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.08em] bg-charcoal text-warm-white px-8 py-4 hover:bg-burnt-orange transition-colors duration-300"
                >
                  <MapPin size={14} />
                  Get Directions
                </a>
                
                <a
                  href="https://www.instagram.com/filterbenne/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.08em] border border-charcoal text-charcoal px-8 py-4 hover:bg-charcoal hover:text-warm-white transition-colors duration-300"
                >
                  Follow on Instagram
                </a>
              </div>
            </div>

            {/* Right - Cafe Exterior Image */}
            <div
              className={`relative transition-all duration-1000 delay-200 ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src="/assets/cafe_exterior.jpg"
                  alt="Filter & Benne cafe exterior at night"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 bg-warm-white/95 backdrop-blur-sm p-4">
                  <p className="font-body text-[10px] uppercase tracking-[0.1em] text-brown mb-1">
                    Location
                  </p>
                  <p className="font-display text-lg text-charcoal">
                    Jabalpur, MP
                  </p>
                </div>
              </div>

              {/* Second video thumbnail */}
              <div className="absolute -bottom-8 -right-4 md:-right-8 w-40 md:w-56 aspect-[9/16] overflow-hidden shadow-2xl border-4 border-warm-white">
                <video
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                >
                  <source src="/assets/video2_noaudio.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
