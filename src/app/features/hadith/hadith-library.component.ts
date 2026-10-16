import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HadithService } from '../../core/services/hadith.service';
import { UserDataService } from '../../core/services/user-data.service';
import { HadithCategory } from '../../core/models/hadith.model';
import { IconComponent } from '../../shared/icon.component';
import { StateBlockComponent } from '../../shared/state-block.component';

@Component({
  selector: 'app-hadith-library',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent, StateBlockComponent],
  template: `
    <section class="page">
      <h1 class="page-title">الأحاديث النبوية</h1>
      <p class="page-sub">
        أحاديث موثّقة من «موسوعة الأحاديث النبوية» (HadeethEnc) مع ذكر المصدر ودرجة الحديث والشرح.
      </p>

      @if (hadith.error(); as err) {
        <app-state-block kind="error" title="تنبيه" [message]="err" />
      }

      @if (!hadith.categories().length) {
        <app-state-block kind="loading" title="جارٍ التحميل" message="يتم جلب التصنيفات." />
      } @else {
        <div class="cats">
          @for (cat of hadith.categories(); track cat.id) {
            <button
              type="button"
              class="cat"
              [class.active]="hadith.currentCategory()?.id === cat.id"
              (click)="open(cat)"
            >
              <span>{{ cat.title }}</span>
              <small>{{ cat.hadeeths_count }}</small>
            </button>
          }
        </div>
      }

      @if (hadith.currentCategory()) {
        <div class="toolbar card">
          <label class="search">
            <app-icon name="search" />
            <input
              type="search"
              placeholder="تصفية داخل هذه القائمة…"
              [ngModel]="query()"
              (ngModelChange)="query.set($event)"
            />
          </label>
          @if (hadith.currentCategory()?.hadeeths_count) {
            <span class="chip">{{ hadith.totalItems() }} حديث</span>
          }
        </div>

        @if (hadith.loading()) {
          <app-state-block kind="loading" title="جارٍ التحميل" message="يتم جلب الأحاديث." />
        }

        <div class="list">
          @for (item of filtered(); track item.id) {
            <a class="hadith card" [routerLink]="['/hadith', item.id]">
              <app-icon name="book" class="lead" />
              <span class="h-text">{{ item.title }}</span>
              @if (user.isHadithFavorite(item.id)) {
                <app-icon name="heart" class="fav" />
              }
            </a>
          } @empty {
            @if (!hadith.loading()) {
              <app-state-block kind="empty" title="لا نتائج" message="جرّب تصنيفًا آخر أو كلمة أخرى." />
            }
          }
        </div>

        @if (hadith.lastPage() > 1 && !query()) {
          <div class="pager">
            <button class="btn btn-ghost" type="button" [disabled]="hadith.currentPage() <= 1" (click)="go(hadith.currentPage() - 1)">
              <app-icon name="chevronRight" /> السابق
            </button>
            <span class="muted">صفحة {{ hadith.currentPage() }} من {{ hadith.lastPage() }}</span>
            <button class="btn btn-ghost" type="button" [disabled]="hadith.currentPage() >= hadith.lastPage()" (click)="go(hadith.currentPage() + 1)">
              التالي <app-icon name="chevronLeft" />
            </button>
          </div>
        }
      }
    </section>
  `,
  styles: [
    `
      .cats { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
      .cat {
        display: inline-flex; align-items: center; gap: 0.5rem;
        padding: 0.5rem 0.9rem; border-radius: 999px; font-weight: 600;
        border: 1px solid var(--color-line); background: var(--color-surface);
        color: var(--color-ink); transition: all 0.15s ease;
      }
      .cat small { color: var(--color-muted); font-size: 0.72rem; }
      .cat.active {
        background: var(--nav-active-bg); color: var(--nav-active-on-bg);
        border-color: transparent; box-shadow: var(--shadow-gold);
      }
      .cat.active small { color: rgba(11, 20, 40, 0.7); }
      .toolbar { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.8rem; margin-bottom: 1rem; }
      .search { display: flex; align-items: center; gap: 0.5rem; flex: 1; color: var(--color-muted); }
      .search input { flex: 1; border: 0; background: transparent; min-height: 38px; }
      .search input:focus { outline: none; }
      .list { display: grid; gap: 0.6rem; }
      .hadith { display: flex; align-items: center; gap: 0.7rem; padding: 0.9rem 1rem; }
      .hadith .lead { color: var(--color-gold); flex: 0 0 auto; }
      .hadith .h-text { font-weight: 600; line-height: 1.7; }
      .hadith .fav { margin-inline-start: auto; color: var(--color-gold); }
      .pager { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; margin-top: 1rem; }
    `
  ]
})
export class HadithLibraryComponent implements OnInit {
  readonly hadith = inject(HadithService);
  readonly user = inject(UserDataService);
  readonly query = signal('');

  readonly filtered = computed(() => {
    const q = this.query().trim();
    if (!q) {
      return this.hadith.items();
    }
    return this.hadith.items().filter((i) => i.title.includes(q));
  });

  ngOnInit(): void {
    void this.hadith.loadCategories();
  }

  open(cat: HadithCategory): void {
    this.query.set('');
    void this.hadith.loadCategory(cat, 1);
  }

  go(page: number): void {
    const cat = this.hadith.currentCategory();
    if (cat) {
      void this.hadith.loadCategory(cat, page);
    }
  }
}
