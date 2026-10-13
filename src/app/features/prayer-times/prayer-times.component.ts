import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrayerService } from '../../core/services/prayer.service';
import { NotificationService } from '../../core/services/notification.service';
import { PrayerKey } from '../../core/models/prayer.model';
import { StateBlockComponent } from '../../shared/state-block.component';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [FormsModule, DatePipe, StateBlockComponent],
  template: `
    <section class="page">
      <h1 class="page-title">مواقيت الصلاة</h1>
      <p class="page-sub">الحساب عبر Aladhan. الشروق ليس صلاة مفروضة مستقلة.</p>

      <div class="card pad">
        <label>المدينة
          <select [ngModel]="prayer.settings().city?.name" (ngModelChange)="onCity($event)">
            @for (c of prayer.cities; track c.name) {
              <option [value]="c.name">{{ c.name }} · {{ c.country }}</option>
            }
          </select>
        </label>
        <button class="btn btn-ghost" type="button" (click)="geo()">استخدم موقعي</button>
        <label>المذهب (أثر العصر)
          <select [ngModel]="prayer.settings().school" (ngModelChange)="onSchool($event)">
            <option [ngValue]="0">شافعي / مالكي / حنبلي</option>
            <option [ngValue]="1">حنفي</option>
          </select>
        </label>
      </div>

      @if (prayer.loading()) {
        <app-state-block kind="loading" title="جارٍ الحساب" message="يتم جلب المواقيت." />
      }
      @if (prayer.error()) {
        <app-state-block kind="error" title="تنبيه" [message]="prayer.error()!" />
      }
      @if (prayer.today(); as day) {
        <article class="card pad">
          <p>{{ day.date.hijriWeekday }} {{ day.date.hijri }}</p>
          <p class="muted">{{ day.date.gregorian }}</p>
          @if (prayer.lastFetchedAt(); as t) {
            <p class="muted">آخر تحديث: {{ t | date: 'short' }}</p>
          }
          @for (key of keys; track key) {
            <div class="slot">
              <strong>{{ prayer.prayerLabel(key) }}</strong>
              <span>{{ day.timings[key].slice(0, 5) }}</span>
            </div>
          }
        </article>
        <article class="card pad">
          <h2>تنبيهات الصلاة</h2>
          <p class="muted">تعمل داخل الموقع المفتوح، وإشعارات المتصفح إن مُنحت.</p>
          <button class="btn btn-primary" type="button" (click)="notify.requestPermission()">طلب إذن الإشعارات</button>
          <p>حالة الإذن: {{ notify.permission() }}</p>
          <button class="btn btn-ghost" type="button" (click)="notify.testSound()">اختبار الصوت</button>
          @for (key of alertKeys; track key) {
            <label class="switch">
              <input type="checkbox" [checked]="prayer.settings().alerts[key].enabled" (change)="toggleAlert(key, $event)" />
              تنبيه {{ prayer.prayerLabel(key) }}
            </label>
          }
        </article>
      }
    </section>
  `,
  styles: [`
    .pad { padding: 1rem; display: grid; gap: 0.7rem; margin-bottom: 1rem; }
    .slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      padding: 0.75rem 0.4rem;
      border-bottom: 1px solid var(--color-line);
      text-align: center;
    }
    .slot strong { color: var(--color-muted); font-weight: 600; }
    .slot span { font-size: 1.25rem; font-weight: 800; }
    select, input { min-height: 42px; }
  `]
})
export class PrayerTimesComponent implements OnInit {
  readonly prayer = inject(PrayerService);
  readonly notify = inject(NotificationService);
  readonly keys: PrayerKey[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  readonly alertKeys: Array<'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'> = [
    'Fajr',
    'Dhuhr',
    'Asr',
    'Maghrib',
    'Isha'
  ];

  ngOnInit(): void {
    void this.prayer.loadToday();
  }

  onCity(name: string): void {
    const city = this.prayer.cities.find((c) => c.name === name);
    if (city) {
      this.prayer.patchSettings({ city, useGeolocation: false });
      void this.prayer.loadToday(true);
    }
  }

  onSchool(school: 0 | 1): void {
    this.prayer.patchSettings({ school });
    void this.prayer.loadToday(true);
  }

  async geo(): Promise<void> {
    try {
      await this.prayer.useGeolocation();
    } catch {
      this.prayer.error.set('رُفض إذن الموقع. اختر المدينة يدويًا.');
    }
  }

  toggleAlert(key: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha', e: Event): void {
    const enabled = (e.target as HTMLInputElement).checked;
    const alerts = {
      ...this.prayer.settings().alerts,
      [key]: { ...this.prayer.settings().alerts[key], enabled }
    };
    this.prayer.patchSettings({ alerts });
  }
}
