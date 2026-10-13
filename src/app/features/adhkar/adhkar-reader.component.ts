import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdhkarService } from '../../core/services/adhkar.service';
import { SettingsService } from '../../core/services/settings.service';
import { UserDataService } from '../../core/services/user-data.service';
import { StateBlockComponent } from '../../shared/state-block.component';

@Component({
  selector: 'app-adhkar-reader',
  standalone: true,
  imports: [RouterLink, StateBlockComponent],
  template: `
    <section class="page">
      @if (!category()) {
        <app-state-block kind="empty" title="غير موجود" message="هذا التصنيف غير متاح." />
      } @else {
        <a routerLink="/adhkar" class="muted">عودة للمكتبة</a>
        <h1 class="page-title">{{ category()!.title }}</h1>
        <p class="page-sub">{{ index() + 1 }} / {{ category()!.items.length }}</p>
        <div class="bar"><span [style.width.%]="progressPct()"></span></div>
        @if (current(); as item) {
          <article class="card sheet">
            <p class="text">{{ item.text }}</p>
            <p class="src">{{ item.source }}@if (item.grade) { · {{ item.grade }} }</p>
            @if (item.meaning) { <p class="muted">{{ item.meaning }}</p> }
            <button class="count" type="button" (click)="tick()">
              {{ counts()[item.id] || 0 }} / {{ item.repeat }}
            </button>
            <div class="row">
              <button class="btn btn-ghost" type="button" (click)="prev()" [disabled]="index() === 0">السابق</button>
              <button class="btn btn-ghost" type="button" (click)="resetItem()">إعادة</button>
              <button class="btn btn-primary" type="button" (click)="next()" [disabled]="index() >= category()!.items.length - 1">التالي</button>
            </div>
            <div class="row">
              <button class="btn btn-ghost" type="button" (click)="copy(item.text)">نسخ</button>
              <button class="btn btn-ghost" type="button" (click)="share(item.text)">مشاركة</button>
            </div>
          </article>
        }
      }
    </section>
  `,
  styles: [`
    .sheet { padding: 1.2rem; margin-top: 1rem; text-align: center; }
    .text { font-family: var(--font-quran); font-size: 1.35rem; line-height: 2; }
    .count {
      width: 140px; height: 140px; border-radius: 50%; border: 0;
      background: linear-gradient(145deg, var(--color-emerald-800), var(--color-gold-500));
      color: #fff; font-size: 1.6rem; font-weight: 800; margin: 1rem auto;
      display: grid; place-items: center;
    }
    .row { display: flex; justify-content: center; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.6rem; }
    .bar { height: 8px; background: rgba(18,38,74,.12); border-radius: 99px; overflow: hidden; }
    .bar span { display: block; height: 100%; background: var(--color-gold-500); }
  `]
})
export class AdhkarReaderComponent {
  private route = inject(ActivatedRoute);
  private adhkar = inject(AdhkarService);
  private settings = inject(SettingsService);
  private user = inject(UserDataService);

  private categoryId = signal('');
  readonly category = computed(() => this.adhkar.byId(this.categoryId()));
  readonly index = signal(0);
  readonly counts = signal<Record<string, number>>({});

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') || '';
      this.categoryId.set(id);
      this.index.set(0);
      const saved = this.user.dhikrProgress()[id];
      this.counts.set(saved?.counts ?? {});
    });
  }

  current() {
    return this.category()?.items[this.index()];
  }

  progressPct(): number {
    const cat = this.category();
    if (!cat) {
      return 0;
    }
    const done = cat.items.filter((i) => (this.counts()[i.id] || 0) >= i.repeat).length;
    return (done / cat.items.length) * 100;
  }

  tick(): void {
    const item = this.current();
    const cat = this.category();
    if (!item || !cat) {
      return;
    }
    const next = { ...this.counts(), [item.id]: Math.min(item.repeat, (this.counts()[item.id] || 0) + 1) };
    this.counts.set(next);
    this.persist();
    if (next[item.id] >= item.repeat && this.settings.settings().autoNextDhikr) {
      this.next();
    }
  }

  next(): void {
    const cat = this.category();
    if (!cat) {
      return;
    }
    this.index.set(Math.min(cat.items.length - 1, this.index() + 1));
  }

  prev(): void {
    this.index.set(Math.max(0, this.index() - 1));
  }

  resetItem(): void {
    const item = this.current();
    if (!item) {
      return;
    }
    const next = { ...this.counts(), [item.id]: 0 };
    this.counts.set(next);
    this.persist();
  }

  copy(text: string): void {
    void navigator.clipboard.writeText(text);
  }

  share(text: string): void {
    if (navigator.share) {
      void navigator.share({ text });
    } else {
      this.copy(text);
    }
  }

  private persist(): void {
    const cat = this.category();
    if (!cat) {
      return;
    }
    const completed = cat.items.every((i) => (this.counts()[i.id] || 0) >= i.repeat);
    this.user.saveDhikrProgress({
      categoryId: cat.id,
      counts: this.counts(),
      completed,
      updatedAt: Date.now()
    });
  }
}
