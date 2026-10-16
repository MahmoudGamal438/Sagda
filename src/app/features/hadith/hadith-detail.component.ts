import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HadithService } from '../../core/services/hadith.service';
import { UserDataService } from '../../core/services/user-data.service';
import { HadithDetail } from '../../core/models/hadith.model';
import { IconComponent } from '../../shared/icon.component';
import { StateBlockComponent } from '../../shared/state-block.component';

@Component({
  selector: 'app-hadith-detail',
  standalone: true,
  imports: [RouterLink, IconComponent, StateBlockComponent],
  template: `
    <section class="page">
      <a class="back" routerLink="/hadith"><app-icon name="chevronRight" /> كل الأحاديث</a>

      @if (loading()) {
        <app-state-block kind="loading" title="جارٍ التحميل" message="يتم جلب الحديث." />
      } @else if (!hadith()) {
        <app-state-block kind="error" title="غير متوفر" message="تعذر جلب الحديث. تحقق من الاتصال." />
      } @else {
        @if (hadith(); as h) {
          <article class="card entry">
            <h1 class="title">{{ h.title }}</h1>

            <p class="text">{{ h.hadeeth }}</p>

            <div class="meta">
              @if (h.attribution) {
                <span class="chip"><app-icon name="book" /> {{ h.attribution }}</span>
              }
              @if (h.grade) {
                <span class="chip grade">{{ h.grade }}</span>
              }
            </div>

            @if (h.explanation) {
              <div class="explain">
                <h2>الشرح</h2>
                <p>{{ h.explanation }}</p>
              </div>
            }

            <div class="actions">
              <button class="btn" [class.btn-gold]="user.isHadithFavorite(h.id)" [class.btn-ghost]="!user.isHadithFavorite(h.id)" type="button" (click)="user.toggleHadithFavorite(h.id)">
                <app-icon name="heart" /> {{ user.isHadithFavorite(h.id) ? 'في المفضلة' : 'إضافة للمفضلة' }}
              </button>
              <button class="btn btn-ghost" type="button" (click)="copy(h)"><app-icon name="copy" /> نسخ</button>
              @if (canShare) {
                <button class="btn btn-ghost" type="button" (click)="share(h)"><app-icon name="share" /> مشاركة</button>
              }
            </div>
            @if (copied()) {
              <p class="muted small">تم النسخ.</p>
            }
            <p class="muted small source">
              المصدر: موسوعة الأحاديث النبوية (HadeethEnc). يُرجى مراجعة أهل العلم للحكم التفصيلي.
            </p>
          </article>
        }
      }
    </section>
  `,
  styles: [
    `
      .back { display: inline-flex; align-items: center; gap: 0.3rem; color: var(--color-muted); margin-bottom: 0.8rem; font-weight: 600; }
      .entry { padding: 1.4rem; }
      .title { margin: 0 0 0.9rem; font-size: 1.25rem; color: var(--color-gold); line-height: 1.7; }
      .text { font-family: var(--font-quran); font-size: 1.3rem; line-height: 2.1; margin: 0 0 1rem; }
      .meta { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
      .chip.grade { background: rgba(63, 178, 127, 0.16); color: var(--color-success); }
      .explain { border-top: 1px solid var(--color-line); padding-top: 0.9rem; }
      .explain h2 { font-size: 1rem; margin: 0 0 0.4rem; }
      .explain p { line-height: 2; margin: 0; }
      .actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.1rem; }
      .small { font-size: 0.78rem; }
      .source { margin-top: 0.8rem; line-height: 1.8; }
    `
  ]
})
export class HadithDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private hadithService = inject(HadithService);
  readonly user = inject(UserDataService);

  readonly hadith = signal<HadithDetail | null>(null);
  readonly loading = signal(true);
  readonly copied = signal(false);
  readonly canShare = typeof navigator !== 'undefined' && !!navigator.share;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }
    const detail = await this.hadithService.get(id);
    this.hadith.set(detail);
    this.loading.set(false);
  }

  async copy(h: HadithDetail): Promise<void> {
    try {
      await navigator.clipboard.writeText(`${h.hadeeth}\n\n${h.attribution} — ${h.grade}`);
      this.copied.set(true);
      window.setTimeout(() => this.copied.set(false), 2500);
    } catch {
      /* ignore */
    }
  }

  async share(h: HadithDetail): Promise<void> {
    try {
      await navigator.share({ title: h.title, text: h.hadeeth });
    } catch {
      /* ignore */
    }
  }
}
