import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import {
  LayoutDashboard,
  Coffee,
  Tags,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import AdminAuth from '@/components/AdminAuth';
import {
  isAuthenticated,
  logout,
  getMenuItems,
  getCategories,
  getReviews,
  getSettings,
  getActivityLog,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  addCategory,
  updateCategory,
  deleteCategory,
  addReview,
  updateReview,
  deleteReview,
  setSettings,
  resetAllData,
} from '@/lib/data';
import type { MenuItem, Category, Review, CafeSettings } from '@/types';

type Tab = 'dashboard' | 'menu' | 'categories' | 'reviews' | 'settings';

const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu Items', icon: Coffee },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Admin() {
  const [auth, setAuth] = useState(isAuthenticated());
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    setAuth(false);
    navigate('/');
  };

  if (!auth) {
    return <AdminAuth onAuth={() => setAuth(true)} />;
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8ebd5' }}>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-50"
        style={{ backgroundColor: '#201502' }}
      >
        <div className="p-6">
          <span className="font-body text-cream text-sm font-medium uppercase tracking-[0.1em]">
            LINDEN
          </span>
          <p className="font-body text-warmgray text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-saddle text-cream'
                    : 'text-warmgray hover:text-cream hover:bg-charcoal/50'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm text-warmgray hover:text-cream hover:bg-charcoal/50 transition-all"
          >
            <ExternalLink size={18} />
            View Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm text-warmgray hover:text-cream hover:bg-charcoal/50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <header
          className="sticky top-0 z-40 px-8 py-4 flex items-center justify-between border-b"
          style={{
            backgroundColor: 'rgba(248, 235, 213, 0.92)',
            backdropFilter: 'blur(12px)',
            borderColor: '#e1d5b5',
          }}
        >
          <h2 className="font-display text-charcoal text-2xl">
            {navItems.find((n) => n.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <span className="font-body text-warmgray text-xs uppercase tracking-[0.1em]">
              Admin
            </span>
          </div>
        </header>

        <div ref={contentRef} className="p-8">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'menu' && <MenuTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

/* ─── Dashboard ─── */
function DashboardTab() {
  const menuCount = getMenuItems().length;
  const catCount = getCategories().length;
  const reviews = getReviews();
  const reviewCount = reviews.length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '0';
  const activity = getActivityLog().slice(0, 5);

  const stats = [
    { label: 'Total Menu Items', value: menuCount },
    { label: 'Categories', value: catCount },
    { label: 'Reviews', value: reviewCount },
    { label: 'Avg. Rating', value: avgRating },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg p-6 transition-shadow hover:shadow-md"
            style={{ backgroundColor: '#e1d5b5' }}
          >
            <p
              className="font-display text-charcoal"
              style={{ fontSize: '2.5rem' }}
            >
              {stat.value}
            </p>
            <p className="font-body text-warmgray text-xs uppercase tracking-[0.1em] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-lg p-6 border"
        style={{ backgroundColor: 'rgba(225, 213, 181, 0.3)', borderColor: '#e1d5b5' }}
      >
        <h3 className="font-display text-charcoal text-xl mb-4">
          Recent Activity
        </h3>
        {activity.length === 0 ? (
          <p className="font-body text-warmgray text-sm">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {activity.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-sand/40 last:border-0"
              >
                <div>
                  <p className="font-body text-charcoal text-sm">
                    {entry.action}
                  </p>
                  <p className="font-body text-warmgray text-xs">
                    {entry.item}
                  </p>
                </div>
                <span className="font-body text-warmgray text-xs">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Menu Items ─── */
function MenuTab() {
  const [items, setItems] = useState<MenuItem[]>(getMenuItems());
  const [categories, setCategories] = useState<Category[]>(getCategories());
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Partial<MenuItem>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = () => {
    setItems(getMenuItems());
    setCategories(getCategories());
  };

  const filtered = items
    .filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((i) => (filterCat ? i.category === filterCat : true));

  const openAdd = () => {
    setEditing(null);
    setForm({ id: Date.now().toString() });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({ ...item });
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name?.trim()) newErrors.name = 'Name is required';
    if (!form.price || form.price <= 0) newErrors.price = 'Valid price required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editing) {
      updateMenuItem({ ...editing, ...form } as MenuItem);
    } else {
      addMenuItem(form as MenuItem);
    }
    refresh();
    setModalOpen(false);
  };

  const del = (id: string) => {
    deleteMenuItem(id);
    refresh();
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray"
            />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-sand/50 border border-transparent focus:border-saddle font-body text-sm text-charcoal outline-none w-56"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="px-4 py-2 rounded-lg bg-sand/50 border border-transparent focus:border-saddle font-body text-sm text-charcoal outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm text-cream transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#924942' }}
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: '#e1d5b5' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#e1d5b5' }}>
              <th className="text-left px-6 py-3 font-body text-xs uppercase tracking-[0.1em] text-charcoal">
                Name
              </th>
              <th className="text-left px-6 py-3 font-body text-xs uppercase tracking-[0.1em] text-charcoal">
                Category
              </th>
              <th className="text-left px-6 py-3 font-body text-xs uppercase tracking-[0.1em] text-charcoal">
                Price
              </th>
              <th className="text-left px-6 py-3 font-body text-xs uppercase tracking-[0.1em] text-charcoal">
                Description
              </th>
              <th className="text-right px-6 py-3 font-body text-xs uppercase tracking-[0.1em] text-charcoal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr
                key={item.id}
                className="border-t transition-colors hover:bg-saddle/5"
                style={{
                  borderColor: '#e1d5b5',
                  backgroundColor:
                    idx % 2 === 1 ? 'rgba(225, 213, 181, 0.2)' : 'transparent',
                }}
              >
                <td className="px-6 py-4 font-body text-sm text-charcoal">
                  {item.name}
                </td>
                <td className="px-6 py-4 font-body text-sm text-warmgray">
                  {item.category}
                </td>
                <td className="px-6 py-4 font-body text-sm text-charcoal">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 font-body text-sm text-warmgray max-w-xs truncate">
                  {item.description}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openEdit(item)}
                    className="text-warmgray hover:text-saddle transition-colors mr-3"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="text-warmgray hover:text-saddle transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-warmgray text-sm">No items found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(32, 21, 2, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setModalOpen(false)}
          />
          <div
            className="relative rounded-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: '#f8ebd5' }}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-warmgray hover:text-charcoal"
            >
              <X size={20} />
            </button>
            <h3 className="font-display text-charcoal text-2xl mb-6">
              {editing ? 'Edit Item' : 'Add Item'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={`w-full bg-sand/50 border ${
                    errors.name ? 'border-saddle' : 'border-transparent'
                  } focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none transition-colors`}
                />
                {errors.name && (
                  <p className="text-saddle text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
                  Category
                </label>
                <select
                  value={form.category || ''}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-sand/50 border border-transparent focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price || ''}
                  onChange={(e) =>
                    setForm({ ...form, price: parseFloat(e.target.value) })
                  }
                  className={`w-full bg-sand/50 border ${
                    errors.price ? 'border-saddle' : 'border-transparent'
                  } focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none transition-colors`}
                />
                {errors.price && (
                  <p className="text-saddle text-xs mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
                  Description
                </label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-sand/50 border border-transparent focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-body text-sm text-warmgray hover:text-charcoal transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="px-6 py-2 rounded-lg font-body text-sm text-cream transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#924942' }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(32, 21, 2, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setDeleteConfirm(null)}
          />
          <div
            className="relative rounded-xl p-8 w-full max-w-sm"
            style={{ backgroundColor: '#f8ebd5' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-saddle" />
              <h3 className="font-display text-charcoal text-xl">Confirm Delete</h3>
            </div>
            <p className="font-body text-warmgray text-sm mb-6">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg font-body text-sm text-warmgray hover:text-charcoal transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => del(deleteConfirm)}
                className="px-6 py-2 rounded-lg font-body text-sm text-cream bg-saddle hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Categories ─── */
function CategoriesTab() {
  const [cats, setCats] = useState<Category[]>(getCategories());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Partial<Category>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const refresh = () => setCats(getCategories());

  const openAdd = () => {
    setEditing(null);
    setForm({ id: Date.now().toString(), order: cats.length + 1 });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ ...cat });
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    if (!form.name?.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    if (
      !editing &&
      cats.some((c) => c.name.toLowerCase() === form.name?.toLowerCase())
    ) {
      setErrors({ name: 'Category already exists' });
      return;
    }

    if (editing) {
      updateCategory({ ...editing, ...form } as Category);
    } else {
      addCategory(form as Category);
    }
    refresh();
    setModalOpen(false);
  };

  const del = (id: string) => {
    deleteCategory(id);
    refresh();
    setDeleteConfirm(null);
  };

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newCats = [...cats];
    const [removed] = newCats.splice(draggedIdx, 1);
    newCats.splice(idx, 0, removed);
    setDraggedIdx(idx);
    setCats(newCats);
  };
  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm text-cream transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#924942' }}
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="space-y-2">
        {cats.map((cat, idx) => (
          <div
            key={cat.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            className="flex items-center justify-between p-4 rounded-lg border cursor-move transition-colors hover:bg-sand/30"
            style={{ borderColor: '#e1d5b5' }}
          >
            <div className="flex items-center gap-4">
              <span className="font-body text-warmgray text-xs w-6">
                {cat.order}
              </span>
              <span className="font-body text-charcoal">{cat.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(cat)}
                className="text-warmgray hover:text-saddle transition-colors p-1"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleteConfirm(cat.id)}
                className="text-warmgray hover:text-saddle transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(32, 21, 2, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setModalOpen(false)}
          />
          <div
            className="relative rounded-xl p-8 w-full max-w-sm"
            style={{ backgroundColor: '#f8ebd5' }}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-warmgray hover:text-charcoal"
            >
              <X size={20} />
            </button>
            <h3 className="font-display text-charcoal text-2xl mb-6">
              {editing ? 'Edit Category' : 'Add Category'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={`w-full bg-sand/50 border ${
                    errors.name ? 'border-saddle' : 'border-transparent'
                  } focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none`}
                />
                {errors.name && (
                  <p className="text-saddle text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-body text-sm text-warmgray hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="px-6 py-2 rounded-lg font-body text-sm text-cream"
                  style={{ backgroundColor: '#924942' }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(32, 21, 2, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setDeleteConfirm(null)}
          />
          <div
            className="relative rounded-xl p-8 w-full max-w-sm"
            style={{ backgroundColor: '#f8ebd5' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-saddle" />
              <h3 className="font-display text-charcoal text-xl">Confirm Delete</h3>
            </div>
            <p className="font-body text-warmgray text-sm mb-6">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg font-body text-sm text-warmgray hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={() => del(deleteConfirm)}
                className="px-6 py-2 rounded-lg font-body text-sm text-cream bg-saddle hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Reviews ─── */
function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>(getReviews());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState<Partial<Review>>({ rating: 5 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = () => setReviews(getReviews());

  const openAdd = () => {
    setEditing(null);
    setForm({
      id: Date.now().toString(),
      rating: 5,
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (review: Review) => {
    setEditing(review);
    setForm({ ...review });
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    if (!form.name?.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    if (!form.text?.trim()) {
      setErrors({ text: 'Review text is required' });
      return;
    }

    if (editing) {
      updateReview({ ...editing, ...form } as Review);
    } else {
      addReview(form as Review);
    }
    refresh();
    setModalOpen(false);
  };

  const del = (id: string) => {
    deleteReview(id);
    refresh();
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm text-cream transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#924942' }}
        >
          <Plus size={16} />
          Add Review
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg p-6 border transition-shadow hover:shadow-md"
            style={{ backgroundColor: 'rgba(225, 213, 181, 0.3)', borderColor: '#e1d5b5' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={
                      s <= review.rating
                        ? 'text-saddle fill-saddle'
                        : 'text-sand'
                    }
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(review)}
                  className="text-warmgray hover:text-saddle transition-colors p-1"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(review.id)}
                  className="text-warmgray hover:text-saddle transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="font-body text-charcoal text-sm leading-relaxed mb-4">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-charcoal font-medium">
                {review.name}
              </span>
              <span className="font-body text-xs text-warmgray">
                {review.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="font-body text-warmgray text-sm">No reviews yet</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(32, 21, 2, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setModalOpen(false)}
          />
          <div
            className="relative rounded-xl p-8 w-full max-w-lg"
            style={{ backgroundColor: '#f8ebd5' }}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-warmgray hover:text-charcoal"
            >
              <X size={20} />
            </button>
            <h3 className="font-display text-charcoal text-2xl mb-6">
              {editing ? 'Edit Review' : 'Add Review'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={`w-full bg-sand/50 border ${
                    errors.name ? 'border-saddle' : 'border-transparent'
                  } focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none`}
                />
                {errors.name && (
                  <p className="text-saddle text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, rating: s })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={
                          s <= (form.rating || 0)
                            ? 'text-saddle fill-saddle'
                            : 'text-sand'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
                  Review *
                </label>
                <textarea
                  value={form.text || ''}
                  onChange={(e) =>
                    setForm({ ...form, text: e.target.value })
                  }
                  rows={4}
                  className={`w-full bg-sand/50 border ${
                    errors.text ? 'border-saddle' : 'border-transparent'
                  } focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none resize-none`}
                />
                {errors.text && (
                  <p className="text-saddle text-xs mt-1">{errors.text}</p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-body text-sm text-warmgray hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="px-6 py-2 rounded-lg font-body text-sm text-cream"
                  style={{ backgroundColor: '#924942' }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(32, 21, 2, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setDeleteConfirm(null)}
          />
          <div
            className="relative rounded-xl p-8 w-full max-w-sm"
            style={{ backgroundColor: '#f8ebd5' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-saddle" />
              <h3 className="font-display text-charcoal text-xl">Confirm Delete</h3>
            </div>
            <p className="font-body text-warmgray text-sm mb-6">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg font-body text-sm text-warmgray hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={() => del(deleteConfirm)}
                className="px-6 py-2 rounded-lg font-body text-sm text-cream bg-saddle hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Settings ─── */
function SettingsTab() {
  const [settings, setSettingsState] = useState<CafeSettings>(getSettings());
  const [saved, setSaved] = useState(false);

  const update = (partial: Partial<CafeSettings>) => {
    setSettingsState({ ...settings, ...partial });
    setSaved(false);
  };

  const updateHours = (day: string, value: string) => {
    setSettingsState({
      ...settings,
      hours: { ...settings.hours, [day]: value },
    });
    setSaved(false);
  };

  const updateSocial = (key: 'instagram' | 'facebook', value: string) => {
    setSettingsState({
      ...settings,
      social: { ...settings.social, [key]: value },
    });
    setSaved(false);
  };

  const save = () => {
    setSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const reset = () => {
    if (window.confirm('Reset all data to defaults? This cannot be undone.')) {
      resetAllData();
      setSettingsState(getSettings());
    }
  };

  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday',
    'friday', 'saturday', 'sunday',
  ];
  const dayLabels: Record<string, string> = {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Business Info */}
      <div>
        <h3 className="font-display text-charcoal text-xl mb-4">Business Details</h3>
        <div className="space-y-4">
          <div>
            <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
              Café Name
            </label>
            <input
              type="text"
              value={settings.cafeName}
              onChange={(e) => update({ cafeName: e.target.value })}
              className="w-full bg-sand/50 border border-transparent focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none"
            />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
              Address
            </label>
            <textarea
              value={settings.address}
              onChange={(e) => update({ address: e.target.value })}
              rows={2}
              className="w-full bg-sand/50 border border-transparent focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
                Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => update({ phone: e.target.value })}
                className="w-full bg-sand/50 border border-transparent focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
                Email
              </label>
              <input
                type="text"
                value={settings.email}
                onChange={(e) => update({ email: e.target.value })}
                className="w-full bg-sand/50 border border-transparent focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hours */}
      <div>
        <h3 className="font-display text-charcoal text-xl mb-4">Opening Hours</h3>
        <div className="space-y-3">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <span className="font-body text-sm text-charcoal w-28">
                {dayLabels[day]}
              </span>
              <input
                type="text"
                value={settings.hours[day] || ''}
                onChange={(e) => updateHours(day, e.target.value)}
                className="flex-1 bg-sand/50 border border-transparent focus:border-saddle rounded-lg px-4 py-2 font-body text-sm text-charcoal outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Social */}
      <div>
        <h3 className="font-display text-charcoal text-xl mb-4">Social Links</h3>
        <div className="space-y-4">
          <div>
            <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={settings.social.instagram}
              onChange={(e) => updateSocial('instagram', e.target.value)}
              className="w-full bg-sand/50 border border-transparent focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none"
            />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-[0.1em] text-warmgray block mb-2">
              Facebook
            </label>
            <input
              type="text"
              value={settings.social.facebook}
              onChange={(e) => updateSocial('facebook', e.target.value)}
              className="w-full bg-sand/50 border border-transparent focus:border-saddle rounded-lg px-4 py-3 font-body text-sm text-charcoal outline-none"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={save}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-body text-sm text-cream transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#924942' }}
        >
          {saved && <Check size={16} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg font-body text-sm text-saddle border border-saddle hover:bg-saddle/10 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}