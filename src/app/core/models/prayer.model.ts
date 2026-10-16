export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerDay {
  timings: PrayerTimings;
  date: {
    readable: string;
    gregorian: string;
    hijri: string;
    hijriMonth: string;
    hijriWeekday: string;
  };
  meta: {
    method: string;
    school: string;
    timezone: string;
    latitude: number;
    longitude: number;
  };
}

export interface CityOption {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export type PrayerKey = keyof PrayerTimings;
export type AdhanSound = 'athan' | 'short' | 'silent';

export interface PrayerAlertSetting {
  enabled: boolean;
  minutesBefore: number;
  sound: AdhanSound;
  iqamaMinutes: number;
}

export interface PrayerSettings {
  city?: CityOption;
  method: number;
  school: 0 | 1;
  adjustments: Partial<Record<PrayerKey, number>>;
  alerts: Record<Exclude<PrayerKey, 'Sunrise'>, PrayerAlertSetting>;
  useGeolocation: boolean;
  use24Hour: boolean;
}
