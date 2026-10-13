import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';
import { UserDataService } from '../../core/services/user-data.service';
import { StorageService } from '../../core/services/storage.service';

const PHRASES = [
  'سبحان الله',
  'الحمد لله',
  'الله أكبر',
  'لا إله إلا الله',
  'أستغفر الله',
  'اللهم صل وسلم على نبينا محمد'
];

@Component({
  selector: 'app-tasbeeh',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page tasbeeh" [class.full]="fullscreen()">
      <h1 class="page-title">المسبحة الإلكترونية</h1>
      <div class="card pad">
        <label>الذكر
          <select [(ngModel)]="phrase">
            @for (p of phrases; track p) { <option [value]="p">{{ p }}</option> }
            <option value="custom">ذكر مخصص</option>
          </select>
        </label>
        @if (phrase === 'custom') {
          <input [(ngModel)]="custom" placeholder="اكتب الذكر" />
        }
        <label>الهدف
          <select [(ngModel)]="target">
            <option [ngValue]="33">33</option>
            <option [ngValue]="100">100</option>
            <option [ngValue]="0">مخصص</option>
          </select>
        </label>
        @if (target === 0) {
          <input type="number" min="1" [(ngModel)]="customTarget" />
        }
      </div>
      <button class="bead" type="button" (click)="inc()">{{ count() }}</button>
      <p>{{ activePhrase() }}</p>
      <p class="muted">{{ count() }} / {{ goal() }}</p>
      <div class="row">
        <button class="btn btn-ghost" type="button" (click)="undo()">تراجع</button>
        <button class="btn btn-ghost" type="button" (click)="confirmReset()">تصفير</button>
        <button class="btn btn-primary" type="button" (click)="newSession()">جلسة جديدة</button>
        <button class="btn btn-ghost" type="button" (click)="fullscreen.set(!fullscreen())">ملء الشاشة</button>
      </div>
      <p>اليوم: {{ user.todayTasbeehCount() }}</p>
      <ul>
        @for (s of user.tasbeehSessions().slice(0, 6); track s.id) {
          <li>{{ s.phrase }} · {{ s.count }}</li>
        }
      </ul>
    </section>
  `,
  styles: [`
    .pad { padding: 1rem; display: grid; gap: 0.6rem; }
    .bead {
      width: min(240px, 70vw); height: min(240px, 70vw); margin: 1.2rem auto;
      display: grid; place-items: center; border-radius: 50%; border: 0;
      background: radial-gradient(circle at 30% 30%, #c9d7ea, #1a3a68 62%, #071224);
      color: #fff; font-size: 3rem; font-weight: 800;
    }
    .row { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; }
    .full { position: fixed; inset: 0; z-index: 20; background: var(--color-ivory); padding-top: 2rem; }
  `]
})
export class TasbeehComponent {
  readonly settings = inject(SettingsService);
  readonly user = inject(UserDataService);
  private storage = inject(StorageService);
  phrases = PHRASES;
  phrase = 'سبحان الله';
  custom = '';
  target = 33;
  customTarget = 100;
  count = signal(this.storage.get('tasbeeh-count', 0));
  history = signal<number[]>([]);
  fullscreen = signal(false);

  @HostListener('window:keydown.space', ['$event'])
  onSpace(e: Event): void {
    e.preventDefault();
    this.inc();
  }

  activePhrase(): string {
    return this.phrase === 'custom' ? this.custom || 'ذكر مخصص' : this.phrase;
  }

  goal(): number {
    return this.target === 0 ? this.customTarget : this.target;
  }

  inc(): void {
    this.history.update((h) => [...h, this.count()]);
    const next = this.count() + 1;
    this.count.set(next);
    this.storage.set('tasbeeh-count', next);
    if (next === this.goal()) {
      if (this.settings.settings().tasbeehVibrate && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }
  }

  undo(): void {
    const prev = this.history();
    if (!prev.length) {
      return;
    }
    const last = prev[prev.length - 1];
    this.history.set(prev.slice(0, -1));
    this.count.set(last);
    this.storage.set('tasbeeh-count', last);
  }

  confirmReset(): void {
    if (confirm('هل تريد تصفير العداد؟ لن يُحذف سجل الجلسات.')) {
      this.count.set(0);
      this.storage.set('tasbeeh-count', 0);
    }
  }

  newSession(): void {
    this.user.addTasbeehSession({
      id: crypto.randomUUID(),
      phrase: this.activePhrase(),
      count: this.count(),
      target: this.goal(),
      startedAt: Date.now(),
      endedAt: Date.now()
    });
    this.count.set(0);
    this.storage.set('tasbeeh-count', 0);
  }
}
