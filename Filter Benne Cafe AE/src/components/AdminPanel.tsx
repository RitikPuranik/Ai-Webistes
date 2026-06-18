import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Lock, Coffee, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  image?: string;
  tag?: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

const defaultCategories = ['Signature', 'Benne Dosas', 'Uttapams', 'Rice', 'Idli', 'Vada', 'Beverages', 'Sweet', 'Breakfast Special'];

const orderCategories = (categoryList: string[]) => {
  return Array.from(new Set(categoryList));
};

const categoryDefaultImages: Record<string, string> = {
  Signature: '/assets/rec_ghee_podi_dosa.jpg',
  Idli: '/assets/rec_thatte_idli.jpg',
  Dosa: '/assets/rec_ghee_podi_dosa.jpg',
  'Benne Dosas': '/assets/rec_ghee_podi_dosa.jpg',
  Uttapams: '/assets/food_spread.png',
  Vada: '/assets/food_spread.png',
  Beverages: '/assets/food_spread.png',
  Rice: '/assets/rec_bisi_bele_bhath.jpg',
  Sweet: '/assets/rec_kesari_baat.jpg',
};

const getDefaultImageForCategory = (category: string) => {
  return categoryDefaultImages[category] || '/assets/food_spread.png';
};

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = localStorage.getItem('filterbenne_menu');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [formData, setFormData] = useState<Pick<MenuItem, 'name' | 'price' | 'category'>>({
    name: '',
    price: '',
    category: 'Signature',
  });

  const [activeTab, setActiveTab] = useState<'add-item' | 'categories'>('categories');
  const [categories, setCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem('filterbenne_categories');
    return stored ? orderCategories(JSON.parse(stored)) : defaultCategories;
  });
  const [newCategory, setNewCategory] = useState('');
  const orderedCategories = orderCategories(categories);

  // Save menu items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('filterbenne_menu', JSON.stringify(menuItems));
    window.dispatchEvent(new StorageEvent('storage', { key: 'filterbenne_menu' }));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('filterbenne_categories', JSON.stringify(orderCategories(categories)));
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

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: MenuItem = {
      id: Date.now().toString(),
      ...formData,
      image: getDefaultImageForCategory(formData.category),
    };
    setMenuItems(prev => [...prev, newItem]);
    
    setFormData({
      name: '',
      price: '',
      category: categories[0] || 'Benne Dosas',
    });
    toast.success('Menu item added', {
      description: `${newItem.name} is now live in ${newItem.category}.`,
    });
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = menuItems.find(item => item.id === id);
    if (!itemToDelete) return;

    toast.warning('Remove this menu item?', {
      description: `${itemToDelete.name} will be permanently removed.`,
      duration: 9000,
      action: {
        label: 'Delete',
        onClick: () => {
          setMenuItems(prev => prev.filter(item => item.id !== id));
          toast.success('Item removed');
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const addedCategory = newCategory.trim();
      setCategories(prev => orderCategories([...prev, addedCategory]));
      toast.success('Category added', {
        description: `${addedCategory} is now available in the item form.`,
      });
      setNewCategory('');
      return;
    }

    if (!newCategory.trim()) {
      toast.error('Category name is required');
      return;
    }

    toast.info('Category already exists', {
      description: 'Try a different name.',
    });
  };

  const handleDeleteCategory = (cat: string) => {
    const categoryItems = menuItems.filter(item => item.category === cat);

    if (categoryItems.length > 0) {
      toast.error('Delete all items first', {
        description: `${cat} still has ${categoryItems.length} item${categoryItems.length === 1 ? '' : 's'} in it. Remove those items before deleting the category.`,
      });
      return;
    }

    toast.warning('Delete this category?', {
      description: 'This category is empty and can be removed now.',
      duration: 9000,
      action: {
        label: 'Delete',
        onClick: () => {
          setCategories(prev => orderCategories(prev.filter(c => c !== cat)));
          toast.success('Category deleted', {
            description: `${cat} has been removed from filters.`,
          });
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const handleMoveCategoryUp = (index: number) => {
    if (index > 0) {
      setCategories(prev => {
        const newCats = [...prev];
        [newCats[index - 1], newCats[index]] = [newCats[index], newCats[index - 1]];
        return orderCategories(newCats);
      });
    }
  };

  const handleMoveCategoryDown = (index: number) => {
    if (index < categories.length - 1) {
      setCategories(prev => {
        const newCats = [...prev];
        [newCats[index + 1], newCats[index]] = [newCats[index], newCats[index + 1]];
        return orderCategories(newCats);
      });
    }
  };

  const handleMoveItemUp = (itemId: string) => {
    setMenuItems(prev => {
      const index = prev.findIndex(item => item.id === itemId);
      if (index === -1) return prev;
      const item = prev[index];
      
      let prevSameCategoryIndex = -1;
      for (let i = index - 1; i >= 0; i--) {
        if (prev[i].category === item.category) {
          prevSameCategoryIndex = i;
          break;
        }
      }

      if (prevSameCategoryIndex !== -1) {
        const newItems = [...prev];
        [newItems[prevSameCategoryIndex], newItems[index]] = [newItems[index], newItems[prevSameCategoryIndex]];
        return newItems;
      }
      return prev;
    });
  };

  const handleMoveItemDown = (itemId: string) => {
    setMenuItems(prev => {
      const index = prev.findIndex(item => item.id === itemId);
      if (index === -1) return prev;
      const item = prev[index];
      
      let nextSameCategoryIndex = -1;
      for (let i = index + 1; i < prev.length; i++) {
        if (prev[i].category === item.category) {
          nextSameCategoryIndex = i;
          break;
        }
      }

      if (nextSameCategoryIndex !== -1) {
        const newItems = [...prev];
        [newItems[nextSameCategoryIndex], newItems[index]] = [newItems[index], newItems[nextSameCategoryIndex]];
        return newItems;
      }
      return prev;
    });
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
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-body text-xs uppercase tracking-[0.08em] transition-colors ${
              activeTab === 'categories'
                ? 'text-burnt-orange border-b-2 border-burnt-orange'
                : 'text-brown hover:text-charcoal'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('add-item')}
            className={`px-6 py-3 font-body text-xs uppercase tracking-[0.08em] transition-colors ${
              activeTab === 'add-item'
                ? 'text-burnt-orange border-b-2 border-burnt-orange'
                : 'text-brown hover:text-charcoal'
            }`}
          >
            Add Items
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'add-item' ? (
            <>
              {/* Add Form */}
                <form
                  onSubmit={handleSaveItem}
                  className="bg-white p-6 mb-6 border border-charcoal/10"
                >
                  <h3 className="font-body text-sm uppercase tracking-[0.08em] text-charcoal mb-4">
                    New Item
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
                        {orderedCategories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-charcoal text-warm-white font-body text-xs uppercase tracking-[0.08em] px-6 py-3 hover:bg-burnt-orange transition-colors"
                    >
                      <Save size={14} />
                      Save Item
                    </button>
                  </div>
                </form>
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
                {categories.map((cat, index) => (
                  <div
                    key={cat}
                    className="flex flex-col p-4 bg-white border border-charcoal/5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-charcoal">{cat}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveCategoryUp(index)}
                          disabled={index === 0}
                          className={`w-8 h-8 flex items-center justify-center transition-colors ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-charcoal/10'}`}
                        >
                          <ArrowUp size={14} className="text-charcoal" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCategoryDown(index)}
                          disabled={index === categories.length - 1}
                          className={`w-8 h-8 flex items-center justify-center transition-colors ${index === categories.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-charcoal/10'}`}
                        >
                          <ArrowDown size={14} className="text-charcoal" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-red-50 transition-colors ml-2"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    {(() => {
                      const categoryItems = menuItems.filter(item => item.category === cat);
                      if (categoryItems.length === 0) return null;
                      return (
                        <div className="mt-4 pt-3 border-t border-charcoal/10 space-y-2">
                          {categoryItems.map((item, itemIndex) => (
                            <div key={item.id} className="flex items-center justify-between bg-warm-white p-2 border border-charcoal/5">
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="font-body text-xs text-charcoal font-medium block">{item.name}</span>
                                  <span className="font-body text-[10px] text-burnt-orange block">{item.price}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveItemUp(item.id)}
                                  disabled={itemIndex === 0}
                                  className={`w-6 h-6 flex items-center justify-center transition-colors ${itemIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-charcoal/10'}`}
                                  title="Move Up"
                                >
                                  <ArrowUp size={12} className="text-charcoal" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveItemDown(item.id)}
                                  disabled={itemIndex === categoryItems.length - 1}
                                  className={`w-6 h-6 flex items-center justify-center transition-colors ${itemIndex === categoryItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-charcoal/10'}`}
                                  title="Move Down"
                                >
                                  <ArrowDown size={12} className="text-charcoal" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-red-50 transition-colors ml-1"
                                  title="Remove item"
                                >
                                  <X size={12} className="text-red-500" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-sand/30">
                <p className="font-body text-xs text-brown">
                  <strong>Note:</strong> Delete all items in a category first. Empty categories can then be removed.
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
