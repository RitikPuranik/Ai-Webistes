import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, Save, Lock, Coffee, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  login,
  clearToken,
  isAuthenticated,
  getCategories,
  addCategory,
  deleteCategory,
  reorderCategories,
  getMenuItems,
  addMenuItem,
  deleteMenuItem,
  reorderMenuItems,
  type ApiCategory,
  type ApiMenuItem,
} from '@/lib/api';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [menuItems, setMenuItems] = useState<ApiMenuItem[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
  });

  const [activeTab, setActiveTab] = useState<'add-item' | 'categories'>('categories');
  const [newCategory, setNewCategory] = useState('');

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      const [cats, items] = await Promise.all([getCategories(), getMenuItems()]);
      setCategories(cats);
      setMenuItems(items);
      // Set default category in form
      if (cats.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: cats[0]._id }));
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

  // Dispatch a custom event so Menu.tsx can refresh
  const notifyMenuUpdate = () => {
    window.dispatchEvent(new CustomEvent('menu-updated'));
  };

  const handleMigrateLocalStorage = async () => {
    try {
      setLoading(true);
      const storedCategories = localStorage.getItem('filterbenne_categories');
      const storedMenu = localStorage.getItem('filterbenne_menu');

      let currentCats = [...categories];

      if (storedCategories) {
        const catNames = JSON.parse(storedCategories) as string[];
        for (const name of catNames) {
          if (!currentCats.find(c => c.name === name)) {
            const newCat = await addCategory(name);
            currentCats.push(newCat);
          }
        }
      }

      if (storedMenu) {
        const items = JSON.parse(storedMenu);
        for (const item of items) {
          // Find category ID
          const cat = currentCats.find(c => c.name === item.category);
          if (cat && !menuItems.find(m => m.name === item.name)) {
            const newItem = await addMenuItem({
              name: item.name,
              price: item.price,
              categoryId: cat._id,
            });
            setMenuItems(prev => [...prev, newItem]);
          }
        }
      }

      toast.success('Migration complete', {
        description: 'Local storage data has been uploaded to the database.',
      });
      fetchData();
      notifyMenuUpdate();
      localStorage.removeItem('filterbenne_menu'); // Clear after migration
      localStorage.removeItem('filterbenne_categories');
    } catch (error) {
      console.error(error);
      toast.error('Migration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(password);
      setIsLoggedIn(true);
      setLoginError('');
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Invalid password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    setPassword('');
  };

  // ─── Menu Item Handlers ──────────────────────────────────────────

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newItem = await addMenuItem({
        name: formData.name,
        price: formData.price,
        categoryId: formData.categoryId,
      });
      setMenuItems(prev => [...prev, newItem]);
      setFormData(prev => ({
        name: '',
        price: '',
        categoryId: prev.categoryId,
      }));
      toast.success('Menu item added', {
        description: `${newItem.name} is now live in ${newItem.category}.`,
      });
      notifyMenuUpdate();
    } catch (err: unknown) {
      toast.error('Failed to add item', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = menuItems.find(item => item._id === id);
    if (!itemToDelete) return;

    toast.warning('Remove this menu item?', {
      description: `${itemToDelete.name} will be permanently removed.`,
      duration: 9000,
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await deleteMenuItem(id);
            setMenuItems(prev => prev.filter(item => item._id !== id));
            toast.success('Item removed');
            notifyMenuUpdate();
          } catch (err: unknown) {
            toast.error('Failed to delete', {
              description: err instanceof Error ? err.message : 'Unknown error',
            });
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const handleMoveItemUp = async (itemId: string, categoryName: string) => {
    const categoryItems = menuItems.filter(item => item.category === categoryName);
    const index = categoryItems.findIndex(item => item._id === itemId);
    if (index <= 0) return;

    const newCategoryItems = [...categoryItems];
    [newCategoryItems[index - 1], newCategoryItems[index]] = [newCategoryItems[index], newCategoryItems[index - 1]];

    // Update local state immediately
    const newMenuItems = menuItems.map(item => {
      const newIndex = newCategoryItems.findIndex(ci => ci._id === item._id);
      if (newIndex !== -1) {
        return { ...item, sortOrder: newIndex };
      }
      return item;
    });
    setMenuItems(newMenuItems);

    try {
      await reorderMenuItems(newCategoryItems.map(item => item._id));
      notifyMenuUpdate();
    } catch (err) {
      console.error('Reorder failed:', err);
      fetchData(); // Rollback on error
    }
  };

  const handleMoveItemDown = async (itemId: string, categoryName: string) => {
    const categoryItems = menuItems.filter(item => item.category === categoryName);
    const index = categoryItems.findIndex(item => item._id === itemId);
    if (index === -1 || index >= categoryItems.length - 1) return;

    const newCategoryItems = [...categoryItems];
    [newCategoryItems[index + 1], newCategoryItems[index]] = [newCategoryItems[index], newCategoryItems[index + 1]];

    // Update local state immediately
    const newMenuItems = menuItems.map(item => {
      const newIndex = newCategoryItems.findIndex(ci => ci._id === item._id);
      if (newIndex !== -1) {
        return { ...item, sortOrder: newIndex };
      }
      return item;
    });
    setMenuItems(newMenuItems);

    try {
      await reorderMenuItems(newCategoryItems.map(item => item._id));
      notifyMenuUpdate();
    } catch (err) {
      console.error('Reorder failed:', err);
      fetchData(); // Rollback on error
    }
  };

  // ─── Category Handlers ───────────────────────────────────────────

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const cat = await addCategory(newCategory.trim());
      setCategories(prev => [...prev, cat]);
      toast.success('Category added', {
        description: `${cat.name} is now available in the item form.`,
      });
      setNewCategory('');
      notifyMenuUpdate();
    } catch (err: unknown) {
      toast.error('Failed to add category', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  const handleDeleteCategory = (cat: ApiCategory) => {
    const categoryItems = menuItems.filter(item => item.category === cat.name);

    if (categoryItems.length > 0) {
      toast.error('Delete all items first', {
        description: `${cat.name} still has ${categoryItems.length} item${categoryItems.length === 1 ? '' : 's'} in it. Remove those items before deleting the category.`,
      });
      return;
    }

    toast.warning('Delete this category?', {
      description: 'This category is empty and can be removed now.',
      duration: 9000,
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await deleteCategory(cat._id);
            setCategories(prev => prev.filter(c => c._id !== cat._id));
            toast.success('Category deleted', {
              description: `${cat.name} has been removed from filters.`,
            });
            notifyMenuUpdate();
          } catch (err: unknown) {
            toast.error('Failed to delete', {
              description: err instanceof Error ? err.message : 'Unknown error',
            });
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const handleMoveCategoryUp = async (index: number) => {
    if (index <= 0) return;

    const newCats = [...categories];
    [newCats[index - 1], newCats[index]] = [newCats[index], newCats[index - 1]];
    setCategories(newCats);

    try {
      const updated = await reorderCategories(newCats.map(c => c._id));
      setCategories(updated);
      notifyMenuUpdate();
    } catch (err) {
      console.error('Reorder failed:', err);
      fetchData();
    }
  };

  const handleMoveCategoryDown = async (index: number) => {
    if (index >= categories.length - 1) return;

    const newCats = [...categories];
    [newCats[index + 1], newCats[index]] = [newCats[index], newCats[index + 1]];
    setCategories(newCats);

    try {
      const updated = await reorderCategories(newCats.map(c => c._id));
      setCategories(updated);
      notifyMenuUpdate();
    } catch (err) {
      console.error('Reorder failed:', err);
      fetchData();
    }
  };

  // ─── Login Screen ────────────────────────────────────────────────

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
              disabled={loading}
              className="w-full bg-charcoal text-warm-white font-body text-xs uppercase tracking-[0.08em] py-4 hover:bg-burnt-orange transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
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

  // ─── Admin Panel ─────────────────────────────────────────────────

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
                        value={formData.categoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full border border-charcoal/20 px-3 py-2 font-body text-sm bg-transparent focus:border-burnt-orange transition-colors"
                      >
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
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
                    key={cat._id}
                    className="flex flex-col p-4 bg-white border border-charcoal/5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-charcoal">{cat.name}</span>
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
                      const categoryItems = menuItems.filter(item => item.category === cat.name);
                      if (categoryItems.length === 0) return null;
                      return (
                        <div className="mt-4 pt-3 border-t border-charcoal/10 space-y-2">
                          {categoryItems.map((item, itemIndex) => (
                            <div key={item._id} className="flex items-center justify-between bg-warm-white p-2 border border-charcoal/5">
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="font-body text-xs text-charcoal font-medium block">{item.name}</span>
                                  <span className="font-body text-[10px] text-burnt-orange block">{item.price}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveItemUp(item._id, cat.name)}
                                  disabled={itemIndex === 0}
                                  className={`w-6 h-6 flex items-center justify-center transition-colors ${itemIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-charcoal/10'}`}
                                  title="Move Up"
                                >
                                  <ArrowUp size={12} className="text-charcoal" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveItemDown(item._id, cat.name)}
                                  disabled={itemIndex === categoryItems.length - 1}
                                  className={`w-6 h-6 flex items-center justify-center transition-colors ${itemIndex === categoryItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-charcoal/10'}`}
                                  title="Move Down"
                                >
                                  <ArrowDown size={12} className="text-charcoal" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item._id)}
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
          <div className="flex items-center gap-4">
            <p className="font-body text-[10px] text-brown">
              Press Ctrl+A to toggle this panel
            </p>
            {localStorage.getItem('filterbenne_menu') && (
              <button
                onClick={handleMigrateLocalStorage}
                disabled={loading}
                className="font-body text-[10px] uppercase tracking-[0.08em] text-burnt-orange hover:text-charcoal transition-colors disabled:opacity-50"
              >
                {loading ? 'Migrating...' : 'Migrate Local Data'}
              </button>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="font-body text-[11px] uppercase tracking-[0.08em] text-brown hover:text-charcoal transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
