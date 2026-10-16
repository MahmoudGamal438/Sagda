import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrayerService } from '../../core/services/prayer.service';
import { NotificationService } from '../../core/services/notification.service';
import { SettingsService } from '../../core/services/settings.service';
import { AdhanSound, PrayerKey } from '../../core/models/prayer.model';
import { ADHAN_VOICES } from '../../core/data/adhan-voices.data';
import { StateBlockComponent } from '../../shared/state-block.component';
import { IconComponent } from '../../shared/icon.component';

type AlertKey = Exclude<PrayerKey, 'Sunrise'>;

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [FormsModule, DatePipe, StateBlockComponent, IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">مواقيت الصلاة والأذان</h1>
      <p class="page-sub">
        الحساب عبر Aladhan بمصادر فلكية، والشروق يُعرض منفصلًا لأنه ليس صلاة مفروضة.
      </p>

      <article class="card pad">
        <div class="row wrap">
          <label class="field grow">
            <span>المدينة</span>
            <select [ngModel]="prayer.settings().city?.name" (ngModelChange)="onCity($event)">
              @for (c of prayer.cities; track c.name) {
                <option [value]="c.name">{{ c.name }} · {{ c.country }}</option>
              }
            </select>
          </label>
          <button class="btn btn-gold" type="button" (click)="geo()">
            <app-icon name="gps" /> موقعي
          </button>
          <button class="btn btn-ghost" type="button" (click)="prayer.loadToday(true)">
            <app-icon name="refresh" /> تحديث
          </button>
        </div>
        <div class="row wrap">
          <label class="field grow">
            <span>طريقة الحساب</span>
            <select [ngModel]="prayer.settings().method" (ngModelChange)="onMethod($event)">
              @for (m of prayer.methods; track m.id) {
                <option [ngValue]="m.id">{{ m.name }}</option>
              }
            </select>
          </label>
          <label class="field grow">
            <span>مذهب العصر</span>
            <select [ngModel]="prayer.settings().school" (ngModelChange)="onSchool($event)">
              <option [ngValue]="0">شافعي / مالكي / حنبلي</option>
              <option [ngValue]="1">حنفي</option>
            </select>
          </label>
          <label class="field grow">
            <span>صيغة الوقت</span>
            <select [ngModel]="prayer.settings().use24Hour" (ngModelChange)="setFormat($event)">
              <option [ngValue]="true">24 ساعة</option>
              <option [ngValue]="false">12 ساعة (ص/م)</option>
            </select>
          </label>
        </div>
        @if (prayer.settings().city; as c) {
          <p class="muted small">
            الإحداثيات: {{ c.latitude.toFixed(3) }}, {{ c.longitude.toFixed(3) }}
            @if (prayer.today()?.meta?.timezone; as tz) {
              · المنطقة الزمنية: {{ tz }}
            }
          </p>
        }
      </article>

      @if (prayer.loading()) {
        <app-state-block kind="loading" title="جارٍ الحساب" message="يتم جلب المواقيت من المصدر." />
      }
      @if (prayer.error()) {
        <app-state-block kind="error" title="تنبيه" [message]="prayer.error()!" />
      }

      @if (prayer.today(); as day) {
        <article class="card pad">
          <div class="day-head">
            <div>
              <strong>{{ day.date.hijriWeekday }} {{ day.date.hijri }}</strong>
              <p class="muted small">{{ day.date.gregorian }}</p>
            </div>
            @if (prayer.lastFetchedAt(); as t) {
              <span class="chip">آخر تحديث: {{ t | date: 'shortTime' }}</span>
            }
          </div>

          <div class="times">
            @for (key of keys; track key) {
              <div class="t-card" [class.event]="key === 'Sunrise'">
                <app-icon [name]="iconFor(key)" />
                <span class="t-name">{{ prayer.prayerLabel(key) }}</span>
                <strong class="t-time">{{ prayer.formatTimeValue(key) }}</strong>
              </div>
            }
          </div>
        </article>

        <article class="card pad">
          <h2 class="h">التنبيهات والأذان</h2>
          <p class="muted small">
            تعمل داخل الموقع المفتوح، ومع إشعارات المتصفح عند منح الإذن. التشغيل في الخلفية بعد إغلاق
            التطبيق يحتاج خادم إشعارات ولم يُفعّل.
          </p>

          <div class="row wrap">
            <button class="btn btn-primary" type="button" (click)="notify.requestPermission()">
              <app-icon name="bell" /> طلب إذن الإشعارات
            </button>
            <span class="chip">
              حالة الإذن:
              {{ notify.permission() === 'granted' ? 'ممنوح' : notify.permission() === 'denied' ? 'مرفوض' : 'غير محدّد' }}
            </span>
          </div>

          <div class="row wrap volume">
            <label class="field grow">
              <span>مستوى الصوت ({{ (settings.settings().alertVolume * 100).toFixed(0) }}%)</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                [ngModel]="settings.settings().alertVolume"
                (ngModelChange)="settings.patch({ alertVolume: $event })"
              />
            </label>
            <label class="field grow">
              <span>صوت الأذان</span>
              <select [ngModel]="settings.settings().adhanVoice" (ngModelChange)="pickAdhan($event)">
                @for (v of adhanVoices; track v.id) {
                  <option [value]="v.id">{{ v.muezzin }} — {{ v.place }}</option>
                }
              </select>
            </label>
            <button class="btn btn-gold" type="button" (click)="notify.testAdhan()">
              <app-icon name="play" /> تجربة الأذان
            </button>
            <button class="btn btn-ghost" type="button" (click)="notify.testSound('short')">
              <app-icon name="bell" /> تجربة النغمة
            </button>
          </div>
          <p class="muted small">مؤذنون مصريون: رفعت، النقشبندي، عبد الباسط، الحصري، المنشاوي وغيرهم.</p>

          <div class="alerts">
            @for (key of alertKeys; track key) {
              <div class="alert-row">
                <div class="a-head">
                  <label class="switch">
                    <input
                      type="checkbox"
                      [checked]="prayer.settings().alerts[key].enabled"
                      (change)="updateAlert(key, { enabled: $any($event.target).checked })"
                    />
                    <span>{{ prayer.prayerLabel(key) }}</span>
                  </label>
                </div>
                <div class="a-body">
                  <label class="mini">
                    <span>قبل الصلاة</span>
                    <select
                      [ngModel]="prayer.settings().alerts[key].minutesBefore"
                      (ngModelChange)="updateAlert(key, { minutesBefore: +$event })"
                    >
                      @for (m of beforeOptions; track m) {
                        <option [ngValue]="m">{{ m === 0 ? 'بدون' : m + ' د' }}</option>
                      }
                    </select>
                  </label>
                  <label class="mini">
                    <span>الإقامة</span>
                    <select
                      [ngModel]="prayer.settings().alerts[key].iqamaMinutes"
                      (ngModelChange)="updateAlert(key, { iqamaMinutes: +$event })"
                    >
                      @for (m of iqamaOptions; track m) {
                        <option [ngValue]="m">{{ m === 0 ? 'بدون' : m + ' د' }}</option>
                      }
                    </select>
                  </label>
                  <label class="mini">
                    <span>الصوت</span>
                    <select
                      [ngModel]="prayer.settings().alerts[key].sound"
                      (ngModelChange)="updateAlert(key, { sound: $event })"
                    >
                      @for (s of prayer.sounds; track s.id) {
                        <option [ngValue]="s.id">{{ s.name }}</option>
                      }
                    </select>
                  </label>
                  <button class="btn btn-ghost mini-btn" type="button" (click)="notify.testSound(prayer.settings().alerts[key].sound)">
                    <app-icon name="play" />
                  </button>
                </div>
              </div>
            }
          </div>
        </article>
      }
    </section>
  `,
  styles: [
    `
      .pad { padding: 1.1rem; display: grid; gap: 0.9rem; margin-bottom: 1rem; }
      .row { display: flex; gap: 0.6rem; align-items: flex-end; }
      .wrap { flex-wrap: wrap; }
      .grow { flex: 1 1 180px; }
      .field { display: grid; gap: 0.25rem; font-size: 0.85rem; color: var(--color-muted); }
      select, input { min-height: 42px; width: 100%; }
      .small { font-size: 0.78rem; }
      .day-head { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; flex-wrap: wrap; }
      .times { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.6rem; }
      .t-card {
        display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
        padding: 0.9rem 0.4rem; border-radius: var(--radius-sm); text-align: center;
        background: color-mix(in srgb, var(--color-gold) 7%, transparent);
        border: 1px solid color-mix(in srgb, var(--color-gold) 18%, transparent);
      }
      .t-card app-icon { color: var(--color-gold); }
      .t-card.event { background: transparent; opacity: 0.85; }
      .t-name { font-size: 0.82rem; color: var(--color-muted); font-weight: 600; }
      .t-time { font-size: 1.2rem; font-variant-numeric: tabular-nums; }
      .h { margin: 0; font-size: 1.1rem; }
      .volume { margin-top: 0.3rem; }
      .alerts { display: grid; gap: 0.6rem; }
      .alert-row {
        padding: 0.7rem 0.8rem; border-radius: var(--radius-sm);
        border: 1px solid var(--color-line); display: grid; gap: 0.6rem;
      }
      .a-head .switch { display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 700; }
      .a-head input { width: 18px; height: 18px; }
      .a-body { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)) auto; gap: 0.5rem; align-items: end; }
      .mini { display: grid; gap: 0.2rem; font-size: 0.72rem; color: var(--color-muted); }
      .mini select { min-height: 38px; font-size: 0.82rem; }
      .mini-btn { min-height: 38px; padding: 0 0.8rem; align-self: end; }
      input[type='range'] { min-height: auto; }

      @media (max-width: 560px) {
        .a-body { grid-template-columns: 1fr 1fr; }
        .mini-btn { grid-column: span 2; }
      }
    `
  ]
})
export class PrayerTimesComponent implements OnInit {
  readonly prayer = inject(PrayerService);
  readonly notify = inject(NotificationService);
  readonly settings = inject(SettingsService);

  readonly keys: PrayerKey[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  readonly alertKeys: AlertKey[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  readonly beforeOptions = [0, 5, 10, 15, 20, 30];
  readonly iqamaOptions = [0, 5, 10, 15, 20];
  readonly adhanVoices = ADHAN_VOICES;

  pickAdhan(id: string): void {
    this.settings.patch({ adhanVoice: id });
    this.notify.testAdhan(id);
  }

  ngOnInit(): void {
    void this.prayer.loadToday();
  }

  iconFor(key: PrayerKey): string {
    const map: Record<PrayerKey, string> = {
      Fajr: 'sunrise',
      Sunrise: 'sunrise',
      Dhuhr: 'sun',
      Asr: 'sun',
      Maghrib: 'sunset',
      Isha: 'moon'
    };
    return map[key];
  }

  onCity(name: string): void {
    const city = this.prayer.cities.find((c) => c.name === name);
    if (city) {
      this.prayer.patchSettings({ city, useGeolocation: false });
      void this.prayer.loadToday(true);
    }
  }

  onMethod(method: number): void {
    this.prayer.patchSettings({ method: +method });
    void this.prayer.loadToday(true);
  }

  onSchool(school: 0 | 1): void {
    this.prayer.patchSettings({ school: +school as 0 | 1 });
    void this.prayer.loadToday(true);
  }

  setFormat(value: boolean): void {
    this.prayer.patchSettings({ use24Hour: value === true || value === ('true' as unknown as boolean) });
  }

  async geo(): Promise<void> {
    await this.prayer.useGeolocation();
  }

  updateAlert(key: AlertKey, partial: Partial<{ enabled: boolean; minutesBefore: number; sound: AdhanSound; iqamaMinutes: number }>): void {
    const alerts = {
      ...this.prayer.settings().alerts,
      [key]: { ...this.prayer.settings().alerts[key], ...partial }
    };
    this.prayer.patchSettings({ alerts });
  }
}
