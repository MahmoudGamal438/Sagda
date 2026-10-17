import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuranService } from '../../core/services/quran.service';
import { AudioService } from '../../core/services/audio.service';
import { SettingsService } from '../../core/services/settings.service';
import { UserDataService } from '../../core/services/user-data.service';
import { IconComponent } from '../../shared/icon.component';
import { Reciter } from '../../core/models/quran.model';

@Component({
  selector: 'app-quran-listen',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">القرآن صوتيًا</h1>
      <p class="page-sub">
        تلاوات حقيقية من cdn.islamic.network عبر AlQuran Cloud. يظهر المشغّل أسفل الشاشة أثناء التشغيل.
      </p>

      <div class="card pad">
        <label class="field">
          <span>القارئ</span>
          <select [ngModel]="settings.settings().reciterId" (ngModelChange)="onReciter($event)">
            @for (r of quran.reciters; track r.id) {
              <option [value]="r.id">{{ r.name }} · {{ r.style }}</option>
            }
          </select>
        </label>

        <div class="row">
          <label class="field grow">
            <span>من سورة</span>
            <select [ngModel]="from" (ngModelChange)="from = +$event">
              @for (s of quran.surahs(); track s.number) {
                <option [ngValue]="s.number">{{ s.number }} · {{ s.name }}</option>
              }
            </select>
          </label>
          <label class="field grow">
            <span>إلى سورة</span>
            <select [ngModel]="to" (ngModelChange)="to = +$event">
              @for (s of quran.surahs(); track s.number) {
                <option [ngValue]="s.number">{{ s.number }} · {{ s.name }}</option>
              }
            </select>
          </label>
        </div>

        <div class="row">
          <label class="field grow">
            <span>تكرار المقطع: {{ audio.repeatCount() }}×</span>
            <input type="range" min="1" max="10" [ngModel]="audio.repeatCount()" (ngModelChange)="audio.repeatCount.set($event)" />
          </label>
          <label class="field grow">
            <span>السرعة: {{ settings.settings().playbackRate }}×</span>
            <input type="range" min="0.75" max="1.5" step="0.05" [ngModel]="settings.settings().playbackRate" (ngModelChange)="audio.setRate($event)" />
          </label>
        </div>

        <div class="row controls">
          <button class="btn btn-gold" type="button" (click)="playSelected()"><app-icon name="play" /> تشغيل</button>
          <button class="btn btn-ghost" type="button" (click)="playFromProgress()"><app-icon name="check" /> متابعة آخر موضع</button>
          @if (audio.playing()) {
            <button class="btn btn-ghost" type="button" (click)="audio.pause()"><app-icon name="pause" /> إيقاف</button>
          }
          @if (audio.error(); as e) {
            <span class="chip err">{{ e }}</span>
          }
        </div>

        <p class="muted small">يتم التشغيل بعد تفاعلك فقط، ولا يُشغَّل الصوت تلقائيًا.</p>
      </div>

      <h2 class="sec-title">قُرّاء مصر</h2>
      <div class="grid reciters">
        @for (r of quran.egyptianReciters; track r.id) {
          <button
            type="button"
            class="card reciter"
            [class.active]="settings.settings().reciterId === r.id"
            (click)="onReciter(r.id)"
          >
            <app-icon name="headset" />
            <strong>{{ r.name }}</strong>
            <small>{{ r.style }} · مصر</small>
          </button>
        }
      </div>

      <h2 class="sec-title">قُرّاء آخرون</h2>
      <div class="grid reciters">
        @for (r of otherReciters(); track r.id) {
          <button
            type="button"
            class="card reciter"
            [class.active]="settings.settings().reciterId === r.id"
            (click)="onReciter(r.id)"
          >
            <app-icon name="headset" />
            <strong>{{ r.name }}</strong>
            <small>{{ r.style }}</small>
          </button>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .pad { padding: 1.1rem; display: grid; gap: 0.9rem; margin-bottom: 1rem; }
      .field { display: grid; gap: 0.3rem; font-size: 0.85rem; color: var(--color-muted); }
      select, input { width: 100%; min-height: 42px; }
      .row { display: flex; gap: 0.8rem; flex-wrap: wrap; align-items: end; }
      .grow { flex: 1 1 160px; }
      .controls { align-items: center; }
      .err { color: var(--color-danger); }
      .small { font-size: 0.78rem; }
      .sec-title { font-size: 1rem; margin: 1rem 0 0.5rem; }
      .reciters { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
      .reciter { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; padding: 1rem 0.6rem; text-align: center; }
      .reciter app-icon { color: var(--color-gold); }
      .reciter strong { font-size: 0.9rem; }
      .reciter small { color: var(--color-muted); font-size: 0.74rem; }
      .reciter.active { border-color: color-mix(in srgb, var(--color-gold) 50%, transparent); background: color-mix(in srgb, var(--color-gold) 10%, var(--color-surface)); }
    `
  ]
})
export class QuranListenComponent implements OnInit {
  readonly quran = inject(QuranService);
  readonly audio = inject(AudioService);
  readonly settings = inject(SettingsService);
  readonly user = inject(UserDataService);

  from = 1;
  to = 1;

  ngOnInit(): void {
    void this.quran.loadSurahList();
  }

  onReciter(id: string): void {
    this.settings.patch({ reciterId: id });
  }

  otherReciters(): Reciter[] {
    return this.quran.reciters.filter((r) => r.country !== 'مصر');
  }

  async playSelected(): Promise<void> {
    const from = Math.min(this.from, this.to);
    const to = Math.max(this.from, this.to);
    let surahs = this.quran.surahs();
    if (!surahs.length) {
      surahs = await this.quran.loadSurahList();
    }
    const first = surahs.find((s) => s.number === from);
    const last = surahs.find((s) => s.number === to);
    if (!first || !last) {
      return;
    }
    const firstGlobal =
      surahs.filter((s) => s.number < from).reduce((sum, s) => sum + s.numberOfAyahs, 0) + 1;
    const lastGlobal =
      surahs.filter((s) => s.number < to).reduce((sum, s) => sum + s.numberOfAyahs, 0) +
      last.numberOfAyahs;
    const range: number[] = [];
    for (let g = firstGlobal; g <= lastGlobal; g++) {
      range.push(g);
    }
    this.audio.playRange(range, from);
  }

  async playFromProgress(): Promise<void> {
    const p = this.user.progress();
    if (!p) {
      await this.playSelected();
      return;
    }
    const surah = await this.quran.getSurah(p.surah);
    this.audio.playRange(
      surah.ayahs.map((a) => a.number),
      surah.number
    );
  }
}
