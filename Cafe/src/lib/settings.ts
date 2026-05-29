import { getSettings } from './data';

export function getEnvOrStored(key: string, fallback: string): string {
  const envValue = import.meta.env[key];
  if (envValue) return envValue;
  const settings = getSettings();
  const settingsMap: Record<string, string> = {
    'VITE_CAFE_NAME': settings.cafeName,
    'VITE_CAFE_ADDRESS': settings.address,
    'VITE_CAFE_PHONE': settings.phone,
    'VITE_CAFE_EMAIL': settings.email,
    'VITE_CAFE_HOURS_MON': settings.hours?.monday || '',
    'VITE_CAFE_HOURS_TUE': settings.hours?.tuesday || '',
    'VITE_CAFE_HOURS_WED': settings.hours?.wednesday || '',
    'VITE_CAFE_HOURS_THU': settings.hours?.thursday || '',
    'VITE_CAFE_HOURS_FRI': settings.hours?.friday || '',
    'VITE_CAFE_HOURS_SAT': settings.hours?.saturday || '',
    'VITE_CAFE_HOURS_SUN': settings.hours?.sunday || '',
    'VITE_INSTAGRAM': settings.social?.instagram || '',
    'VITE_FACEBOOK': settings.social?.facebook || '',
  };
  return settingsMap[key] || fallback;
}

export function getCafeName(): string {
  return getEnvOrStored('VITE_CAFE_NAME', 'Linden Café & Atelier');
}

export function getAddress(): string {
  return getEnvOrStored('VITE_CAFE_ADDRESS', '42 Rue de la Paix, Paris 75002');
}

export function getPhone(): string {
  return getEnvOrStored('VITE_CAFE_PHONE', '+33 1 42 60 00 00');
}

export function getEmail(): string {
  return getEnvOrStored('VITE_CAFE_EMAIL', 'bonjour@lindencafe.com');
}

export function getHours(): Record<string, string> {
  return {
    monday: getEnvOrStored('VITE_CAFE_HOURS_MON', '07:00 - 19:00'),
    tuesday: getEnvOrStored('VITE_CAFE_HOURS_TUE', '07:00 - 19:00'),
    wednesday: getEnvOrStored('VITE_CAFE_HOURS_WED', '07:00 - 19:00'),
    thursday: getEnvOrStored('VITE_CAFE_HOURS_THU', '07:00 - 21:00'),
    friday: getEnvOrStored('VITE_CAFE_HOURS_FRI', '07:00 - 21:00'),
    saturday: getEnvOrStored('VITE_CAFE_HOURS_SAT', '08:00 - 21:00'),
    sunday: getEnvOrStored('VITE_CAFE_HOURS_SUN', '08:00 - 18:00'),
  };
}

export function getInstagram(): string {
  return getEnvOrStored('VITE_INSTAGRAM', 'https://instagram.com/lindencafe');
}

export function getFacebook(): string {
  return getEnvOrStored('VITE_FACEBOOK', 'https://facebook.com/lindencafe');
}