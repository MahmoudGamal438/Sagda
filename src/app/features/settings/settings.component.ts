import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService, DEFAULT_DUA } from '../../core/services/settings.service';
import { InstallService } from '../../core/services/install.service';
import { QuranService } from '../../core/services/quran.service';
import { NotificationService } from '../../core/services/notification.service';
import { ADHAN_VOICES } from '../../core/data/adhan-voices.data';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">الإعدادات</h1>
      <p class="page-sub">تُحفظ جميع الإعدادات محليًا على جهازك، ولا نرسلها إلى أي خادم.</p>

      <article class="card pad">
        <h2><app-icon name="sun" /> المظهر والقراءة</h2>
        <label class="field">
          <span>الوضع</span>
          <select [ngModel]="s.settings().theme" (ngModelChange)="s.patch({ theme: $event })">
            <option value="system">حسب النظام</option>
            <option value="light">فاتح</option>
            <option value="dark">ليلي (كحلي)</option>
          </select>
        </label>
        <label class="range">
          <span>حجم خط المصحف: {{ s.settings().quranFontSize }}</span>
          <input type="range" min="18" max="48" [ngModel]="s.settings().quranFontSize" (ngModelChange)="s.patch({ quranFontSize: $event })" />
        </label>
        <label class="range">
          <span>تباعد الأسطر: {{ s.settings().quranLineHeight }}</span>
          <input type="range" min="1.6" max="3" step="0.1" [ngModel]="s.settings().quranLineHeight" (ngModelChange)="s.patch({ quranLineHeight: $event })" />
        </label>
        <label class="check"><input type="checkbox" [ngModel]="s.settings().showTranslation" (ngModelChange)="s.patch({ showTranslation: $event })" /> عرض الترجمة بجانب الآيات</label>
        <label class="check"><input type="checkbox" [ngModel]="s.settings().reduceMotion" (ngModelChange)="s.patch({ reduceMotion: $event })" /> تقليل الحركة والانتقالات</label>
      </article>

      <article class="card pad">
        <h2><app-icon name="bell" /> الصوت والتنبيهات</h2>
        <label class="field">
          <span>صوت الأذان (مؤذنون مصريون)</span>
          <select [ngModel]="s.settings().adhanVoice" (ngModelChange)="pickAdhan($event)">
            @for (v of adhanVoices; track v.id) {
              <option [value]="v.id">{{ v.muezzin }} — {{ v.place }}</option>
            }
          </select>
        </label>
        <label class="range">
          <span>مستوى صوت التنبيه: {{ (s.settings().alertVolume * 100).toFixed(0) }}%</span>
          <input type="range" min="0" max="1" step="0.05" [ngModel]="s.settings().alertVolume" (ngModelChange)="s.patch({ alertVolume: $event })" />
        </label>
        <div class="btn-row">
          <button class="btn btn-gold" type="button" (click)="notify.testAdhan()">
            <app-icon name="play" /> تجربة الأذان المختار
          </button>
          <button class="btn btn-ghost" type="button" (click)="notify.testSound('short')">
            <app-icon name="bell" /> تجربة نغمة قصيرة
          </button>
          <button class="btn btn-ghost" type="button" (click)="notify.stopAdhan()">
            <app-icon name="close" /> إيقاف الصوت
          </button>
        </div>
        <p class="muted small">اختر مؤذنًا مصريًا لتنبيهات الصلاة، ويُشغَّل الصوت بعد تنبيهك فقط. لإدارة تنبيهات كل صلاة افتح صفحة المواقيت.</p>
      </article>

      <article class="card pad">
        <h2><app-icon name="headset" /> القارئ المفضّل</h2>
        <label class="field">
          <span>القارئ</span>
          <select [ngModel]="s.settings().reciterId" (ngModelChange)="s.patch({ reciterId: $event })">
            @for (r of quran.reciters; track r.id) {
              <option [value]="r.id">{{ r.name }} · {{ r.style }}</option>
            }
          </select>
        </label>
        <label class="range">
          <span>سرعة التلاوة: {{ s.settings().playbackRate }}×</span>
          <input type="range" min="0.75" max="1.5" step="0.05" [ngModel]="s.settings().playbackRate" (ngModelChange)="s.patch({ playbackRate: $event })" />
        </label>
      </article>

      <article class="card pad">
        <h2><app-icon name="adhkar" /> شاشة الترحيب</h2>
        <p class="muted small">رسالة ترحيب شخصية، وليست قرآنًا ولا حديثًا.</p>
        <textarea [ngModel]="s.settings().personalDua" (ngModelChange)="s.patch({ personalDua: $event })" rows="3"></textarea>
        <button class="btn btn-ghost" type="button" (click)="s.resetDua()">استعادة النص الافتراضي</button>
      </article>

      <article class="card pad">
        <h2><app-icon name="tasbeeh" /> المسبحة والأذكار</h2>
        <label class="check"><input type="checkbox" [ngModel]="s.settings().autoNextDhikr" (ngModelChange)="s.patch({ autoNextDhikr: $event })" /> انتقال تلقائي بعد اكتمال العدد</label>
        <label class="check"><input type="checkbox" [ngModel]="s.settings().tasbeehVibrate" (ngModelChange)="s.patch({ tasbeehVibrate: $event })" /> اهتزاز عند اكتمال الهدف</label>
        <label class="check"><input type="checkbox" [ngModel]="s.settings().tasbeehSound" (ngModelChange)="s.patch({ tasbeehSound: $event })" /> صوت عند التسبيح</label>
      </article>

      <article class="card pad">
        <h2><app-icon name="gps" /> تثبيت التطبيق</h2>
        @if (install.installed()) {
          <p class="muted">التطبيق يعمل في وضع مستقل.</p>
        } @else if (install.isIos) {
          <p class="muted">على iPhone/iPad: زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».</p>
        } @else {
          <button class="btn btn-gold" type="button" (click)="install.openFromSettings()">إظهار خيار التثبيت</button>
        }
      </article>
    </section>
  `,
  styles: [
    `
      .pad { padding: 1.1rem; display: grid; gap: 0.7rem; margin-bottom: 1rem; }
      h2 { display: flex; align-items: center; gap: 0.5rem; margin: 0; font-size: 1.05rem; }
      h2 app-icon { color: var(--color-gold); width: 1.2rem; height: 1.2rem; }
      .field { display: grid; gap: 0.25rem; font-size: 0.85rem; color: var(--color-muted); }
      select, textarea { width: 100%; }
      textarea { padding: 0.6rem; border-radius: var(--radius-sm); }
      .range { display: grid; gap: 0.3rem; font-size: 0.85rem; color: var(--color-muted); }
      .check { display: flex; align-items: center; gap: 0.5rem; }
      .check input { width: 18px; height: 18px; }
      .btn-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .small { font-size: 0.78rem; }
    `
  ]
})
export class SettingsComponent {
  readonly s = inject(SettingsService);
  readonly install = inject(InstallService);
  readonly quran = inject(QuranService);
  readonly notify = inject(NotificationService);
  readonly defaultDua = DEFAULT_DUA;
  readonly adhanVoices = ADHAN_VOICES;

  pickAdhan(id: string): void {
    this.s.patch({ adhanVoice: id });
    this.notify.testAdhan(id);
  }
}
