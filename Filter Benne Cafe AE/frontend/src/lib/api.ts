const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─── Token Management ─────────────────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem('filterbenne_token');
}

function setToken(token: string) {
  localStorage.setItem('filterbenne_token', token);
}

export function clearToken() {
  localStorage.removeItem('filterbenne_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Generic Fetch Helpers ─────────────────────────────────────────
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(body.error || `API error: ${res.status}`);
  }

  return res.json();
}

// ─── Auth ──────────────────────────────────────────────────────────
export async function login(password: string): Promise<string> {
  const data = await apiFetch<{ token: string; message: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  setToken(data.token);
  return data.token;
}

// ─── Category Types ────────────────────────────────────────────────
export interface ApiCategory {
  _id: string;
  name: string;
  sortOrder: number;
  defaultImage: string;
}

// ─── Categories ────────────────────────────────────────────────────
export async function getCategories(): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>('/categories');
}

export async function addCategory(name: string): Promise<ApiCategory> {
  return apiFetch<ApiCategory>('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch(`/categories/${id}`, { method: 'DELETE' });
}

export async function reorderCategories(orderedIds: string[]): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>('/categories/reorder', {
    method: 'PUT',
    body: JSON.stringify({ orderedIds }),
  });
}

// ─── MenuItem Types ────────────────────────────────────────────────
export interface ApiMenuItem {
  _id: string;
  id: string;
  name: string;
  price: string;
  category: string;       // category name (populated)
  categoryId: string;
  description: string;
  image: string;
  tag: string;
  sortOrder: number;
}

// ─── Menu Items ────────────────────────────────────────────────────
export async function getMenuItems(): Promise<ApiMenuItem[]> {
  return apiFetch<ApiMenuItem[]>('/menu');
}

export async function addMenuItem(data: {
  name: string;
  price: string;
  categoryId: string;
  description?: string;
  tag?: string;
}): Promise<ApiMenuItem> {
  return apiFetch<ApiMenuItem>('/menu', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteMenuItem(id: string): Promise<void> {
  await apiFetch(`/menu/${id}`, { method: 'DELETE' });
}

export async function reorderMenuItems(orderedIds: string[]): Promise<void> {
  await apiFetch('/menu/reorder', {
    method: 'PUT',
    body: JSON.stringify({ orderedIds }),
  });
}
