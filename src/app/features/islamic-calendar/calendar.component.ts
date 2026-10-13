import { Component, inject } from '@angular/core';
import { PrayerService } from '../../core/services/prayer.service';
import { HIJRI_MONTHS, ISLAMIC_OCCASIONS } from '../../core/data/calendar.data';

@Component({
  selector: 'app-calendar',
  standalone: true,
  template: `
    <section class="page">
      <h1 class="page-title">التقويم الهجري</h1>
      <p class="page-sub">التواريخ التقريبية. الرؤية الشرعية قد تقدم أو تؤخر يومًا.</p>
      @if (prayer.today(); as day) {
        <article class="card pad">
          <h2>{{ day.date.hijri }}</h2>
          <p>{{ day.date.gregorian }}</p>
        </article>
      }
      <div class="grid">
        @for (o of occasions; track o.title) {
          <article class="card pad">
            <strong>{{ o.title }}</strong>
            <p>{{ o.hijriDay }} {{ months[o.hijriMonth - 1] }}</p>
            <small class="muted">{{ o.note }}</small>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .pad { padding: 1rem; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); margin-top: 1rem; }
  `]
})
export class CalendarComponent {
  readonly prayer = inject(PrayerService);
  readonly occasions = ISLAMIC_OCCASIONS;
  readonly months = HIJRI_MONTHS;
}
