import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CityOption,
  PrayerAlertSetting,
  PrayerDay,
  PrayerKey,
  PrayerSettings,
  PrayerTimings
} from '../models/prayer.model';
import { StorageService } from './storage.service';
import { EGYPT_CITIES } from '../data/cities.data';

interface AladhanEnvelope<T> {
  code: number;
  status: string;
  data: T;
}

const ORDER: PrayerKey[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const DEFAULT_ALERT: PrayerAlertSetting = {
  enabled: true,
  minutesBefore: 10,
  sound: 'short'
};

const DEFAULT_SETTINGS: PrayerSettings = {
  method: 5,
  school: 0,
  adjustments: {},
  useGeolocation: false,
  alerts: {
    Fajr: { ...DEFAULT_ALERT },
    Dhuhr: { ...DEFAULT_ALERT },
    Asr: { ...DEFAULT_ALERT },
    Maghrib: { ...DEFAULT_ALERT },
    Isha: { ...DEFAULT_ALERT }
  }
};

@Injectable({ providedIn: 'root' })
export class PrayerService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  readonly cities = EGYPT_CITIES;
  readonly methods = [
    { id: 5, name: 'الهيئة المصرية العامة للمساحة' },
    { id: 3, name: 'رابطة العالم الإسلامي' },
    { id: 4, name: 'أم القرى' },
    { id: 2, name: 'الجمعية الإسلامية لأمريكا الشمالية' },
    { id: 1, name: 'جامعة العلوم الإسلامية بكراتشي' }
  ];

  readonly settings = signal<PrayerSettings>(
    this.storage.get('prayer-settings', {
      ...DEFAULT_SETTINGS,
      city: EGYPT_CITIES[0]
    })
  );
  readonly today = signal<PrayerDay | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastFetchedAt = signal<number | null>(this.storage.get('prayer-fetched', null));

  readonly nextPrayer = computed(() => {
    const day = this.today();
    if (!day) {
      return null;
    }
    return this.findNext(day.timings);
  });

  patchSettings(partial: Partial<PrayerSettings>): void {
    this.settings.update((current) => {
      const next = { ...current, ...partial };
      this.storage.set('prayer-settings', next);
      return next;
    });
  }

  async loadToday(force = false): Promise<void> {
    const s = this.settings();
    const loc = s.city;
    if (!loc) {
      this.error.set('حدد مدينة أو اسمح بالوصول إلى الموقع.');
      return;
    }
    const cached = this.storage.get<PrayerDay | null>('prayer-today', null);
    const fetched = this.lastFetchedAt();
    const sameDay =
      cached && fetched && new Date(fetched).toDateString() === new Date().toDateString();
    if (!force && sameDay && cached) {
      this.today.set(cached);
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      const params = [
        `latitude=${loc.latitude}`,
        `longitude=${loc.longitude}`,
        `method=${s.method}`,
        `school=${s.school}`
      ].join('&');
      const res = await firstValueFrom(
        this.http.get<AladhanEnvelope<AladhanDay>>(`${environment.prayerApi}/timings?${params}`)
      );
      const day = this.mapDay(res.data, loc);
      this.today.set(day);
      this.storage.set('prayer-today', day);
      const now = Date.now();
      this.lastFetchedAt.set(now);
      this.storage.set('prayer-fetched', now);
    } catch {
      if (cached) {
        this.today.set(cached);
        this.error.set('تعذر تحديث المواقيت. تُعرض آخر بيانات محفوظة.');
      } else {
        this.error.set('تعذر جلب مواقيت الصلاة. تحقق من الاتصال.');
      }
    } finally {
      this.loading.set(false);
    }
  }

  async useGeolocation(): Promise<void> {
    if (!navigator.geolocation) {
      this.error.set('المتصفح لا يدعم تحديد الموقع.');
      return;
    }
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
    }).catch(() => null);
    if (!pos) {
      this.error.set('رُفض إذن الموقع. يمكنك اختيار المدينة يدويًا.');
      return;
    }
    const nearest = this.nearestCity(pos.coords.latitude, pos.coords.longitude);
    this.patchSettings({
      useGeolocation: true,
      city: {
        name: nearest ? nearest.name : 'موقعك الحالي',
        country: nearest?.country ?? '',
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }
    });
    await this.loadToday(true);
  }

  prayerLabel(key: PrayerKey): string {
    const map: Record<PrayerKey, string> = {
      Fajr: 'الفجر',
      Sunrise: 'الشروق',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء'
    };
    return map[key];
  }

  parseTime(hhmm: string, base = new Date()): Date {
    const [h, m] = hhmm.split(' ')[0].split(':').map(Number);
    const d = new Date(base);
    d.setHours(h, m, 0, 0);
    return d;
  }

  remaining(to: Date): string {
    const diff = to.getTime() - Date.now();
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

  findNext(timings: PrayerTimings): { key: PrayerKey; at: Date } | null {
    const now = new Date();
    for (const key of ORDER) {
      if (key === 'Sunrise') {
        continue;
      }
      const at = this.parseTime(timings[key], now);
      if (at.getTime() > now.getTime()) {
        return { key, at };
      }
    }
    const tomorrowFajr = this.parseTime(timings.Fajr, now);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    return { key: 'Fajr', at: tomorrowFajr };
  }

  private nearestCity(lat: number, lng: number): CityOption | null {
    let best: CityOption | null = null;
    let dist = Infinity;
    for (const city of this.cities) {
      const d = (city.latitude - lat) ** 2 + (city.longitude - lng) ** 2;
      if (d < dist) {
        dist = d;
        best = city;
      }
    }
    return best;
  }

  private mapDay(data: AladhanDay, loc: CityOption): PrayerDay {
    return {
      timings: {
        Fajr: data.timings.Fajr,
        Sunrise: data.timings.Sunrise,
        Dhuhr: data.timings.Dhuhr,
        Asr: data.timings.Asr,
        Maghrib: data.timings.Maghrib,
        Isha: data.timings.Isha
      },
      date: {
        readable: data.date.readable,
        gregorian: `${data.date.gregorian.day} ${data.date.gregorian.month.en} ${data.date.gregorian.year}`,
        hijri: `${data.date.hijri.day} ${data.date.hijri.month.ar} ${data.date.hijri.year}`,
        hijriMonth: data.date.hijri.month.ar,
        hijriWeekday: data.date.hijri.weekday.ar
      },
      meta: {
        method: data.meta.method.name,
        school: data.meta.school,
        timezone: data.meta.timezone,
        latitude: loc.latitude,
        longitude: loc.longitude
      }
    };
  }
}

interface AladhanDay {
  timings: PrayerTimings;
  date: {
    readable: string;
    gregorian: { day: string; month: { en: string }; year: string };
    hijri: {
      day: string;
      month: { ar: string; en: string; number: number };
      year: string;
      weekday: { ar: string };
    };
  };
  meta: { method: { name: string }; school: string; timezone: string };
}
