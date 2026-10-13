import { dailyAyahsForKhatma, findNextPrayer, remainingLabel } from './prayer.util';
import { PrayerTimings } from '../models/prayer.model';

describe('prayer utils', () => {
  const timings: PrayerTimings = {
    Fajr: '05:00',
    Sunrise: '06:30',
    Dhuhr: '12:00',
    Asr: '15:30',
    Maghrib: '18:00',
    Isha: '19:30'
  };

  it('finds the next prayer after now', () => {
    const now = new Date();
    now.setHours(13, 0, 0, 0);
    const next = findNextPrayer(timings, now);
    expect(next.key).toBe('Asr');
  });

  it('returns fajr next day after isha', () => {
    const now = new Date();
    now.setHours(22, 0, 0, 0);
    const next = findNextPrayer(timings, now);
    expect(next.key).toBe('Fajr');
    expect(next.at.getDate()).toBeGreaterThanOrEqual(now.getDate());
  });

  it('formats remaining time', () => {
    const now = new Date('2026-01-01T10:00:00');
    const to = new Date('2026-01-01T12:15:00');
    expect(remainingLabel(to, now)).toBe('2 س 15 د');
  });

  it('calculates daily khatma ayahs', () => {
    expect(dailyAyahsForKhatma(30)).toBe(208);
    expect(dailyAyahsForKhatma(0)).toBe(6236);
  });
});
