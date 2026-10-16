import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PROPHET_STORIES } from '../../core/data/stories.data';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">قصص الأنبياء</h1>
      <p class="page-sub">
        ملخّصات معتمدة على القرآن الكريم لكل نبي، مقسّمة إلى أجزاء قصيرة مع ذكر الآيات. هذه ملخّصات لا
        تُغني عن كتب التفسير والسيرة المعتمدة.
      </p>

      <label class="search card">
        <app-icon name="search" />
        <input type="search" placeholder="ابحث باسم النبي أو الموضوع…" [ngModel]="query()" (ngModelChange)="query.set($event)" />
      </label>

      <div class="grid">
        @for (s of filtered(); track s.id) {
          <a class="card story" [routerLink]="['/stories', s.id]">
            <span class="lead"><app-icon name="scroll" /></span>
            <span class="s-body">
              <strong>{{ s.title }}</strong>
              <small>{{ s.summary }}</small>
              <span class="topics">
                @for (t of s.topics; track t) {
                  <em>{{ t }}</em>
                }
              </span>
            </span>
            <app-icon name="chevronLeft" class="arrow" />
          </a>
        } @empty {
          <p class="muted">لا نتائج مطابقة.</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .search { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.9rem; margin-bottom: 1rem; color: var(--color-muted); }
      .search input { flex: 1; border: 0; background: transparent; min-height: 40px; }
      .search input:focus { outline: none; }
      .story { display: flex; align-items: center; gap: 0.8rem; padding: 1rem; }
      .lead { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; color: var(--color-gold); background: color-mix(in srgb, var(--color-gold) 12%, transparent); flex: 0 0 auto; }
      .s-body { display: flex; flex-direction: column; gap: 0.25rem; }
      .s-body strong { font-size: 1rem; }
      .s-body small { color: var(--color-muted); line-height: 1.7; font-size: 0.8rem; }
      .topics { display: flex; gap: 0.35rem; flex-wrap: wrap; margin-top: 0.2rem; }
      .topics em { font-style: normal; font-size: 0.68rem; padding: 0.15rem 0.5rem; border-radius: 999px; color: var(--color-gold); background: color-mix(in srgb, var(--color-gold) 12%, transparent); }
      .arrow { margin-inline-start: auto; color: var(--color-muted); }
    `
  ]
})
export class StoriesComponent {
  readonly query = signal('');
  readonly all = PROPHET_STORIES;

  filtered() {
    const q = this.query().trim();
    if (!q) {
      return this.all;
    }
    return this.all.filter(
      (s) => s.name.includes(q) || s.title.includes(q) || s.topics.some((t) => t.includes(q))
    );
  }
}
