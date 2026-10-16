import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AssistantService, AssistantResult } from '../../core/services/assistant.service';
import { QuranService } from '../../core/services/quran.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">المساعد</h1>
      <p class="page-sub">
        مساعد للوصول إلى أقسام سجدة ومحتواها: يبحث في الأذكار والسور والأسماء والقصص والأقسام
        ويوجّهك إليها. لا يختلق آيات أو أحاديث أو فتاوى، والمسائل الشرعية الدقيقة تُرجع إلى أهل العلم.
      </p>

      <div class="ask card">
        <app-icon name="sparkles" class="lead" />
        <input
          type="search"
          placeholder="اكتب: الفجر، آية الكرسي، يوسف، الرحمن…"
          [ngModel]="query()"
          (ngModelChange)="onQuery($event)"
          (keyup.enter)="run()"
        />
        <button class="btn btn-gold" type="button" (click)="run()"><app-icon name="search" /> ابحث</button>
      </div>

      @if (!query().trim()) {
        <div class="suggest">
          <p class="muted">اقتراحات سريعة:</p>
          <div class="chips">
            @for (s of suggestions; track s) {
              <button type="button" class="chip-btn" (click)="quick(s)">{{ s }}</button>
            }
          </div>
        </div>
      }

      @if (searched() && !results().length && query().trim().length >= 2) {
        <p class="card no-result">
          لم أجد نتيجة مطابقة داخل التطبيق. جرّب كلمة أقصر أو افتح البحث العام في المصحف.
        </p>
      }

      <div class="results">
        @for (r of results(); track r.path + r.title) {
          <button type="button" class="result card" (click)="open(r)">
            <span class="lead"><app-icon [name]="r.icon" /></span>
            <span class="r-body">
              <strong>{{ r.title }}</strong>
              <small>{{ r.context }}</small>
            </span>
            <span class="kind">{{ r.kind }}</span>
            <app-icon name="chevronLeft" class="arrow" />
          </button>
        }
      </div>

      <p class="disclaimer muted">
        تنبيه: هذا المساعد أداة تنقّل وبحث داخل التطبيق فقط. لا يجيب عن الفتاوى ولا ينشئ نصوصًا
        دينية، ويحيل المسائل الدقيقة إلى المصادر الموثوقة وأهل العلم.
      </p>
    </section>
  `,
  styles: [
    `
      .ask { display: flex; align-items: center; gap: 0.6rem; padding: 0.7rem 0.9rem; margin-bottom: 1rem; flex-wrap: wrap; }
      .ask .lead { color: var(--color-gold); }
      .ask input { flex: 1; min-width: 180px; border: 0; background: transparent; min-height: 42px; font-size: 1rem; }
      .ask input:focus { outline: none; }
      .suggest { margin-bottom: 1rem; }
      .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
      .chip-btn { padding: 0.4rem 0.85rem; border-radius: 999px; border: 1px solid var(--color-line); background: var(--color-surface); color: var(--color-ink); font-weight: 600; font-size: 0.85rem; }
      .no-result { padding: 1.1rem; text-align: center; color: var(--color-muted); }
      .results { display: grid; gap: 0.55rem; }
      .result { display: flex; align-items: center; gap: 0.7rem; padding: 0.85rem 0.95rem; width: 100%; text-align: start; }
      .lead { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; color: var(--color-gold); background: color-mix(in srgb, var(--color-gold) 12%, transparent); flex: 0 0 auto; }
      .r-body { display: flex; flex-direction: column; gap: 0.15rem; }
      .r-body small { color: var(--color-muted); font-size: 0.76rem; }
      .kind { margin-inline-start: auto; font-size: 0.68rem; color: var(--color-gold); border: 1px solid color-mix(in srgb, var(--color-gold) 35%, transparent); border-radius: 999px; padding: 0.15rem 0.55rem; }
      .arrow { color: var(--color-muted); }
      .disclaimer { margin-top: 1.3rem; line-height: 1.9; font-size: 0.8rem; }
    `
  ]
})
export class AssistantComponent implements OnInit {
  private assistant = inject(AssistantService);
  private quran = inject(QuranService);
  private router = inject(Router);

  readonly query = signal('');
  readonly results = signal<AssistantResult[]>([]);
  readonly searched = signal(false);
  readonly suggestions = ['الفجر', 'آية الكرسي', 'القبلة', 'المسبحة', 'يوسف', 'الرحمن', 'الرقية', 'الورد'];

  ngOnInit(): void {
    void this.quran.loadSurahList();
  }

  onQuery(value: string): void {
    this.query.set(value);
    if (value.trim().length >= 2) {
      this.run();
    } else {
      this.results.set([]);
      this.searched.set(false);
    }
  }

  run(): void {
    this.results.set(this.assistant.search(this.query()));
    this.searched.set(true);
  }

  quick(value: string): void {
    this.query.set(value);
    this.run();
  }

  open(r: AssistantResult): void {
    void this.router.navigateByUrl(r.path);
  }
}
