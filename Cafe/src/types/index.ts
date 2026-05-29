export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface CafeSettings {
  cafeName: string;
  address: string;
  phone: string;
  email: string;
  hours: Record<string, string>;
  social: {
    instagram: string;
    facebook: string;
  };
}

export interface ActivityLogEntry {
  action: string;
  item: string;
  timestamp: string;
}