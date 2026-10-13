import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdhkarService } from '../../core/services/adhkar.service';

@Component({
  selector: 'app-adhkar-library',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page">
      <h1 class="page-title">مكتبة الأذكار</h1>
      <p class="page-sub">نصوص مختارة مما اشتهر في حصن المسلم مع ذكر المصدر. ليست موسوعة حديثية كاملة.</p>
      <div class="grid">
        @for (c of adhkar.categories; track c.id) {
          <a class="card item" [routerLink]="['/adhkar/read', c.id]">
            <strong>{{ c.title }}</strong>
            <p>{{ c.description }}</p>
            <span>{{ c.items.length }} ذكرًا</span>
          </a>
        }
      </div>
    </section>
  `,
  styles: [`
    .grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
    .item { padding: 1rem; }
    p { color: var(--color-muted); }
  `]
})
export class AdhkarLibraryComponent {
  readonly adhkar = inject(AdhkarService);
}
