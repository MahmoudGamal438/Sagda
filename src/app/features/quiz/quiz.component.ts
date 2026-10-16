import { Component, computed, inject, signal } from '@angular/core';
import { QuizService } from '../../core/services/quiz.service';
import { QUIZ_CATEGORIES, QUIZ_LEVELS, QuizCategory, QuizLevel, QuizQuestion } from '../../core/data/quiz.data';
import { IconComponent } from '../../shared/icon.component';

type View = 'setup' | 'playing' | 'result';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">اختبارات وأسئلة دينية</h1>
      <p class="page-sub">
        أسئلة مبسّطة غير خلافية مع الشرح والمصدر حيث يتوفر. تُحفظ نتائجك محليًا على جهازك.
      </p>

      @switch (view()) {
        @case ('setup') {
          <article class="card pad daily">
            <div class="d-head">
              <span class="lead"><app-icon name="sparkles" /></span>
              <div>
                <strong>تحدّي اليوم</strong>
                <p class="muted small">سؤال واحد متجدد كل يوم.</p>
              </div>
              @if (quiz.dailyDone()) {
                <span class="chip">أُنجز اليوم</span>
              }
            </div>
            <button class="btn btn-gold" type="button" (click)="startDaily()">
              {{ quiz.dailyDone() ? 'إعادة السؤال' : 'ابدأ التحدي' }}
            </button>
          </article>

          <div class="grid stats">
            <div class="card stat"><strong>{{ quiz.progress().points }}</strong><span>مجموع النقاط</span></div>
            <div class="card stat"><strong>{{ quiz.accuracy() }}%</strong><span>الدقة</span></div>
            <div class="card stat"><strong>{{ quiz.progress().taken }}</strong><span>اختبارات</span></div>
            <div class="card stat"><strong>{{ quiz.progress().bestStreak }}</strong><span>أطول سلسلة</span></div>
          </div>

          <h2 class="h">اختر اختبارًا</h2>
          <div class="cats">
            @for (c of categories; track c.id) {
              <button type="button" class="cat" [class.active]="category() === c.id" (click)="category.set(c.id)">
                <app-icon [name]="c.icon" /> {{ c.title }}
              </button>
            }
          </div>
          <div class="levels">
            @for (l of levels; track l.id) {
              <button type="button" class="level" [class.active]="level() === l.id" (click)="level.set(l.id)">
                {{ l.title }}
                <small>{{ count(l.id) }} سؤال</small>
              </button>
            }
          </div>

          <button class="btn btn-primary start" type="button" [disabled]="!count(level())" (click)="start()">
            <app-icon name="play" /> ابدأ الاختبار
          </button>
        }

        @case ('playing') {
          @if (current(); as q) {
            <article class="card pad question">
              <div class="q-top">
                <span class="chip">سؤال {{ index() + 1 }} / {{ total() }}</span>
                <span class="chip">النقاط: {{ score() }}</span>
              </div>
              <h2 class="q-text">{{ q.question }}</h2>
              <div class="options">
                @for (opt of q.options; track $index) {
                  <button
                    type="button"
                    class="option"
                    [class.correct]="answered() && $index === q.answer"
                    [class.wrong]="answered() && $index === selected() && $index !== q.answer"
                    [disabled]="answered()"
                    (click)="choose($index)"
                  >
                    <span class="dot">{{ letters[$index] }}</span>
                    {{ opt }}
                    @if (answered() && $index === q.answer) {
                      <app-icon name="check" class="mark" />
                    }
                  </button>
                }
              </div>

              @if (answered()) {
                <div class="feedback" [class.ok]="selected() === q.answer">
                  <strong>{{ selected() === q.answer ? 'إجابة صحيحة' : 'إجابة غير صحيحة' }}</strong>
                  <p>{{ q.explanation }}</p>
                  @if (q.source) {
                    <small class="muted">{{ q.source }}</small>
                  }
                  <button class="btn btn-primary" type="button" (click)="next()">
                    {{ isLast() ? 'عرض النتيجة' : 'السؤال التالي' }}
                  </button>
                </div>
              }
            </article>
          }
        }

        @case ('result') {
          <article class="card pad result">
            <div class="ring" [style.--pct]="pct() + '%'">
              <span>{{ score() }}</span>
              <small>من {{ total() }}</small>
            </div>
            <h2>{{ message() }}</h2>
            <p class="muted">الدقة في هذه الجولة: {{ pct() }}%</p>
            <div class="row">
              <button class="btn btn-primary" type="button" (click)="start()"><app-icon name="refresh" /> إعادة</button>
              <button class="btn btn-ghost" type="button" (click)="view.set('setup')"><app-icon name="home" /> الرئيسية</button>
            </div>
          </article>
        }
      }
    </section>
  `,
  styles: [
    `
      .pad { padding: 1.2rem; }
      .small { font-size: 0.78rem; margin: 0.15rem 0 0; }
      .daily { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.8rem; }
      .d-head { display: flex; align-items: center; gap: 0.7rem; }
      .lead { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 14px; color: var(--color-gold); background: color-mix(in srgb, var(--color-gold) 12%, transparent); }
      .stats { grid-template-columns: repeat(4, 1fr); margin: 1rem 0; }
      .stat { display: flex; flex-direction: column; align-items: center; padding: 0.9rem; gap: 0.2rem; }
      .stat strong { font-size: 1.4rem; color: var(--color-gold); }
      .stat span { font-size: 0.72rem; color: var(--color-muted); }
      .h { margin: 0.5rem 0 0.7rem; font-size: 1.05rem; }
      .cats, .levels { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.8rem; }
      .cat, .level {
        display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.5rem 0.9rem;
        border-radius: 999px; border: 1px solid var(--color-line); background: var(--color-surface);
        font-weight: 600; color: var(--color-ink);
      }
      .level { flex-direction: column; gap: 0; padding: 0.55rem 1.1rem; }
      .level small { color: var(--color-muted); font-size: 0.68rem; }
      .cat.active, .level.active { background: var(--nav-active-bg); color: var(--nav-active-on-bg); border-color: transparent; box-shadow: var(--shadow-gold); }
      .level.active small { color: rgba(11, 20, 40, 0.7); }
      .start { width: 100%; margin-top: 0.5rem; }
      .question { display: grid; gap: 1rem; }
      .q-top { display: flex; justify-content: space-between; }
      .q-text { margin: 0; font-size: 1.2rem; line-height: 1.8; }
      .options { display: grid; gap: 0.6rem; }
      .option {
        display: flex; align-items: center; gap: 0.7rem; padding: 0.9rem 1rem; text-align: start;
        border-radius: var(--radius-sm); border: 1px solid var(--color-line);
        background: var(--color-surface); font-size: 0.95rem; font-weight: 600; color: var(--color-ink);
        transition: all 0.15s ease;
      }
      .option .dot {
        display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%;
        border: 1px solid color-mix(in srgb, var(--color-gold) 40%, transparent); color: var(--color-gold);
        font-size: 0.8rem; flex: 0 0 auto;
      }
      .option .mark { margin-inline-start: auto; color: var(--color-success); }
      .option.correct { border-color: var(--color-success); background: rgba(63, 178, 127, 0.12); }
      .option.wrong { border-color: var(--color-danger); background: rgba(224, 122, 106, 0.12); }
      .feedback { border-top: 1px solid var(--color-line); padding-top: 0.9rem; display: grid; gap: 0.5rem; }
      .feedback strong { color: var(--color-danger); }
      .feedback.ok strong { color: var(--color-success); }
      .feedback p { margin: 0; line-height: 1.9; }
      .result { display: grid; justify-items: center; gap: 0.7rem; text-align: center; }
      .ring {
        width: 130px; height: 130px; border-radius: 50%; display: grid; place-items: center; gap: 0;
        background:
          radial-gradient(closest-side, var(--color-surface-strong) 78%, transparent 79%),
          conic-gradient(var(--color-gold) var(--pct), color-mix(in srgb, var(--color-gold) 15%, transparent) 0);
      }
      .ring span { font-size: 2rem; font-weight: 800; }
      .ring small { color: var(--color-muted); }
      .row { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }

      @media (max-width: 560px) {
        .stats { grid-template-columns: repeat(2, 1fr); }
      }
    `
  ]
})
export class QuizComponent {
  readonly quiz = inject(QuizService);
  readonly categories = QUIZ_CATEGORIES;
  readonly levels = QUIZ_LEVELS;
  readonly letters = ['أ', 'ب', 'ج', 'د', 'هـ'];

  readonly view = signal<View>('setup');
  readonly category = signal<QuizCategory>('quran');
  readonly level = signal<QuizLevel>('beginner');
  readonly questions = signal<QuizQuestion[]>([]);
  readonly index = signal(0);
  readonly score = signal(0);
  readonly streak = signal(0);
  readonly bestStreak = signal(0);
  readonly selected = signal<number | null>(null);
  readonly answered = signal(false);
  readonly isDaily = signal(false);

  readonly current = computed(() => this.questions()[this.index()]);
  readonly total = computed(() => this.questions().length);
  readonly isLast = computed(() => this.index() >= this.total() - 1);
  readonly pct = computed(() => (this.total() ? Math.round((this.score() / this.total()) * 100) : 0));
  readonly message = computed(() => {
    const p = this.pct();
    if (p === 100) return 'ممتاز، إجابات كاملة!';
    if (p >= 70) return 'أداء جيد، واصل التقدّم.';
    if (p >= 40) return 'بداية طيبة، راجع الشرح وأعد المحاولة.';
    return 'لا بأس، التعلم رحلة. أعد المحاولة.';
  });

  count(level: QuizLevel): number {
    return this.quiz.questions(this.category(), level).length;
  }

  start(): void {
    const list = [...this.quiz.questions(this.category(), this.level())];
    if (!list.length) {
      return;
    }
    this.isDaily.set(false);
    this.questions.set(this.shuffle(list));
    this.beginRound();
  }

  startDaily(): void {
    const q = this.quiz.dailyQuestion();
    this.isDaily.set(true);
    this.questions.set([q]);
    this.beginRound();
    this.quiz.markDaily();
  }

  private beginRound(): void {
    this.index.set(0);
    this.score.set(0);
    this.streak.set(0);
    this.bestStreak.set(0);
    this.selected.set(null);
    this.answered.set(false);
    this.view.set('playing');
  }

  choose(i: number): void {
    if (this.answered()) {
      return;
    }
    this.selected.set(i);
    this.answered.set(true);
    const q = this.current();
    if (q && i === q.answer) {
      this.score.update((s) => s + 1);
      this.streak.update((s) => {
        const v = s + 1;
        this.bestStreak.update((b) => Math.max(b, v));
        return v;
      });
    } else {
      this.streak.set(0);
    }
  }

  next(): void {
    if (this.isLast()) {
      this.finish();
      return;
    }
    this.index.update((i) => i + 1);
    this.selected.set(null);
    this.answered.set(false);
  }

  private finish(): void {
    this.quiz.record({
      answered: this.total(),
      correct: this.score(),
      streak: this.bestStreak()
    });
    this.view.set('result');
  }

  private shuffle(list: QuizQuestion[]): QuizQuestion[] {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
