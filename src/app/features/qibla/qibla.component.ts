import { Component, inject, OnDestroy, signal } from '@angular/core';
import { PrayerService } from '../../core/services/prayer.service';
import { compassDelta, qiblaBearing } from '../../core/utils/qibla.util';

@Component({
  selector: 'app-qibla',
  standalone: true,
  template: `
    <section class="page">
      <h1 class="page-title">اتجاه القبلة</h1>
      <p class="page-sub">الاتجاه محسوب جغرافيًا نحو الكعبة. البوصلة تحتاج معايرة وقد لا تتوفر في كل الأجهزة.</p>
      @if (city(); as c) {
        <p>الموقع المستخدم: {{ c.name }}</p>
        <p>اتجاه القبلة من الإحداثيات: {{ bearing().toFixed(0) }}°</p>
      }
      <div class="compass">
        <div class="needle" [style.transform]="'rotate(' + needle() + 'deg)'">⬆</div>
      </div>
      @if (heading() === null) {
        <p class="muted">لم يُرصد مستشعر الاتجاه. استخدم الرقم المحسوب أعلاه، أو فعّل أذونات الحركة على الهاتف.</p>
        <button class="btn btn-primary" type="button" (click)="request()">تفعيل البوصلة</button>
      } @else {
        <p>اتجاه الجهاز: {{ heading()!.toFixed(0) }}°</p>
      }
      <button class="btn btn-ghost" type="button" (click)="prayer.useGeolocation()">تحديث الموقع</button>
    </section>
  `,
  styles: [`
    .compass {
      width: 220px; height: 220px; margin: 1.2rem auto; border-radius: 50%;
      border: 8px solid var(--color-emerald-800); display: grid; place-items: center;
      background: radial-gradient(circle, var(--color-ivory), var(--color-sand));
    }
    .needle { font-size: 3rem; color: var(--color-gold-700); transition: transform 0.2s; }
  `]
})
export class QiblaComponent implements OnDestroy {
  readonly prayer = inject(PrayerService);
  heading = signal<number | null>(null);
  private handler?: (e: DeviceOrientationEvent) => void;

  city = () => this.prayer.settings().city;
  bearing = () => {
    const c = this.city();
    return c ? qiblaBearing(c.latitude, c.longitude) : 0;
  };
  needle = () => {
    const h = this.heading();
    return h === null ? this.bearing() : compassDelta(h, this.bearing());
  };

  async request(): Promise<void> {
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (DOE.requestPermission) {
      await DOE.requestPermission();
    }
    this.handler = (e: DeviceOrientationEvent) => {
      const anyE = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
      const value = anyE.webkitCompassHeading ?? (typeof e.alpha === 'number' ? 360 - e.alpha : null);
      if (value !== null) {
        this.heading.set(value);
      }
    };
    window.addEventListener('deviceorientation', this.handler);
  }

  ngOnDestroy(): void {
    if (this.handler) {
      window.removeEventListener('deviceorientation', this.handler);
    }
  }
}
