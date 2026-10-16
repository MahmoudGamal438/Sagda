import { Component, inject } from '@angular/core';
import { UserDataService } from '../../core/services/user-data.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">العمل دون اتصال</h1>

      <p class="status card" [class.on]="user.online()">
        <app-icon [name]="user.online() ? 'globe' : 'wifiOff'" />
        الحالة الحالية: {{ user.online() ? 'متصل بالإنترنت' : 'غير متصل' }}
      </p>

      <h2 class="h">متاح محليًا (بدون اتصال)</h2>
      <ul class="list card">
        <li><app-icon name="check" /> الواجهة والإعدادات والمظهر.</li>
        <li><app-icon name="check" /> المفضلة والعلامات والملاحظات.</li>
        <li><app-icon name="check" /> المسبحة وتقدّم الأذكار ونتائج الاختبارات.</li>
        <li><app-icon name="check" /> السور التي سبق تحميلها وآخر مواضع القراءة.</li>
        <li><app-icon name="check" /> آخر مواقيت صلاة محفوظة (تُعرض عند تعذر الإنترنت).</li>
        <li><app-icon name="check" /> قصص الأنبياء والرقية (النص المحلي) وأسماء الله الحسنى.</li>
      </ul>

      <h2 class="h">يحتاج اتصالًا بالإنترنت</h2>
      <ul class="list card warn">
        <li><app-icon name="wifiOff" /> أول تحميل لسورة لم تُحفظ بعد.</li>
        <li><app-icon name="wifiOff" /> التلاوات الصوتية والبث المباشر.</li>
        <li><app-icon name="wifiOff" /> البحث في المصحف، والتفسير، والأحاديث.</li>
        <li><app-icon name="wifiOff" /> تحديث مواقيت الصلاة وراديو القرآن.</li>
      </ul>

      <p class="muted small">
        يعتمد تخزين المحتوى دون اتصال على التخزين المؤقت للمتصفح وخدمة العملاء (Service Worker).
      </p>
    </section>
  `,
  styles: [
    `
      .status {
        display: flex; align-items: center; gap: 0.6rem; padding: 0.9rem 1rem;
        font-weight: 700; margin-bottom: 1.2rem;
        border-color: color-mix(in srgb, var(--color-danger) 30%, transparent);
      }
      .status.on { border-color: color-mix(in srgb, var(--color-success) 35%, transparent); color: var(--color-success); }
      .h { font-size: 1rem; margin: 1rem 0 0.5rem; }
      .list { list-style: none; margin: 0; padding: 0.5rem 1rem; display: grid; gap: 0.5rem; }
      .list li { display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem 0; line-height: 1.7; border-bottom: 1px solid var(--color-line); }
      .list li:last-child { border-bottom: 0; }
      .list app-icon { color: var(--color-success); flex: 0 0 auto; }
      .warn app-icon { color: var(--color-danger); }
      .small { font-size: 0.8rem; margin-top: 1rem; line-height: 1.9; }
    `
  ]
})
export class OfflineComponent {
  readonly user = inject(UserDataService);
}
