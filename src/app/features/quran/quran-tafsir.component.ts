import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuranService } from '../../core/services/quran.service';
import { SettingsService } from '../../core/services/settings.service';
import { SurahDetail } from '../../core/models/quran.model';
import { StateBlockComponent } from '../../shared/state-block.component';

@Component({
  selector: 'app-quran-tafsir',
  standalone: true,
  imports: [FormsModule, StateBlockComponent],
  template: `
    <section class="page">
      <h1 class="page-title">التفسير والتدبر</h1>
      <p class="page-sub">التفسير الميسّر من طبعة مجمع الملك فهد عبر AlQuran Cloud. النص القرآني منفصل بصريًا.</p>
      <div class="card pad">
        <label>السورة
          <select [(ngModel)]="surahNo" (ngModelChange)="load()">
            @for (s of quran.surahs(); track s.number) {
              <option [ngValue]="s.number">{{ s.name }}</option>
            }
          </select>
        </label>
        <label>الطبعة
          <select [ngModel]="settings.settings().tafsirEdition" (ngModelChange)="changeEd($event)">
            <option value="ar.muyassar">التفسير الميسر</option>
            <option value="ar.jalalayn">تفسير الجلالين</option>
            <option value="en.sahih">Sahih International</option>
          </select>
        </label>
      </div>
      @if (loading()) {
        <app-state-block kind="loading" title="جارٍ التحميل" message="يتم جلب التفسير." />
      } @else if (error()) {
        <app-state-block kind="error" title="تعذر التحميل" [message]="error()!" />
      } @else if (quranText() && tafsir()) {
        @for (a of quranText()!.ayahs; track a.number; let i = $index) {
          <article class="card item">
            <p class="ayah">{{ a.text }} ﴿{{ a.numberInSurah }}﴾</p>
            <p class="sep">التفسير / المعنى</p>
            <p>{{ tafsir()!.ayahs[i].text }}</p>
          </article>
        }
      }
    </section>
  `,
  styles: [`
    .pad { padding: 1rem; display: grid; gap: 0.6rem; }
    .item { padding: 1rem; margin-top: 0.7rem; }
    .ayah { font-family: var(--font-quran); font-size: 1.25rem; }
    .sep { color: var(--color-gold-700); font-size: 0.85rem; }
  `]
})
export class QuranTafsirComponent {
  readonly quran = inject(QuranService);
  readonly settings = inject(SettingsService);
  surahNo = 1;
  quranText = signal<SurahDetail | null>(null);
  tafsir = signal<SurahDetail | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    void this.load();
  }

  changeEd(ed: string): void {
    this.settings.patch({ tafsirEdition: ed });
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.quranText.set(await this.quran.getSurah(this.surahNo));
      this.tafsir.set(await this.quran.getSurah(this.surahNo, this.settings.settings().tafsirEdition));
    } catch {
      this.error.set('تعذر جلب التفسير. تحقق من الاتصال.');
    } finally {
      this.loading.set(false);
    }
  }
}
