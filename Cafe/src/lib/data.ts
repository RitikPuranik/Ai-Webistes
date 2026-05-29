import type { MenuItem, Category, Review, CafeSettings, ActivityLogEntry } from '@/types';

const KEYS = {
  MENU: 'linden_menu_items',
  CATEGORIES: 'linden_categories',
  REVIEWS: 'linden_reviews',
  SETTINGS: 'linden_settings',
  ACTIVITY: 'linden_activity_log',
  AUTH: 'admin_authenticated',
};

const DEFAULT_MENU: MenuItem[] = [
  { id: '1', name: 'Espresso', category: 'Espresso Bar', price: 3.50, description: 'Double shot of our house blend', image: '' },
  { id: '2', name: 'Cappuccino', category: 'Espresso Bar', price: 4.50, description: 'Equal parts espresso, steamed milk, and foam', image: '' },
  { id: '3', name: 'Latte', category: 'Espresso Bar', price: 5.00, description: 'Silky steamed milk over double espresso', image: '' },
  { id: '4', name: 'Pour Over — Ethiopia', category: 'Pour Over', price: 6.00, description: 'Bright, floral, citrus notes', image: '' },
  { id: '5', name: 'Pour Over — Colombia', category: 'Pour Over', price: 6.00, description: 'Caramel sweetness, medium body', image: '' },
  { id: '6', name: 'Cold Brew', category: 'Cold Coffee', price: 5.50, description: 'Steeped 18 hours, smooth and bold', image: '' },
  { id: '7', name: 'Nitro Cold Brew', category: 'Cold Coffee', price: 6.50, description: 'Infused with nitrogen for a creamy pour', image: '' },
  { id: '8', name: 'Matcha Latte', category: 'Tea', price: 5.50, description: 'Ceremonial grade matcha with oat milk', image: '' },
  { id: '9', name: 'Chai Latte', category: 'Tea', price: 5.00, description: 'House-made spice blend with steamed milk', image: '' },
  { id: '10', name: 'Croissant', category: 'Pastry', price: 4.00, description: 'Buttery, flaky, baked fresh each morning', image: '' },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Espresso Bar', order: 1 },
  { id: '2', name: 'Pour Over', order: 2 },
  { id: '3', name: 'Cold Coffee', order: 3 },
  { id: '4', name: 'Tea', order: 4 },
  { id: '5', name: 'Pastry', order: 5 },
];

const DEFAULT_REVIEWS: Review[] = [
  { id: '1', name: 'Sarah M.', rating: 5, text: 'The most beautiful café in the city. Every detail is intentional.', date: '2024-03-15' },
  { id: '2', name: 'James L.', rating: 5, text: 'Their pour over changed how I think about coffee. Truly artisan.', date: '2024-03-10' },
  { id: '3', name: 'Elena R.', rating: 4, text: 'Gorgeous space, incredible pastries. A perfect morning ritual.', date: '2024-02-28' },
];

const DEFAULT_SETTINGS: CafeSettings = {
  cafeName: 'Linden Café & Atelier',
  address: '42 Rue de la Paix, Paris 75002',
  phone: '+33 1 42 60 00 00',
  email: 'bonjour@lindencafe.com',
  hours: {
    monday: '07:00 - 19:00',
    tuesday: '07:00 - 19:00',
    wednesday: '07:00 - 19:00',
    thursday: '07:00 - 21:00',
    friday: '07:00 - 21:00',
    saturday: '08:00 - 21:00',
    sunday: '08:00 - 18:00',
  },
  social: {
    instagram: 'https://instagram.com/lindencafe',
    facebook: 'https://facebook.com/lindencafe',
  },
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Seed data on first load
export function seedData() {
  if (!localStorage.getItem(KEYS.MENU)) {
    localStorage.setItem(KEYS.MENU, JSON.stringify(DEFAULT_MENU));
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem(KEYS.REVIEWS)) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem(KEYS.ACTIVITY)) {
    localStorage.setItem(KEYS.ACTIVITY, JSON.stringify([]));
  }
}

