import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService, DEFAULT_DUA } from '../../core/services/settings.service';
import { InstallService } from '../../core/services/install.service';
import { QuranService } from '../../core/services/quran.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page">
      <h1 class="page-title">الإعدادات</h1>
      <article class="card pad">
        <h2>المظهر</h2>
        <select [ngModel]="s.settings().theme" (ngModelChange)="s.patch({ theme: $event })">
          <option value="system">حسب النظام</option>
          <option value="light">فاتح</option>
          <option value="dark">داكن</option>
        </select>
        <label>حجم خط المصحف {{ s.settings().quranFontSize }}
          <input type="range" min="18" max="48" [ngModel]="s.settings().quranFontSize" (ngModelChange)="s.patch({ quranFontSize: $event })" />
        </label>
        <label>تباعد الأسطر
          <input type="range" min="1.6" max="3" step="0.1" [ngModel]="s.settings().quranLineHeight" (ngModelChange)="s.patch({ quranLineHeight: $event })" />
        </label>
        <label><input type="checkbox" [ngModel]="s.settings().showTranslation" (ngModelChange)="s.patch({ showTranslation: $event })" /> عرض الترجمة بجانب الآيات</label>
      </article>
      <article class="card pad">
        <h2>القارئ</h2>
        <select [ngModel]="s.settings().reciterId" (ngModelChange)="s.patch({ reciterId: $event })">
          @for (r of quran.reciters; track r.id) {
            <option [value]="r.id">{{ r.name }}</option>
          }
        </select>
      </article>
      <article class="card pad">
        <h2>شاشة الترحيب</h2>
        <p class="muted">تظهر رسالة الترحيب تلقائيًا في كل مرة يتم فتح الموقع. الدعاء شخصي وليس قرآنًا ولا حديثًا.</p>
        <textarea [ngModel]="s.settings().personalDua" (ngModelChange)="s.patch({ personalDua: $event })" rows="4"></textarea>
        <button class="btn btn-ghost" type="button" (click)="s.resetDua()">استعادة النص الافتراضي</button>
      </article>
      <article class="card pad">
        <h2>الأذكار والمسبحة</h2>
        <label><input type="checkbox" [ngModel]="s.settings().autoNextDhikr" (ngModelChange)="s.patch({ autoNextDhikr: $event })" /> انتقال تلقائي بعد اكتمال العدد</label>
        <label><input type="checkbox" [ngModel]="s.settings().tasbeehVibrate" (ngModelChange)="s.patch({ tasbeehVibrate: $event })" /> اهتزاز عند اكتمال الهدف</label>
      </article>
      <article class="card pad">
        <h2>تثبيت التطبيق</h2>
        @if (install.installed()) {
          <p>التطبيق يعمل في وضع مستقل.</p>
        } @else if (install.isIos) {
          <p>على iPhone/iPad: زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».</p>
        } @else {
          <button class="btn btn-gold" type="button" (click)="install.openFromSettings()">إظهار خيار التثبيت</button>
        }
      </article>
    </section>
  `,
  styles: [`
    .pad { padding: 1rem; display: grid; gap: 0.6rem; margin-bottom: 1rem; }
    textarea, select { width: 100%; }
  `]
})
export class SettingsComponent {
  readonly s = inject(SettingsService);
  readonly install = inject(InstallService);
  readonly quran = inject(QuranService);
  readonly defaultDua = DEFAULT_DUA;
}
