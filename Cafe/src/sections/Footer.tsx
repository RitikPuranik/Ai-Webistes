import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { getSettings } from '@/lib/data';
import { getCafeName, getAddress, getPhone, getEmail, getHours, getInstagram, getFacebook } from '@/lib/settings';
import type { CafeSettings } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [settings, setSettings] = useState<CafeSettings | null>(null);

  useEffect(() => {
    setSettings(getSettings());

    const handleStorage = () => setSettings(getSettings());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.footer-logo',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    ).fromTo(
      '.footer-col',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out' },
      '-=0.5'
    );

    return () => { tl.kill(); };
  }, []);

  const hours = settings?.hours || getHours();
  const cafeName = settings?.cafeName || getCafeName();
  const address = settings?.address || getAddress();
  const phone = settings?.phone || getPhone();
  const email = settings?.email || getEmail();
  const instagram = settings?.social?.instagram || getInstagram();
  const facebook = settings?.social?.facebook || getFacebook();

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels: Record<string, string> = {
    monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
    friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
  };

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative py-20 lg:py-32 overflow-hidden"
      style={{ backgroundColor: '#201502' }}
    >
      {/* Giant Logo */}
      <div className="footer-logo text-center mb-20 opacity-0 overflow-hidden">
        <span
          className="font-display text-cream/[0.06] uppercase tracking-[0.05em] block select-none"
          style={{ fontSize: 'clamp(6rem, 18vw, 20rem)', lineHeight: 0.85 }}
        >
          LINDEN
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* About */}
          <div className="footer-col opacity-0">
            <h4 className="font-body text-xs uppercase tracking-[0.15em] text-sand mb-6">
              {cafeName}
            </h4>
            <p className="font-body text-warmgray text-sm leading-relaxed">
              Artisan coffee and letterpress atelier in the heart of Paris.
              Every cup tells a story.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-warmgray hover:text-saddle transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-warmgray hover:text-saddle transition-colors"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Visit */}
          <div className="footer-col opacity-0">
            <h4 className="font-body text-xs uppercase tracking-[0.15em] text-sand mb-6">
              Visit
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-saddle mt-0.5 flex-shrink-0" />
                <span className="font-body text-warmgray text-sm">{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-saddle flex-shrink-0" />
                <span className="font-body text-warmgray text-sm">{phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-saddle flex-shrink-0" />
                <span className="font-body text-warmgray text-sm">{email}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="footer-col opacity-0">
            <h4 className="font-body text-xs uppercase tracking-[0.15em] text-sand mb-6">
              Hours
            </h4>
            <div className="space-y-2">
              {dayOrder.map((day) => (
                <div key={day} className="flex justify-between">
                  <span className="font-body text-warmgray text-sm">
                    {dayLabels[day]}
                  </span>
                  <span className="font-body text-cream/70 text-sm">
                    {hours[day] || 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col opacity-0">
            <h4 className="font-body text-xs uppercase tracking-[0.15em] text-sand mb-6">
              Navigate
            </h4>
            <div className="space-y-3">
              {['Menu', 'About', 'Reviews', 'Admin'].map((link) => (
                <a
                  key={link}
                  href={link === 'Admin' ? '/admin' : `#${link.toLowerCase()}`}
                  className="block font-body text-warmgray text-sm hover:text-saddle transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-warmgray/50 text-xs">
            &copy; {new Date().getFullYear()} {cafeName}. All rights reserved.
          </p>
          <p className="font-body text-warmgray/50 text-xs">
            Crafted with intention.
          </p>
        </div>
      </div>

      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1616410011236-7a42121dd981?q=80&w=1932&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          mixBlendMode: 'overlay',
        }}
      />
    </footer>
  );
}