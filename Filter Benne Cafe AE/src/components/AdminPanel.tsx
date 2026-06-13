import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Save, Lock, Coffee } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  tag?: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

const defaultCategories = ['Signature', 'Idli', 'Dosa', 'Beverages', 'Rice', 'Desserts'];

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
    description: 'Flat, pillowy idli served with sambar and chutney',
    price: '\u20b995',
    category: 'Idli',
    image: '/assets/rec_thatte_idli.jpg',
    tag: 'Must Try',
  },
  {
    id: '3',
    name: 'Traditional Filter Coffee',
    description: 'Authentic South Indian filter coffee',
    price: '\u20b985',
    category: 'Beverages',
    image: '/assets/food_spread.png',
    tag: 'Popular',
  },
  {
    id: '4',
    name: 'Bisi Bele Bhath',
    description: 'Wholesome rice dish with lentils and vegetables',
    price: '\u20b9145',
    category: 'Rice',
    image: '/assets/rec_bisi_bele_bhath.jpg',
    tag: 'New',
  },
  {
    id: '5',
    name: 'Kesari Baat',
    description: 'Sweet semolina pudding with cashews',
    price: '\u20b9120',
    category: 'Desserts',
    image: '/assets/rec_kesari_baat.jpg',
    tag: 'Sweet',
  },
  {
    id: '6',
    name: 'Baby Podi Idli',
    description: 'Mini idlis tossed in spicy gunpowder masala',
    price: '\u20b9115',
    category: 'Idli',
    image: '/assets/rec_baby_podi_idli.jpg',
    tag: 'Loved it',
  },
];

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = localStorage.getItem('filterbenne_menu');
    return stored ? JSON.parse(stored) : defaultMenuItems;
  });
  
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: '',
    category: 'Signature',
    image: '/assets/food_spread.png',
    tag: '',
  });

  const [activeTab, setActiveTab] = useState<'menu' | 'categories'>('menu');
  const [categories, setCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem('filterbenne_categories');
    return stored ? JSON.parse(stored) : defaultCategories;
  });
  const [newCategory, setNewCategory] = useState('');

  // Save menu items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('filterbenne_menu', JSON.stringify(menuItems));
    window.dispatchEvent(new StorageEvent('storage', { key: 'filterbenne_menu' }));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('filterbenne_categories', JSON.stringify(categories));
  }, [categories]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    // Simple password - in real app this would be server-side
    if (password === correctPassword) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid password.');
    }
  };

  const handleAddItem = () => {
    setIsAdding(true);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: categories[0] || 'Signature',
      image: '/assets/food_spread.png',
      tag: '',
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsAdding(false);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      tag: item.tag || '',
    });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setMenuItems(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData }
            : item
        )
      );
      setEditingItem(null);
    } else if (isAdding) {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData,
      };
      setMenuItems(prev => [...prev, newItem]);
      setIsAdding(false);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    if (confirm('Delete this category? Items in this category will remain but show without a category.')) {
      setCategories(prev => prev.filter(c => c !== cat));
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-warm-white w-full max-w-md p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-warm-white" />
            </div>
            <h2 className="font-display text-2xl text-charcoal mb-2">Admin Login</h2>
            <p className="font-body text-xs text-brown">Filter & Benne Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-body text-[11px] uppercase tracking-[0.08em] text-charcoal mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                placeholder="Enter password"
                className="w-full border border-charcoal/20 px-4 py-3 font-body text-sm bg-transparent focus:border-burnt-orange transition-colors"
              />
            </div>
            
            {loginError && (
              <p className="font-body text-xs text-red-600">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-charcoal text-warm-white font-body text-xs uppercase tracking-[0.08em] py-4 hover:bg-burnt-orange transition-colors duration-300"
            >
              Login
            </button>
          </form>

          <button
            onClick={onClose}
            className="w-full mt-4 font-body text-xs text-brown hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-warm-white w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col admin-panel-enter">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-charcoal/10">
          <div className="flex items-center gap-3">
            <Coffee size={20} className="text-burnt-orange" />
            <h2 className="font-display text-xl text-charcoal">Menu Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-charcoal/10 transition-colors"
          >
            <X size={18} className="text-charcoal" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-charcoal/10">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 font-body text-xs uppercase tracking-[0.08em] transition-colors ${
              activeTab === 'menu'
                ? 'text-burnt-orange border-b-2 border-burnt-orange'
                : 'text-brown hover:text-charcoal'
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-body text-xs uppercase tracking-[0.08em] transition-colors ${
              activeTab === 'categories'
                ? 'text-burnt-orange border-b-2 border-burnt-orange'
                : 'text-brown hover:text-charcoal'
            }`}
          >
            Categories
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'menu' ? (
            <>
              {/* Action Bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="font-body text-sm text-brown">
                  {menuItems.length} items in menu
                </p>
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-2 bg-burnt-orange text-warm-white font-body text-xs uppercase tracking-[0.08em] px-5 py-3 hover:bg-charcoal transition-colors"
                >
                  <Plus size={14} />
                  Add Item
                </button>
              </div>

              {/* Add/Edit Form */}
              {(isAdding || editingItem) && (
                <form
                  onSubmit={handleSaveItem}
                  className="bg-white p-6 mb-6 border border-charcoal/10"
                >
                  <h3 className="font-body text-sm uppercase tracking-[0.08em] text-charcoal mb-4">
                    {editingItem ? 'Edit Item' : 'New Item'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-body text-[10px] uppercase tracking-[0.08em] text-brown mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full border border-charcoal/20 px-3 py-2 font-body text-sm bg-transparent focus:border-burnt-orange transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-body text-[10px] uppercase tracking-[0.08em] text-brown mb-1">
                        Price *
                      </label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        required
                        placeholder="₹100"
                        className="w-full border border-charcoal/20 px-3 py-2 font-body text-sm bg-transparent focus:border-burnt-orange transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-body text-[10px] uppercase tracking-[0.08em] text-brown mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-charcoal/20 px-3 py-2 font-body text-sm bg-transparent focus:border-burnt-orange transition-colors"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-body text-[10px] uppercase tracking-[0.08em] text-brown mb-1">
                        Tag
                      </label>
                      <input
                        type="text"
                        value={formData.tag}
                        onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                        placeholder="e.g. Bestseller"
                        className="w-full border border-charcoal/20 px-3 py-2 font-body text-sm bg-transparent focus:border-burnt-orange transition-colors"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block font-body text-[10px] uppercase tracking-[0.08em] text-brown mb-1">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        required
                        rows={2}
                        className="w-full border border-charcoal/20 px-3 py-2 font-body text-sm bg-transparent focus:border-burnt-orange transition-colors resize-none"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block font-body text-[10px] uppercase tracking-[0.08em] text-brown mb-1">
                        Image Path
                      </label>
                      <select
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full border border-charcoal/20 px-3 py-2 font-body text-sm bg-transparent focus:border-burnt-orange transition-colors"
                      >
                        <option value="/assets/food_spread.png">Food Spread</option>
                        <option value="/assets/rec_ghee_podi_dosa.jpg">Ghee Podi Dosa</option>
                        <option value="/assets/rec_thatte_idli.jpg">Thatte Idli</option>
                        <option value="/assets/rec_bisi_bele_bhath.jpg">Bisi Bele Bhath</option>
                        <option value="/assets/rec_kesari_baat.jpg">Kesari Baat</option>
                        <option value="/assets/rec_baby_podi_idli.jpg">Baby Podi Idli</option>
                        <option value="/assets/food_collage.jpg">Food Collage</option>
                        <option value="/assets/cafe_exterior.jpg">Cafe Exterior</option>
                        <option value="/assets/ambience_mural.png">Ambience Mural</option>
                        <option value="/assets/ambience_interior.jpg">Ambience Interior</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-charcoal text-warm-white font-body text-xs uppercase tracking-[0.08em] px-6 py-3 hover:bg-burnt-orange transition-colors"
                    >
                      <Save size={14} />
                      {editingItem ? 'Update' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="font-body text-xs uppercase tracking-[0.08em] text-brown px-6 py-3 border border-charcoal/20 hover:bg-charcoal/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Items List */}
              <div className="space-y-3">
                {menuItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-white border border-charcoal/5 hover:border-charcoal/20 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-body text-sm font-medium text-charcoal truncate">
                          {item.name}
                        </h4>
                        {item.tag && (
                          <span className="flex-shrink-0 font-body text-[9px] uppercase tracking-[0.06em] bg-burnt-orange/10 text-burnt-orange px-2 py-0.5">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="font-body text-xs text-brown truncate">{item.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-body text-xs text-burnt-orange font-medium">
                          {item.price}
                        </span>
                        <span className="font-body text-[10px] text-brown/50">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-charcoal/10 transition-colors"
                      >
                        <Edit2 size={14} className="text-brown" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Categories Tab */
            <>
              <form onSubmit={handleAddCategory} className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 border border-charcoal/20 px-4 py-3 font-body text-sm bg-transparent focus:border-burnt-orange transition-colors"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-charcoal text-warm-white font-body text-xs uppercase tracking-[0.08em] px-6 py-3 hover:bg-burnt-orange transition-colors"
                >
                  <Plus size={14} />
                  Add
                </button>
              </form>

              <div className="space-y-2">
                {categories.map(cat => (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-4 bg-white border border-charcoal/5"
                  >
                    <span className="font-body text-sm text-charcoal">{cat}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-sand/30">
                <p className="font-body text-xs text-brown">
                  <strong>Note:</strong> Deleting a category will not delete menu items in that category. 
                  They will still be visible but without a category filter.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-charcoal/10 flex items-center justify-between">
          <p className="font-body text-[10px] text-brown">
            Press Ctrl+A to toggle this panel
          </p>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="font-body text-[11px] uppercase tracking-[0.08em] text-brown hover:text-charcoal transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
