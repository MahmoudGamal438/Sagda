import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserDataService } from '../../core/services/user-data.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="page">
      <h1 class="page-title">الإحصائيات والنشاط</h1>
      <div class="grid two">
        <article class="card pad"><p>تسبيح اليوم</p><strong>{{ user.todayTasbeehCount() }}</strong></article>
        <article class="card pad"><p>المفضلة</p><strong>{{ user.favorites().length }}</strong></article>
        <article class="card pad">
          <p>الختمة</p>
          <strong>{{ user.khatma()?.completedAyahs || 0 }}</strong>
        </article>
        <article class="card pad"><p>جلسات المسبحة</p><strong>{{ user.tasbeehSessions().length }}</strong></article>
      </div>
      <h2>السجل</h2>
      @for (a of user.activity(); track a.id) {
        <p>{{ a.title }} · {{ a.at | date: 'short' }}</p>
      }
    </section>
  `,
  styles: [`.pad { padding: 1rem; } .two { grid-template-columns: 1fr 1fr; }`]
})
export class StatsComponent {
  readonly user = inject(UserDataService);
}
