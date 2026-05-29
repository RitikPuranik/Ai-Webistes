import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

const navLinks = [
  { label: 'Shop', href: '#menu' },
  { label: 'Menu', href: '#offerings' },
  { label: 'About', href: '#philosophy' },
  { label: 'Visit', href: '#footer' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdmin]);

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        '.mobile-nav-link',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [menuOpen]);

  const scrollToSection = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isAdmin) return null;

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(32, 21, 2, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
          <Link to="/" className="font-body text-cream text-sm font-medium uppercase tracking-[0.1em]">
            LINDEN
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="font-body text-xs uppercase tracking-[0.05em] text-cream/70 hover:text-cream transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/admin"
              className="font-body text-xs uppercase tracking-[0.05em] text-cream/50 hover:text-cream transition-colors duration-300"
            >
              Admin
            </Link>
            <button
              onClick={() => scrollToSection('#footer')}
              className="font-body text-xs uppercase tracking-[0.05em] px-4 py-2 rounded bg-saddle text-cream hover:bg-saddle/90 transition-colors duration-300"
            >
              Reserve
            </button>
          </div>

          <button
            className="md:hidden text-cream"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-charcoal/98 flex flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="mobile-nav-link font-display text-cream text-3xl opacity-0 hover:text-saddle transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="mobile-nav-link font-display text-cream/50 text-xl opacity-0 hover:text-saddle transition-colors mt-4"
          >
            Admin Panel
          </Link>
        </div>
      )}
    </>
  );
}