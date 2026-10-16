import { Injectable, inject, signal } from '@angular/core';
import { PrayerService } from './prayer.service';
import { UserDataService } from './user-data.service';
import { SettingsService } from './settings.service';
import { AdhanSound, PrayerKey } from '../models/prayer.model';
import { findAdhanVoice } from '../data/adhan-voices.data';

type AlertKey = Exclude<PrayerKey, 'Sunrise'>;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly permission = signal<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  readonly inAppAlert = signal<string | null>(null);
  readonly prayerAlertsEnabled = signal(
    localStorage.getItem('sujda:prayer-alerts') !== 'off'
  );

  private prayer = inject(PrayerService);
  private user = inject(UserDataService);
  private settings = inject(SettingsService);

  private fired = new Set<string>();
  private timer: number | null = null;
  private adhanCache = new Map<string, HTMLAudioElement>();

  constructor() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('sujda:fired-alerts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { day: string; keys: string[] };
        if (parsed.day === today) {
          parsed.keys.forEach((k) => this.fired.add(k));
        }
      } catch {
        /* ignore */
      }
    }
  }

  setPrayerAlerts(enabled: boolean): void {
    this.prayerAlertsEnabled.set(enabled);
    localStorage.setItem('sujda:prayer-alerts', enabled ? 'on' : 'off');
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      this.permission.set('denied');
      return 'denied';
    }
    const result = await Notification.requestPermission();
    this.permission.set(result);
    return result;
  }

  startWatch(): void {
    if (this.timer) {
      return;
    }
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 30000);
  }

  testSound(sound: AdhanSound = 'short'): void {
    this.playSound(sound);
    this.showInApp('هذا اختبار لصوت التنبيه.');
  }

  testAdhan(voiceId?: string): void {
    const id = voiceId ?? this.settings.settings().adhanVoice;
    const voice = findAdhanVoice(id);
    this.playAdhanFile(voice.file, this.settings.settings().alertVolume);
    this.showInApp(`تجربة صوت الأذان: ${voice.muezzin}`);
  }

  stopAdhan(): void {
    this.adhanCache.forEach((a) => a.pause());
  }

  private tick(): void {
    this.checkPrayers();
    this.checkReminders();
  }

  private checkPrayers(): void {
    if (!this.prayerAlertsEnabled()) {
      return;
    }
    const day = this.prayer.today();
    if (!day) {
      return;
    }
    const keys: AlertKey[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const now = Date.now();
    for (const key of keys) {
      const setting = this.prayer.settings().alerts[key];
      if (!setting.enabled) {
        continue;
      }
      const at = this.prayer.parseTime(day.timings[key]).getTime();
      const label = this.prayer.prayerLabel(key);
      if (setting.minutesBefore > 0) {
        this.maybeFire(
          `before-${key}`,
          at - setting.minutesBefore * 60000,
          now,
          `تبقّى ${setting.minutesBefore} دقائق على صلاة ${label}`,
          setting.sound
        );
      }
      this.maybeFire(`at-${key}`, at, now, `حان الآن وقت صلاة ${label}`, setting.sound);
      if (setting.iqamaMinutes > 0) {
        this.maybeFire(
          `iqama-${key}`,
          at + setting.iqamaMinutes * 60000,
          now,
          `الإقامة الآن لصلاة ${label}`,
          'short'
        );
      }
    }
  }

  private checkReminders(): void {
    const now = new Date();
    for (const reminder of this.user.reminders()) {
      if (!reminder.enabled) {
        continue;
      }
      if (!reminder.days.includes(now.getDay())) {
        continue;
      }
      if (now.getHours() !== reminder.hour || now.getMinutes() !== reminder.minute) {
        continue;
      }
      this.maybeFire(
        `rem-${reminder.id}-${now.toDateString()}`,
        now.getTime(),
        now.getTime(),
        reminder.message,
        reminder.sound ? 'short' : 'silent'
      );
    }
  }

  private maybeFire(
    id: string,
    target: number,
    now: number,
    message: string,
    sound: AdhanSound
  ): void {
    if (this.fired.has(id)) {
      return;
    }
    if (now < target || now - target > 60000) {
      return;
    }
    this.fired.add(id);
    localStorage.setItem(
      'sujda:fired-alerts',
      JSON.stringify({ day: new Date().toDateString(), keys: [...this.fired] })
    );
    this.showInApp(message);
    if (this.permission() === 'granted') {
      try {
        new Notification('سجدة', { body: message, icon: 'icons/icon-192.png', tag: id });
      } catch {
        /* ignore */
      }
    }
    this.playSound(sound);
  }

  private playSound(sound: AdhanSound): void {
    if (sound === 'silent') {
      return;
    }
    const volume = Math.min(1, Math.max(0, this.settings.settings().alertVolume));
    if (sound === 'athan') {
      const voice = findAdhanVoice(this.settings.settings().adhanVoice);
      this.playAdhanFile(voice.file, volume);
      return;
    }
    this.beep(volume);
  }

  private playAdhanFile(file: string, volume: number): void {
    try {
      let audio = this.adhanCache.get(file);
      if (!audio) {
        audio = new Audio(file);
        audio.preload = 'auto';
        this.adhanCache.set(file, audio);
      }
      audio.currentTime = 0;
      audio.volume = Math.min(1, Math.max(0, volume));
      void audio.play().catch(() => this.beep(volume));
    } catch {
      this.beep(volume);
    }
  }

  private showInApp(message: string): void {
    this.inAppAlert.set(message);
    window.setTimeout(() => {
      if (this.inAppAlert() === message) {
        this.inAppAlert.set(null);
      }
    }, 8000);
  }

  private beep(volume = 0.05): void {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 660;
      gain.gain.value = Math.min(0.3, volume * 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      /* ignore */
    }
  }
}
