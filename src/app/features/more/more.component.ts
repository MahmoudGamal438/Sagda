import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstallService } from '../../core/services/install.service';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page">
      <h1 class="page-title">المزيد</h1>
      <nav class="grid">
        @for (l of links; track l.path) {
          <a class="card item" [routerLink]="l.path">{{ l.label }}</a>
        }
      </nav>
      @if (!install.installed()) {
        <button class="btn btn-gold" type="button" (click)="install.openFromSettings()">تثبيت سجدة</button>
      }
    </section>
  `,
  styles: [`
    .grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
    .item { padding: 1rem; }
  `]
})
export class MoreComponent {
  readonly install = inject(InstallService);
  readonly links = [
    { path: '/quran/listen', label: 'التلاوات' },
    { path: '/quran/tafsir', label: 'التفسير' },
    { path: '/quran/khatma', label: 'الختمة والورد' },
    { path: '/reminders', label: 'التذكيرات' },
    { path: '/qibla', label: 'القبلة' },
    { path: '/calendar', label: 'التقويم الهجري' },
    { path: '/asma', label: 'أسماء الله الحسنى' },
    { path: '/favorites', label: 'المفضلة' },
    { path: '/stats', label: 'الإحصائيات' },
    { path: '/search', label: 'البحث' },
    { path: '/zakat', label: 'حاسبة الزكاة' },
    { path: '/settings', label: 'الإعدادات' },
    { path: '/offline', label: 'العمل دون اتصال' }
  ];
}
