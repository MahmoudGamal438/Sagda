import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { PrayerService } from '../../core/services/prayer.service';
import { compassDelta, qiblaBearing } from '../../core/utils/qibla.util';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-qibla',
  standalone: true,
  imports: [IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">اتجاه القبلة</h1>
      <p class="page-sub">
        يُحسب الاتجاه جغرافيًا نحو الكعبة المشرفة. البوصلة تعتمد على حسّاس الجهاز وقد تتأثر بالمجالات
        المغناطيسية، ويُستحسن معايرتها (تحريك الجهاز بشكل رقم 8).
      </p>

      @if (city(); as c) {
        <p class="chip"><app-icon name="pin" /> {{ c.name }}</p>
      } @else {
        <p class="chip">لم يُحدّد الموقع بعد</p>
      }

      <div class="compass-wrap">
        <div class="compass">
          <div class="rose">
            <span class="n">ش</span>
            <span class="e">ق</span>
            <span class="s">ج</span>
            <span class="w">غ</span>
          </div>
          <div class="needle" [style.transform]="'rotate(' + needle() + 'deg)'">
            <app-icon name="qibla" />
          </div>
          <div class="center"></div>
        </div>
        <p class="bearing"><strong>{{ bearing().toFixed(0) }}°</strong> من الشمال الحقيقي</p>
      </div>

      @if (heading() === null) {
        <article class="card note">
          <p>
            لم يُرصد مستشعر اتجاه الجهاز. يمكنك الاعتماد على الرقم المحسوب أعلاه، أو تفعيل البوصلة.
            بعض المتصفحات تتطلب HTTPS وموافقة صريحة.
          </p>
          <button class="btn btn-gold" type="button" (click)="request()">
            <app-icon name="gps" /> تفعيل البوصلة
          </button>
        </article>
      } @else {
        <p class="muted">اتجاه الجهاز الحالي: {{ heading()!.toFixed(0) }}°</p>
      }

      <div class="actions">
        <button class="btn btn-primary" type="button" (click)="updateLocation()">
          <app-icon name="gps" /> تحديث الموقع
        </button>
        <p class="muted small">تُطلب صلاحية الموقع عند الضغط فقط. يمكنك اختيار مدينتك يدويًا من الأعلى.</p>
      </div>
    </section>
  `,
  styles: [
    `
      .compass-wrap { display: grid; justify-items: center; gap: 0.6rem; margin: 1.2rem 0; }
      .compass {
        position: relative; width: 260px; height: 260px; border-radius: 50%;
        border: 2px solid color-mix(in srgb, var(--color-gold) 45%, transparent);
        background:
          radial-gradient(closest-side, var(--color-surface-strong) 70%, transparent 72%),
          conic-gradient(from -90deg, color-mix(in srgb, var(--color-gold) 22%, transparent), transparent 25%, color-mix(in srgb, var(--color-gold) 22%, transparent) 50%, transparent 75%, color-mix(in srgb, var(--color-gold) 22%, transparent));
        box-shadow: var(--shadow-md);
      }
      .rose { position: absolute; inset: 0; }
      .rose span { position: absolute; font-weight: 800; color: var(--color-muted); font-size: 0.85rem; }
      .rose .n { top: 8px; left: 50%; transform: translateX(-50%); color: var(--color-gold); }
      .rose .s { bottom: 8px; left: 50%; transform: translateX(-50%); }
      .rose .e { inset-inline-start: 10px; top: 50%; transform: translateY(-50%); }
      .rose .w { inset-inline-end: 10px; top: 50%; transform: translateY(-50%); }
      .needle {
        position: absolute; inset: 0; display: grid; place-items: start center;
        padding-top: 24px; transition: transform 0.25s ease;
      }
      .needle app-icon { width: 2.4rem; height: 2.4rem; color: var(--color-gold); filter: drop-shadow(0 4px 10px rgba(232, 200, 117, 0.5)); }
      .center { position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; border-radius: 50%; background: var(--color-gold); transform: translate(-50%, -50%); }
      .bearing { margin: 0; color: var(--color-muted); }
      .bearing strong { font-size: 1.6rem; color: var(--color-gold); }
      .note { padding: 1rem; margin-top: 1rem; display: grid; gap: 0.7rem; }
      .note p { margin: 0; line-height: 1.9; }
      .actions { margin-top: 1rem; display: grid; gap: 0.5rem; justify-items: start; }
      .small { font-size: 0.78rem; max-width: 460px; line-height: 1.8; }
    `
  ]
})
export class QiblaComponent implements OnDestroy {
  readonly prayer = inject(PrayerService);
  heading = signal<number | null>(null);
  private handler?: (e: DeviceOrientationEvent) => void;

  readonly city = computed(() => this.prayer.settings().city);
  readonly bearing = computed(() => {
    const c = this.city();
    return c ? qiblaBearing(c.latitude, c.longitude) : 0;
  });
  readonly needle = computed(() => {
    const h = this.heading();
    return h === null ? this.bearing() : compassDelta(h, this.bearing());
  });

  async request(): Promise<void> {
    try {
      const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (DOE.requestPermission) {
        const res = await DOE.requestPermission();
        if (res !== 'granted') {
          return;
        }
      }
      this.handler = (e: DeviceOrientationEvent) => {
        const anyE = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
        const value = anyE.webkitCompassHeading ?? (typeof e.alpha === 'number' ? 360 - e.alpha : null);
        if (value !== null) {
          this.heading.set(value);
        }
      };
      window.addEventListener('deviceorientation', this.handler);
    } catch {
      this.heading.set(null);
    }
  }

  async updateLocation(): Promise<void> {
    await this.prayer.useGeolocation();
  }

  ngOnDestroy(): void {
    if (this.handler) {
      window.removeEventListener('deviceorientation', this.handler);
    }
  }
}
