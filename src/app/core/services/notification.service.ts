import { Injectable, signal } from '@angular/core';
import { PrayerService } from './prayer.service';
import { UserDataService } from './user-data.service';
import { PrayerKey } from '../models/prayer.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly permission = signal<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  readonly inAppAlert = signal<string | null>(null);
  readonly prayerAlertsEnabled = signal(
    localStorage.getItem('sujda:prayer-alerts') !== 'off'
  );

  private fired = new Set<string>();
  private timer: number | null = null;

  constructor(
    private prayer: PrayerService,
    private user: UserDataService
  ) {
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

  testSound(): void {
    this.beep();
    this.showInApp('هذا اختبار لصوت التنبيه.');
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
    const keys: Array<Exclude<PrayerKey, 'Sunrise'>> = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const now = Date.now();
    for (const key of keys) {
      const setting = this.prayer.settings().alerts[key];
      if (!setting.enabled) {
        continue;
      }
      const at = this.prayer.parseTime(day.timings[key]).getTime();
      const before = at - setting.minutesBefore * 60000;
      const label = this.prayer.prayerLabel(key);
      this.maybeFire(`before-${key}`, before, now, `تبقّى ${setting.minutesBefore} دقائق على صلاة ${label}`);
      this.maybeFire(`at-${key}`, at, now, `حان الآن وقت صلاة ${label}`);
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
      this.maybeFire(`rem-${reminder.id}-${now.toDateString()}`, now.getTime(), now.getTime(), reminder.message);
    }
  }

  private maybeFire(id: string, target: number, now: number, message: string): void {
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
    this.beep();
  }

  private showInApp(message: string): void {
    this.inAppAlert.set(message);
    window.setTimeout(() => {
      if (this.inAppAlert() === message) {
        this.inAppAlert.set(null);
      }
    }, 8000);
  }

  private beep(): void {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 660;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }
}
