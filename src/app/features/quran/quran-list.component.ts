import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuranService } from '../../core/services/quran.service';
import { StateBlockComponent } from '../../shared/state-block.component';

@Component({
  selector: 'app-quran-list',
  standalone: true,
  imports: [RouterLink, FormsModule, StateBlockComponent],
  template: `
    <section class="page">
      <h1 class="page-title">القرآن الكريم</h1>
      <p class="page-sub">114 سورة من مصدر Tanzil عبر AlQuran Cloud</p>
      <input class="search" type="search" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="ابحث باسم السورة أو رقمها" />
      <div class="links">
        <a routerLink="/quran/listen">التلاوات</a>
        <a routerLink="/quran/tafsir">التفسير</a>
        <a routerLink="/quran/khatma">الختمة</a>
        <a routerLink="/search">بحث الآيات</a>
      </div>
      @if (quran.loading() && !quran.surahs().length) {
        <app-state-block kind="loading" title="جارٍ التحميل" message="يتم جلب قائمة السور." />
      } @else if (quran.error() && !filtered().length) {
        <app-state-block kind="error" title="تعذر التحميل" [message]="quran.error() || ''">
          <button class="btn btn-primary" type="button" (click)="retry()">إعادة المحاولة</button>
        </app-state-block>
      } @else {
        <div class="grid list">
          @for (s of filtered(); track s.number) {
            <a class="card item" [routerLink]="['/quran/read', s.number]">
              <span class="num">{{ s.number }}</span>
              <div>
                <strong>{{ s.name }}</strong>
                <p>{{ quran.revelationLabel(s.revelationType) }} · {{ s.numberOfAyahs }} آية</p>
              </div>
            </a>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .search {
      width: 100%;
      min-height: 46px;
      border-radius: 999px;
      border: 1px solid var(--color-line);
      padding: 0 1rem;
      background: var(--color-surface);
      color: inherit;
      margin-bottom: 0.8rem;
    }
    .links { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .links a { color: var(--color-emerald-700); }
    .list { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
    .item { display: flex; gap: 0.8rem; padding: 0.9rem; align-items: center; }
    .num {
      width: 36px; height: 36px; display: grid; place-items: center;
      border-radius: 10px; background: rgba(18,38,74,.1); font-weight: 800;
    }
    p { margin: 0.15rem 0 0; color: var(--color-muted); font-size: 0.9rem; }
  `]
})
export class QuranListComponent {
  readonly quran = inject(QuranService);
  query = signal('');
  readonly filtered = computed(() => {
    const q = this.query().trim();
    const list = this.quran.surahs();
    if (!q) {
      return list;
    }
    return list.filter((s) => s.name.includes(q) || String(s.number) === q || s.englishName.toLowerCase().includes(q.toLowerCase()));
  });

  retry(): void {
    void this.quran.loadSurahList();
  }
}
