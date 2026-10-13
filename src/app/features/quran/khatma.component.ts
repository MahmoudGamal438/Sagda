import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../../core/services/user-data.service';

@Component({
  selector: 'app-khatma',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page">
      <h1 class="page-title">الختمة والورد</h1>
      <p class="page-sub">الخطة محلية على جهازك. عدد آيات المصحف المعتمد هنا 6236 وفق العدّ الكوفي.</p>
      <form class="card pad" (submit)="$event.preventDefault(); user.setKhatma(days)">
        <label>أكمل الختمة خلال
          <input type="number" min="7" max="365" [(ngModel)]="days" name="days" /> يومًا
        </label>
        <button class="btn btn-primary" type="submit">إنشاء الخطة</button>
      </form>
      @if (user.khatma(); as k) {
        <article class="card pad">
          <p>الورد اليومي التقريبي: <strong>{{ k.dailyAyahs }}</strong> آية</p>
          <p>التقدم: {{ k.completedAyahs }} / 6236</p>
          <div class="bar"><span [style.width.%]="(k.completedAyahs / 6236) * 100"></span></div>
          <button class="btn btn-gold" type="button" (click)="user.addKhatmaProgress(k.dailyAyahs)">سجّل ورد اليوم</button>
        </article>
      }
    </section>
  `,
  styles: [`
    .pad { padding: 1rem; display: grid; gap: 0.7rem; }
    .bar { height: 10px; background: rgba(18,38,74,.12); border-radius: 99px; overflow: hidden; }
    .bar span { display: block; height: 100%; background: var(--color-emerald-600); }
  `]
})
export class KhatmaComponent {
  readonly user = inject(UserDataService);
  days = 30;
}
