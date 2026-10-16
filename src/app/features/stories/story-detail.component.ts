import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PROPHET_STORIES, ProphetStory } from '../../core/data/stories.data';
import { IconComponent } from '../../shared/icon.component';
import { StateBlockComponent } from '../../shared/state-block.component';

@Component({
  selector: 'app-story-detail',
  standalone: true,
  imports: [RouterLink, IconComponent, StateBlockComponent],
  template: `
    <section class="page">
      <a class="back" routerLink="/stories"><app-icon name="chevronRight" /> كل القصص</a>

      @if (story(); as s) {
        <header class="card head">
          <span class="lead"><app-icon name="scroll" /></span>
          <div>
            <h1>{{ s.title }}</h1>
            <p class="muted">{{ s.summary }}</p>
          </div>
        </header>

        <div class="parts">
          @for (p of s.parts; track p.title; let i = $index) {
            <article class="card part">
              <h2><span class="n">{{ i + 1 }}</span> {{ p.title }}</h2>
              <p class="text">{{ p.text }}</p>
              <div class="refs">
                @for (r of p.refs; track r) {
                  <span class="chip"><app-icon name="book" /> {{ r }}</span>
                }
              </div>
            </article>
          }
        </div>

        <p class="muted note">
          المرجع: القرآن الكريم. لتفصيل أدق يُرجع إلى كتب التفسير والسيرة المعتمدة، ولا نجزم بما لم يثبت.
        </p>
      } @else {
        <app-state-block kind="error" title="غير موجود" message="لم يُعثر على القصة المطلوبة." />
      }
    </section>
  `,
  styles: [
    `
      .back { display: inline-flex; align-items: center; gap: 0.3rem; color: var(--color-muted); margin-bottom: 0.8rem; font-weight: 600; }
      .head { display: flex; gap: 0.9rem; padding: 1.2rem; margin-bottom: 1rem; }
      .head h1 { margin: 0 0 0.3rem; font-size: 1.35rem; color: var(--color-gold); }
      .head p { margin: 0; line-height: 1.8; }
      .lead { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 15px; color: var(--color-gold); background: color-mix(in srgb, var(--color-gold) 12%, transparent); flex: 0 0 auto; }
      .parts { display: grid; gap: 0.8rem; }
      .part { padding: 1.1rem 1.2rem; }
      .part h2 { display: flex; align-items: center; gap: 0.6rem; margin: 0 0 0.6rem; font-size: 1.05rem; }
      .part h2 .n { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; font-size: 0.8rem; color: var(--color-gold); border: 1px solid color-mix(in srgb, var(--color-gold) 40%, transparent); }
      .text { margin: 0 0 0.7rem; line-height: 2.1; font-size: 1.02rem; }
      .refs { display: flex; flex-wrap: wrap; gap: 0.4rem; }
      .note { margin-top: 1rem; line-height: 1.9; font-size: 0.82rem; }
    `
  ]
})
export class StoryDetailComponent {
  private route = inject(ActivatedRoute);
  readonly story = signal<ProphetStory | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    this.story.set(PROPHET_STORIES.find((s) => s.id === id) ?? null);
  }
}
