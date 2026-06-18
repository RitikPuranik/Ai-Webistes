import { useEffect, useRef, useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  image?: string;
  tag?: string;
}

const normalizeLabel = (value: string) => {
  const labelMap: Record<string, string> = {
    'Heritage Uttapams': 'Uttapams',
    'Traditional Sweert Finishes': 'Sweet',
    Desserts: 'Sweet',
  };

  return labelMap[value] || value;
};

const normalizeMenuItem = (item: MenuItem): MenuItem => ({
  ...item,
  category: normalizeLabel(item.category),
  tag: item.tag ? normalizeLabel(item.tag) : item.tag,
});

export default function Menu() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = localStorage.getItem('filterbenne_menu');
    return stored ? JSON.parse(stored).map(normalizeMenuItem) : [];
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [adminCategories, setAdminCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem('filterbenne_categories');
    return stored ? JSON.parse(stored) : [];
  });

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

  useEffect(() => {
    const handleStorage = () => {
      const storedMenu = localStorage.getItem('filterbenne_menu');
      if (storedMenu) {
        setMenuItems(JSON.parse(storedMenu).map(normalizeMenuItem));
      } else {
        setMenuItems([]);
      }
      const storedCats = localStorage.getItem('filterbenne_categories');
      if (storedCats) {
        setAdminCategories(JSON.parse(storedCats));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const menuCategories = Array.from(new Set(menuItems.map(item => item.category)));
  const orderedCategories = adminCategories.length > 0
    ? [
        ...adminCategories.filter(category => menuCategories.includes(category)),
        ...menuCategories.filter(category => !adminCategories.includes(category))
      ]
    : menuCategories;
  const categories = ['All', ...orderedCategories];

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
          {menuItems.length === 0 && (
            <div className="border border-charcoal/10 bg-white/70 p-8 text-center">
              <h3 className="font-display text-2xl text-charcoal mb-2">No items added yet</h3>
              <p className="font-body text-sm text-brown">
                Add items from the admin panel to populate this menu.
              </p>
            </div>
          )}
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