export function getMenuItems(): MenuItem[] {
  return getItem(KEYS.MENU, DEFAULT_MENU);
}

export function setMenuItems(items: MenuItem[]) {
  setItem(KEYS.MENU, items);
}

export function addMenuItem(item: MenuItem) {
  const items = getMenuItems();
  items.push(item);
  setMenuItems(items);
  logActivity('Added menu item', item.name);
}

export function updateMenuItem(updated: MenuItem) {
  const items = getMenuItems();
  const idx = items.findIndex(i => i.id === updated.id);
  if (idx >= 0) {
    items[idx] = updated;
    setMenuItems(items);
    logActivity('Updated menu item', updated.name);
  }
}

export function deleteMenuItem(id: string) {
  const items = getMenuItems();
  const item = items.find(i => i.id === id);
  const filtered = items.filter(i => i.id !== id);
  setMenuItems(filtered);
  if (item) logActivity('Deleted menu item', item.name);
}

export function getCategories(): Category[] {
  return getItem(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
}

export function setCategories(cats: Category[]) {
  setItem(KEYS.CATEGORIES, cats);
}

export function addCategory(cat: Category) {
  const cats = getCategories();
  cats.push(cat);
  setCategories(cats);
  logActivity('Added category', cat.name);
}

export function updateCategory(updated: Category) {
  const cats = getCategories();
  const idx = cats.findIndex(c => c.id === updated.id);
  if (idx >= 0) {
    cats[idx] = updated;
    setCategories(cats);
    logActivity('Updated category', updated.name);
  }
}

export function deleteCategory(id: string) {
  const cats = getCategories();
  const cat = cats.find(c => c.id === id);
  const filtered = cats.filter(c => c.id !== id);
  setCategories(filtered);
  if (cat) logActivity('Deleted category', cat.name);
}

export function getReviews(): Review[] {
  return getItem(KEYS.REVIEWS, DEFAULT_REVIEWS);
}

export function setReviews(reviews: Review[]) {
  setItem(KEYS.REVIEWS, reviews);
}

export function addReview(review: Review) {
  const reviews = getReviews();
  reviews.push(review);
  setReviews(reviews);
  logActivity('Added review', review.name);
}

export function updateReview(updated: Review) {
  const reviews = getReviews();
  const idx = reviews.findIndex(r => r.id === updated.id);
  if (idx >= 0) {
    reviews[idx] = updated;
    setReviews(reviews);
    logActivity('Updated review', updated.name);
  }
}

export function deleteReview(id: string) {
  const reviews = getReviews();
  const review = reviews.find(r => r.id === id);
  const filtered = reviews.filter(r => r.id !== id);
  setReviews(filtered);
  if (review) logActivity('Deleted review', review.name);
}

export function getSettings(): CafeSettings {
  return getItem(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function setSettings(settings: CafeSettings) {
  setItem(KEYS.SETTINGS, settings);
  logActivity('Updated settings', 'Business details');
}

export function getActivityLog(): ActivityLogEntry[] {
  return getItem(KEYS.ACTIVITY, []);
}

function logActivity(action: string, item: string) {
  const log = getActivityLog();
  log.unshift({
    action,
    item,
    timestamp: new Date().toISOString(),
  });
  if (log.length > 50) log.length = 50;
  setItem(KEYS.ACTIVITY, log);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(KEYS.AUTH) === 'true';
}

export function setAuthenticated(value: boolean) {
  localStorage.setItem(KEYS.AUTH, value ? 'true' : 'false');
}

export function logout() {
  localStorage.removeItem(KEYS.AUTH);
}

export function resetAllData() {
  localStorage.setItem(KEYS.MENU, JSON.stringify(DEFAULT_MENU));
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  localStorage.setItem(KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  localStorage.setItem(KEYS.ACTIVITY, JSON.stringify([]));
}