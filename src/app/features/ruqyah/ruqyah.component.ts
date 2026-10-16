import { Component, inject, OnInit, signal } from '@angular/core';
import { QuranService } from '../../core/services/quran.service';
import { SettingsService } from '../../core/services/settings.service';
import { RUQYAH_ITEMS, RuqyahItem } from '../../core/data/ruqyah.data';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-ruqyah',
  standalone: true,
  imports: [IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">الرقية الشرعية</h1>
      <p class="page-sub">
        آيات قرآنية محكمة وأدعية ثابتة تُقرأ للرقية والتحصين. النصوص القرآنية تُجلب من مصدر موثوق.
        الرقية سبب مشروع، والشفاء بيد الله وحده، ولا نقدّم أي ادعاء علاجي.
      </p>

      <div class="items">
        @for (item of items; track item.id) {
          <article class="card item" [class.open]="isOpen(item.id)">
            <button type="button" class="item-head" (click)="toggle(item.id)">
              <span class="lead"><app-icon [name]="item.type === 'quran' ? 'quran' : 'adhkar'" /></span>
              <span class="info">
                <strong>{{ item.title }}</strong>
                <small>{{ item.description }}</small>
              </span>
              @if (item.repeat && item.repeat > 1) {
                <span class="chip">×{{ item.repeat }}</span>
              }
              <app-icon name="chevronDown" class="chev" />
            </button>

            @if (isOpen(item.id)) {
              <div class="item-body">
                @if (item.type === 'dua') {
                  <p class="ayah">{{ item.text }}</p>
                } @else {
                  @if (loading().has(item.id) && !verses()[item.id]) {
                    <p class="muted">جارٍ جلب الآيات…</p>
                  } @else if (verses()[item.id]) {
                    @for (v of verses()[item.id]; track v.n) {
                      <p class="ayah"><span class="num">{{ v.n }}</span> {{ v.text }}</p>
                    }
                  } @else {
                    <p class="muted">تعذر جلب النص. تحقق من الاتصال.</p>
                  }
                }
                <p class="source">{{ item.source }}</p>
              </div>
            }
          </article>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .items { display: grid; gap: 0.7rem; }
      .item { overflow: hidden; }
      .item-head {
        display: flex; align-items: center; gap: 0.7rem; width: 100%;
        padding: 1rem; border: 0; background: transparent; text-align: start;
      }
      .lead {
        display: grid; place-items: center; width: 40px; height: 40px; flex: 0 0 auto;
        border-radius: 12px; color: var(--color-gold);
        background: color-mix(in srgb, var(--color-gold) 12%, transparent);
      }
      .info { display: flex; flex-direction: column; gap: 0.15rem; }
      .info strong { font-size: 0.98rem; }
      .info small { color: var(--color-muted); font-size: 0.76rem; line-height: 1.6; }
      .chev { margin-inline-start: auto; color: var(--color-muted); transition: transform 0.2s ease; }
      .item.open .chev { transform: rotate(180deg); }
      .item-body { padding: 0 1rem 1rem; border-top: 1px solid var(--color-line); }
      .ayah {
        font-family: var(--font-quran); font-size: 1.35rem; line-height: 2.2; margin: 0.8rem 0;
      }
      .ayah .num {
        display: inline-grid; place-items: center; width: 26px; height: 26px; margin-inline-end: 0.4rem;
        border-radius: 50%; font-family: var(--font-ui); font-size: 0.72rem;
        color: var(--color-gold); border: 1px solid color-mix(in srgb, var(--color-gold) 40%, transparent);
        vertical-align: middle;
      }
      .source { color: var(--color-muted); font-size: 0.78rem; margin: 0.6rem 0 0; }
    `
  ]
})
export class RuqyahComponent implements OnInit {
  private quran = inject(QuranService);
  readonly settings = inject(SettingsService);
  readonly items = RUQYAH_ITEMS;

  readonly openIds = signal<Set<string>>(new Set());
  readonly verses = signal<Record<string, Array<{ n: number; text: string }>>>({});
  readonly loading = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.toggle('fatiha');
  }

  isOpen(id: string): boolean {
    return this.openIds().has(id);
  }

  toggle(id: string): void {
    const next = new Set(this.openIds());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      const item = this.items.find((i) => i.id === id);
      if (item && item.type === 'quran' && !this.verses()[id]) {
        void this.loadVerses(item);
      }
    }
    this.openIds.set(next);
  }

  private async loadVerses(item: RuqyahItem): Promise<void> {
    if (!item.surah) {
      return;
    }
    const loading = new Set(this.loading());
    loading.add(item.id);
    this.loading.set(loading);
    try {
      const surah = await this.quran.getSurah(item.surah);
      const list = surah.ayahs
        .filter((a) => a.numberInSurah >= (item.from ?? 1) && a.numberInSurah <= (item.to ?? 999))
        .map((a) => ({ n: a.numberInSurah, text: a.text }));
      this.verses.update((v) => ({ ...v, [item.id]: list }));
    } catch {
      /* leave empty, UI shows fallback */
    } finally {
      const done = new Set(this.loading());
      done.delete(item.id);
      this.loading.set(done);
    }
  }
}
