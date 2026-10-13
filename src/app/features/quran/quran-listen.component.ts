import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuranService } from '../../core/services/quran.service';
import { AudioService } from '../../core/services/audio.service';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-quran-listen',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page">
      <h1 class="page-title">التلاوات</h1>
      <p class="page-sub">ملفات صوتية حقيقية من cdn.islamic.network عبر AlQuran Cloud</p>
      <div class="card pad">
        <label>القارئ
          <select [ngModel]="settings.settings().reciterId" (ngModelChange)="settings.patch({ reciterId: $event })">
            @for (r of quran.reciters; track r.id) {
              <option [value]="r.id">{{ r.name }} · {{ r.style }}</option>
            }
          </select>
        </label>
        <label>السورة
          <select [(ngModel)]="surahNo">
            @for (s of quran.surahs(); track s.number) {
              <option [ngValue]="s.number">{{ s.number }} · {{ s.name }}</option>
            }
          </select>
        </label>
        <label>تكرار المقطع
          <input type="number" min="1" max="20" [ngModel]="audio.repeatCount()" (ngModelChange)="audio.repeatCount.set($event)" />
        </label>
        <label>السرعة
          <input type="range" min="0.75" max="1.5" step="0.05" [ngModel]="settings.settings().playbackRate" (ngModelChange)="audio.setRate($event)" />
        </label>
        <div class="row">
          <button class="btn btn-primary" type="button" (click)="play()">تشغيل السورة</button>
          <button class="btn btn-ghost" type="button" (click)="audio.pause()">إيقاف مؤقت</button>
          <button class="btn btn-ghost" type="button" (click)="audio.prev()">السابقة</button>
          <button class="btn btn-ghost" type="button" (click)="audio.next()">التالية</button>
        </div>
        @if (audio.error()) {
          <p class="muted">{{ audio.error() }}</p>
        }
        <input type="range" min="0" [max]="audio.duration() || 1" [ngModel]="audio.progress()" (ngModelChange)="audio.seek($event)" />
      </div>
    </section>
  `,
  styles: [`
    .pad { padding: 1rem; display: grid; gap: 0.8rem; }
    select, input { width: 100%; min-height: 42px; }
    .row { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  `]
})
export class QuranListenComponent {
  readonly quran = inject(QuranService);
  readonly audio = inject(AudioService);
  readonly settings = inject(SettingsService);
  surahNo = 1;

  async play(): Promise<void> {
    const s = await this.quran.getSurah(this.surahNo);
    this.audio.playSurah(s.number, s.ayahs[0].number, s.ayahs[s.ayahs.length - 1].number);
  }
}
