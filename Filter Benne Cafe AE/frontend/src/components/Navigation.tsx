import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  scrolled: boolean;
  onAdminToggle?: () => void;
}

export default function Navigation({ scrolled }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!scrolled) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [scrolled]);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Our Story', href: '#about' },
    { label: 'Ambience', href: '#ambience' },
    { label: 'Menu', href: '#menu' },
    { label: 'Specials', href: '#specials' },
    { label: 'Visit', href: '#visit' },
  ];

  const scrollToSection = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hidden && !menuOpen
            ? 'bg-transparent'
            : 'bg-warm-white/95 backdrop-blur-xl shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-4 md:py-5">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }}
            className={`font-body text-xs md:text-sm uppercase tracking-[0.15em] transition-colors duration-300 ${
              hidden && !menuOpen ? 'text-warm-white' : 'text-charcoal'
            }`}
          >
            Filter & Benne
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className={`nav-link font-body text-xs uppercase tracking-[0.08em] transition-colors duration-300 ${
                  hidden && !menuOpen ? 'text-warm-white/80 hover:text-warm-white' : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Location link */}
            <a
              href="https://www.google.com/maps/place/23%C2%B009'58.4%22N+79%C2%B055'47.0%22E/@23.1662292,79.9271401,17z"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:block font-body text-xs uppercase tracking-[0.08em] transition-colors duration-300 ${
                hidden && !menuOpen ? 'text-warm-white/60 hover:text-burnt-orange' : 'text-charcoal/50 hover:text-burnt-orange'
              }`}
            >
              Jabalpur
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden transition-colors duration-300 ${
                hidden && !menuOpen ? 'text-warm-white' : 'text-charcoal'
              }`}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-charcoal transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
              className="font-display text-3xl text-warm-white hover:text-burnt-orange transition-colors"
              style={{
                animation: menuOpen ? `fadeInUp 0.5s ${i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1) both` : 'none',
              }}
            >
              {link.label}
            </a>
          ))}

          <div className="mt-8 pt-8 border-t border-white/10">
            <a
              href="https://www.instagram.com/filterbenne/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs uppercase tracking-[0.15em] text-warm-white/50 hover:text-burnt-orange transition-colors"
            >
              @filterbenne
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
