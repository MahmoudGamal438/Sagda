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

export type PrayerPhase = 'upcoming' | 'current' | 'past';

export interface Countdown {
  h: number;
  m: number;
  s: number;
  totalMs: number;
}

export function countdown(to: Date, now = new Date()): Countdown {
  const totalMs = Math.max(0, to.getTime() - now.getTime());
  return {
    h: Math.floor(totalMs / 3600000),
    m: Math.floor((totalMs % 3600000) / 60000),
    s: Math.floor((totalMs % 60000) / 1000),
    totalMs
  };
}

const OBLIGATORY: Exclude<PrayerKey, 'Sunrise'>[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export function prayerPhases(
  timings: PrayerTimings,
  now = new Date()
): Record<PrayerKey, PrayerPhase> {
  const times = OBLIGATORY.map((key) => parsePrayerTime(timings[key], now).getTime());
  const tomorrowFajr = parsePrayerTime(timings.Fajr, now);
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
  const nowMs = now.getTime();

  const phases = {} as Record<PrayerKey, PrayerPhase>;
  OBLIGATORY.forEach((key, i) => {
    const at = times[i];
    if (nowMs < at) {
      phases[key] = 'upcoming';
      return;
    }
    const nextBoundary = i < OBLIGATORY.length - 1 ? times[i + 1] : tomorrowFajr.getTime();
    phases[key] = nowMs < nextBoundary ? 'current' : 'past';
  });

  const sunrise = parsePrayerTime(timings.Sunrise, now).getTime();
  phases.Sunrise = nowMs < sunrise ? 'upcoming' : 'past';
  return phases;
}

export function formatTime(hhmm: string, use24 = true): string {
  const [h, m] = hhmm.split(' ')[0].split(':').map(Number);
  if (use24) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  const period = h < 12 ? 'ص' : 'م';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function dailyAyahsForKhatma(days: number, total = 6236): number {
  if (days <= 0) {
    return total;
  }
  return Math.ceil(total / days);
}
