import { PrayerKey, PrayerTimings } from '../models/prayer.model';

export const PRAYER_ORDER: PrayerKey[] = [
  'Fajr',
  'Sunrise',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha'
];

export function parsePrayerTime(hhmm: string, base = new Date()): Date {
  const [h, m] = hhmm.split(' ')[0].split(':').map(Number);
  const d = new Date(base);
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

export function remainingLabel(to: Date, now = new Date()): string {
  const diff = to.getTime() - now.getTime();
  if (diff <= 0) {
    return 'الآن';
  }
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h <= 0) {
    return `${m} د`;
  }
  return `${h} س ${m} د`;
}

export function findNextPrayer(
  timings: PrayerTimings,
  now = new Date()
): { key: PrayerKey; at: Date } {
  for (const key of PRAYER_ORDER) {
    if (key === 'Sunrise') {
      continue;
    }
    const at = parsePrayerTime(timings[key], now);
    if (at.getTime() > now.getTime()) {
      return { key, at };
    }
  }
  const tomorrowFajr = parsePrayerTime(timings.Fajr, now);
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
  return { key: 'Fajr', at: tomorrowFajr };
}

export function dailyAyahsForKhatma(days: number, total = 6236): number {
  if (days <= 0) {
    return total;
  }
  return Math.ceil(total / days);
}
