import { useEffect, useRef, useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  tag?: string;
}

const defaultMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Benne Masala Dosa',
    description: 'Crispy dosa roasted in pure ghee, stuffed with spiced potato filling',
    price: '\u20b9185',
    category: 'Signature',
    image: '/assets/rec_ghee_podi_dosa.jpg',
    tag: 'Bestseller',
  },
  {
    id: '2',
    name: 'Thatte Idli',
    description: 'Flat, pillowy idli served with sambar and chutney — "omg too good"',
    price: '\u20b995',
    category: 'Idli',
    image: '/assets/rec_thatte_idli.jpg',
    tag: 'Must Try',
  },
  {
    id: '3',
    name: 'Traditional Filter Coffee',
    description: 'Authentic South Indian filter coffee, decoction brewed to perfection',
    price: '\u20b985',
    category: 'Beverages',
    image: '/assets/food_spread.png',
    tag: 'Popular',
  },
  {
    id: '4',
    name: 'Bisi Bele Bhath',
    description: 'A wholesome rice dish cooked with lentils, vegetables and spices',
    price: '\u20b9145',
    category: 'Rice',
    image: '/assets/rec_bisi_bele_bhath.jpg',
    tag: 'New',
  },
  {
    id: '5',
    name: 'Kesari Baat',
    description: 'Sweet semolina pudding garnished with cashews and coconut',
    price: '\u20b9120',
    category: 'Desserts',
    image: '/assets/rec_kesari_baat.jpg',
    tag: 'Sweet',
  },
  {
    id: '6',
    name: 'Baby Podi Idli',
    description: 'Mini idlis tossed in spicy gunpowder masala with ghee tadka',
    price: '\u20b9115',
    category: 'Idli',
    image: '/assets/rec_baby_podi_idli.jpg',
    tag: 'Loved it',
  },
];

export default function Menu() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = localStorage.getItem('filterbenne_menu');
    return stored ? JSON.parse(stored) : defaultMenuItems;
  });
  const [activeCategory, setActiveCategory] = useState('All');

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Listen for menu updates from admin panel
  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('filterbenne_menu');
      if (stored) {
        setMenuItems(JSON.parse(stored));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="bg-warm-white py-24 md:py-40 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="font-body text-[11px] uppercase tracking-[0.12em] text-burnt-orange mb-4">
            The Collection
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.1] mb-4">
            Signature Offerings
          </h2>
          <p className="font-body text-sm text-brown max-w-xl mx-auto">
            Carefully curated flavors that define our craft — each dish tells a story of tradition,
            patience, and the golden touch of benne.
          </p>
        </div>

        {/* Category Filters */}
        <div
          className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-body text-[11px] uppercase tracking-[0.08em] px-5 py-2 transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-charcoal text-warm-white'
                  : 'bg-transparent text-brown border border-charcoal/20 hover:border-burnt-orange hover:text-burnt-orange'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="max-w-4xl mx-auto">
          {(activeCategory === 'All' ? categories.filter(c => c !== 'All') : [activeCategory]).map((category, catIndex) => {
            const categoryItems = menuItems.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div 
                key={category} 
                className={`mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${catIndex * 0.1 + 0.3}s` }}
              >
                <h3 className="font-display text-2xl text-charcoal tracking-widest uppercase mb-4 pl-1">
                  {category}
                </h3>
                <div className="w-full h-[1px] bg-charcoal mb-8"></div>
                <div className="flex flex-col space-y-6">
                  {categoryItems.map(item => (
                    <div key={item.id} className="flex flex-col">
                      <div className="flex justify-between items-baseline gap-4 w-full">
                        <h4 className="font-body text-lg text-charcoal shrink-0">{item.name}</h4>
                        <div className="flex-grow border-b-2 border-dotted border-charcoal/30 shrink relative" style={{ top: '-4px' }}></div>
                        <span className="font-body text-lg text-charcoal font-medium shrink-0">{item.price}</span>
                      </div>
                      {item.description && (
                        <p className="font-body text-sm text-brown mt-1 max-w-2xl">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
