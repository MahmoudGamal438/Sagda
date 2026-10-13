import { Component } from '@angular/core';
import { ASMA_UL_HUSNA } from '../../core/data/asma.data';

@Component({
  selector: 'app-asma',
  standalone: true,
  template: `
    <section class="page">
      <h1 class="page-title">أسماء الله الحسنى</h1>
      <p class="page-sub">معانٍ مختصرة موثّقة حيث أمكن. بعض الأسماء المشهورة محل بحث عند أهل العلم في ثبوت العدد تسعة وتسعين بلفظ معيّن.</p>
      <div class="grid">
        @for (n of names; track n.number) {
          <article class="card item">
            <span>{{ n.number }}</span>
            <h2>{{ n.arabic }}</h2>
            <p>{{ n.meaning }}</p>
            <small class="muted">{{ n.note }}</small>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
    .item { padding: 1rem; text-align: center; }
    h2 { font-family: var(--font-quran); margin: 0.3rem 0; }
  `]
})
export class AsmaComponent {
  readonly names = ASMA_UL_HUSNA;
}
