import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../../core/services/user-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { Reminder } from '../../core/models/settings.model';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page">
      <h1 class="page-title">التذكيرات</h1>
      <p class="page-sub">تذكيرات محلية اختيارية. تعمل أثناء فتح الموقع، وبإشعار المتصفح إن سُمح بذلك.</p>
      <p>حالة الإشعارات: {{ notify.permission() }}</p>
      <button class="btn btn-primary" type="button" (click)="notify.requestPermission()">تفعيل إشعارات المتصفح</button>
      @for (r of user.reminders(); track r.id) {
        <article class="card pad">
          <strong>{{ r.title }}</strong>
          <input [(ngModel)]="r.message" (change)="save()" />
          <div class="row">
            <input type="number" min="0" max="23" [(ngModel)]="r.hour" (change)="save()" />
            :
            <input type="number" min="0" max="59" [(ngModel)]="r.minute" (change)="save()" />
          </div>
          <label><input type="checkbox" [(ngModel)]="r.enabled" (change)="save()" /> مفعّل</label>
          <label><input type="checkbox" [(ngModel)]="r.sound" (change)="save()" /> صوت</label>
        </article>
      }
      <form class="card pad" (submit)="$event.preventDefault(); add()">
        <h2>تذكير مخصص</h2>
        <input [(ngModel)]="title" name="title" placeholder="العنوان" required />
        <input [(ngModel)]="message" name="message" placeholder="الرسالة" />
        <input type="time" [(ngModel)]="time" name="time" />
        <button class="btn btn-gold" type="submit">إضافة</button>
      </form>
    </section>
  `,
  styles: [`
    .pad { padding: 1rem; display: grid; gap: 0.5rem; margin: 0.8rem 0; }
    .row { display: flex; gap: 0.3rem; align-items: center; }
    input { min-height: 40px; }
  `]
})
export class RemindersComponent {
  readonly user = inject(UserDataService);
  readonly notify = inject(NotificationService);
  title = '';
  message = '';
  time = '09:00';

  save(): void {
    this.user.saveReminders([...this.user.reminders()]);
  }

  add(): void {
    const [hour, minute] = this.time.split(':').map(Number);
    const item: Reminder = {
      id: crypto.randomUUID(),
      title: this.title,
      message: this.message || this.title,
      hour,
      minute,
      days: [0, 1, 2, 3, 4, 5, 6],
      enabled: true,
      sound: false
    };
    this.user.saveReminders([item, ...this.user.reminders()]);
    this.title = '';
    this.message = '';
  }
}
