import { Component, inject } from '@angular/core';
import { AudioService } from '../core/services/audio.service';
import { QuranService } from '../core/services/quran.service';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (audio.currentAyah() !== null) {
      <div class="player card" role="region" aria-label="مشغّل التلاوة">
        <div class="info">
          <span class="lead"><app-icon name="headset" /></span>
          <div class="txt">
            <strong>{{ surahName() }}</strong>
            <small class="muted">آية {{ ayahInSurah() }}</small>
          </div>
        </div>

        <div class="controls">
          <button type="button" class="ctrl" (click)="audio.prev()" aria-label="السابقة">
            <app-icon name="chevronRight" />
          </button>
          <button type="button" class="ctrl main" (click)="toggle()" [attr.aria-label]="audio.playing() ? 'إيقاف' : 'تشغيل'">
            <app-icon [name]="audio.playing() ? 'pause' : 'play'" />
          </button>
          <button type="button" class="ctrl" (click)="audio.next()" aria-label="التالية">
            <app-icon name="chevronLeft" />
          </button>
        </div>

        <input
          class="seek"
          type="range"
          min="0"
          [max]="audio.duration() || 1"
          [value]="audio.progress()"
          (input)="audio.seek(+$any($event.target).value)"
          aria-label="موضع التشغيل"
        />

        <button type="button" class="ctrl close" (click)="audio.stop()" aria-label="إغلاق المشغّل">
          <app-icon name="close" />
        </button>
      </div>
    }
  `,
  styles: [
    `
      .player {
        position: fixed;
        inset-inline: 0;
        bottom: calc(4.6rem + var(--safe-bottom));
        z-index: 11;
        display: flex;
        align-items: center;
        gap: 0.7rem;
        padding: 0.6rem 0.8rem;
        border-radius: 0;
        border-inline: 0;
        border-bottom: 0;
        flex-wrap: wrap;
        border-color: color-mix(in srgb, var(--color-gold) 35%, transparent);
      }
      .info { display: flex; align-items: center; gap: 0.5rem; min-width: 140px; }
      .lead { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px; color: var(--color-gold); background: color-mix(in srgb, var(--color-gold) 12%, transparent); }
      .txt { display: flex; flex-direction: column; line-height: 1.2; }
      .txt small { font-size: 0.72rem; }
      .controls { display: flex; align-items: center; gap: 0.3rem; }
      .ctrl { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--color-line); background: transparent; color: var(--color-ink); }
      .ctrl.main { background: var(--nav-active-bg); color: var(--nav-active-on-bg); border: 0; }
      .ctrl.close { margin-inline-start: auto; }
      .seek { flex: 1; min-width: 100px; }
      @media (min-width: 900px) {
        .player {
          bottom: 1rem;
          inset-inline: 1rem;
          border-radius: var(--radius-lg);
          border: 1px solid color-mix(in srgb, var(--color-gold) 35%, transparent);
        }
      }
    `
  ]
})
export class AudioPlayerComponent {
  readonly audio = inject(AudioService);
  private quran = inject(QuranService);

  toggle(): void {
    if (this.audio.playing()) {
      this.audio.pause();
    } else {
      this.audio.resume();
    }
  }

  surahName(): string {
    const n = this.audio.currentSurah();
    const s = this.quran.surahs().find((x) => x.number === n);
    return s ? s.name : `سورة ${n ?? ''}`;
  }

  ayahInSurah(): number | string {
    const g = this.audio.currentAyah();
    const n = this.audio.currentSurah();
    if (g == null || n == null) {
      return g ?? '';
    }
    const list = this.quran.surahs();
    if (!list.length) {
      return g;
    }
    let before = 0;
    for (const s of list) {
      if (s.number === n) {
        break;
      }
      before += s.numberOfAyahs;
    }
    return g - before;
  }
}
