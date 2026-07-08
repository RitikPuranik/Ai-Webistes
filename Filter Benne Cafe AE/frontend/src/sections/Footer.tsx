import { useEffect, useRef, useState } from 'react';
import { Instagram, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Subscribed successfully', {
      description: 'Thank you for joining. We will keep you updated on dishes and events.',
    });
    setEmail('');
  };

  return (
    <footer ref={footerRef} className="bg-charcoal text-warm-white py-20 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div
            className={`transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="font-display text-2xl text-warm-white mb-4">
              Filter & Benne
            </h3>
            <p className="font-body text-[13px] text-warm-white/50 leading-relaxed mb-6">
              Coffee, culture, and the craft of benne. Rooted in Jabalpur, inspired by the South.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/filterbenne/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-warm-white/20 flex items-center justify-center hover:bg-burnt-orange hover:border-burnt-orange transition-all duration-300"
              >
                <Instagram size={16} />
              </a>
          
              <a
                href="mailto:hello@filterandbenne.com"
                className="w-10 h-10 border border-warm-white/20 flex items-center justify-center hover:bg-burnt-orange hover:border-burnt-orange transition-all duration-300"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Navigate Column */}
          <div
            className={`transition-all duration-700 delay-100 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="font-body text-[11px] uppercase tracking-[0.12em] text-warm-white/40 mb-6">
              Navigate
            </p>
            <ul className="space-y-3">
              {['Home', 'Our Story', 'Ambience', 'Menu', 'Specials', 'Contact'].map(link => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '')}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const id = link === 'Home' ? '#hero' : 
                                 link === 'Our Story' ? '#about' :
                                 link === 'Specials' ? '#specials' :
                                 `#${link.toLowerCase()}`;
                      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="font-body text-[13px] text-warm-white/60 hover:text-warm-white transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Column */}
          <div
            className={`transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="font-body text-[11px] uppercase tracking-[0.12em] text-warm-white/40 mb-6">
              Visit
            </p>
            <div className="space-y-4">
              <p className="font-body text-[13px] text-warm-white/60 leading-relaxed">
                5W8H+FVW, Napier Town
                <br />
                Jabalpur, Madhya Pradesh
                <br />
                482001
              </p>
              <p className="font-body text-[13px] text-warm-white/60">
                Monday - Sunday: 9:30 AM - 9:30 PM
              </p>
              <p className="font-body text-[13px] text-warm-white/60">
                +91 7489501812
              </p>
            </div>
          </div>

          {/* Connect Column */}
          <div
            className={`transition-all duration-700 delay-300 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="font-body text-[11px] uppercase tracking-[0.12em] text-warm-white/40 mb-6">
              Stay Connected
            </p>
            <p className="font-body text-[13px] text-warm-white/60 leading-relaxed mb-4">
              Subscribe for updates on new dishes, special events, and coffee stories.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 bg-transparent border border-warm-white/20 px-4 py-3 font-body text-xs text-warm-white placeholder:text-warm-white/30 focus:border-burnt-orange transition-colors"
              />
              <button
                type="submit"
                className="bg-burnt-orange border border-burnt-orange px-4 hover:bg-warm-white hover:text-charcoal transition-colors duration-300"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-16 pt-6 border-t border-warm-white/10 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-700 delay-400 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-body text-[11px] text-warm-white/30 tracking-[0.05em]">
            &copy; {new Date().getFullYear()} Filter & Benne. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-[11px] text-warm-white/30 hover:text-warm-white/60 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-body text-[11px] text-warm-white/30 hover:text-warm-white/60 transition-colors">
              Terms
            </a>
          </div>
        </div>

        {/* Instagram Handle */}
        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/filterbenne/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-warm-white/30 hover:text-burnt-orange transition-colors duration-300"
          >
            <Instagram size={14} />
            @filterbenne
          </a>
        </div>
      </div>
    </footer>
  );
}
