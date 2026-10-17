import { Component, inject, OnInit, signal } from '@angular/core';
import { RadioService } from '../../core/services/radio.service';
import { RadioStation } from '../../core/models/radio.model';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">الراديو الإسلامي</h1>
      <p class="page-sub">
        بث مباشر لإذاعات القرآن الكريم، مع إذاعة القرآن الكريم من القاهرة ومؤذنين وقُرّاء مصريين كبار.
      </p>

      @if (radio.error(); as err) {
        <p class="error-card card">{{ err }}</p>
      }

      @if (!query()) {
        <h2 class="sec-title"><app-icon name="radio" /> إذاعات مصرية</h2>
        <div class="featured">
          @for (s of egyptFeatured(); track s.id) {
            <button
              type="button"
              class="feat-card card"
              [class.active]="radio.current()?.id === s.id"
              (click)="toggle(s)"
            >
              <span class="lead">
                <app-icon [name]="radio.current()?.id === s.id && radio.playing() ? 'pause' : 'play'" />
              </span>
              <span class="f-txt">
                <strong>{{ s.name }}</strong>
                <small class="muted">{{ s.country }}</small>
              </span>
              @if (radio.current()?.id === s.id && radio.loading()) {
                <span class="live muted">جارٍ الاتصال…</span>
              } @else if (radio.current()?.id === s.id && radio.playing()) {
                <span class="live"><i></i> يُبثّ الآن</span>
              }
            </button>
          }
        </div>
      }

      <div class="toolbar card">
        <label class="search">
          <app-icon name="search" />
          <input type="search" placeholder="ابحث عن قارئ أو إذاعة…" [value]="query()" (input)="query.set($any($event.target).value)" />
        </label>
        <button class="btn btn-ghost" type="button" (click)="reload()"><app-icon name="refresh" /> تحديث القائمة</button>
      </div>

      <div class="stations">
        @for (s of filtered(); track s.id) {
          <button type="button" class="station card" [class.active]="radio.current()?.id === s.id" (click)="toggle(s)">
            <span class="lead">
              <app-icon [name]="radio.current()?.id === s.id && radio.playing() ? 'pause' : 'play'" />
            </span>
            <span class="s-name">{{ s.name }}</span>
            @if (s.country) {
              <span class="chip s-country">{{ s.country }}</span>
            }
            @if (radio.current()?.id === s.id && radio.loading()) {
              <span class="muted small">جارٍ الاتصال…</span>
            } @else if (radio.current()?.id === s.id && radio.playing()) {
              <span class="live"><i></i> يُبثّ الآن</span>
            }
          </button>
        } @empty {
          <p class="muted">لا توجد نتائج مطابقة.</p>
        }
      </div>

      @if (radio.current(); as c) {
        <div class="now card">
          <div class="n-info">
            <span class="lead"><app-icon name="radio" /></span>
            <div>
              <strong>{{ c.name }}</strong>
              <small class="muted">{{ radio.playing() ? 'يُبثّ الآن' : 'متوقف' }}</small>
            </div>
          </div>
          <div class="n-controls">
            <button class="btn btn-gold" type="button" (click)="toggle(c)">
              <app-icon [name]="radio.playing() ? 'pause' : 'play'" /> {{ radio.playing() ? 'إيقاف' : 'تشغيل' }}
            </button>
            <label class="vol">
              <app-icon name="headset" />
              <input type="range" min="0" max="1" step="0.05" [value]="radio.volume()" (input)="radio.setVolume(+$any($event.target).value)" />
            </label>
          </div>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .error-card { padding: 0.9rem 1rem; color: var(--color-danger); border-color: color-mix(in srgb, var(--color-danger) 40%, transparent); margin-bottom: 1rem; }
      .sec-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; margin: 0.3rem 0 0.6rem; }
      .sec-title app-icon { color: var(--color-gold); }
      .featured { display: grid; gap: 0.55rem; margin-bottom: 1.1rem; }
      .feat-card {
        display: flex; align-items: center; gap: 0.7rem; padding: 0.85rem 0.9rem;
        text-align: start; width: 100%;
        border-color: color-mix(in srgb, var(--color-gold) 32%, transparent);
        background: color-mix(in srgb, var(--color-gold) 6%, var(--color-surface));
      }
      .feat-card.active { border-color: color-mix(in srgb, var(--color-gold) 55%, transparent); background: color-mix(in srgb, var(--color-gold) 12%, var(--color-surface)); }
      .f-txt { display: flex; flex-direction: column; line-height: 1.25; flex: 1; }
      .f-txt small { font-size: 0.72rem; }
      .toolbar { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.8rem; margin-bottom: 1rem; flex-wrap: wrap; }
      .search { display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 200px; color: var(--color-muted); }
      .search input { flex: 1; border: 0; background: transparent; min-height: 38px; }
      .search input:focus { outline: none; }
      .stations { display: grid; gap: 0.55rem; }
      .station { display: flex; align-items: center; gap: 0.7rem; padding: 0.85rem 0.9rem; text-align: start; width: 100%; }
      .station.active { border-color: color-mix(in srgb, var(--color-gold) 50%, transparent); background: color-mix(in srgb, var(--color-gold) 9%, var(--color-surface)); }
      .lead { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; color: var(--color-gold); background: color-mix(in srgb, var(--color-gold) 12%, transparent); flex: 0 0 auto; }
      .s-name { font-weight: 600; }
      .s-country { margin-inline-start: auto; font-size: 0.7rem; }
      .small { font-size: 0.75rem; }
      .live { margin-inline-start: auto; display: inline-flex; align-items: center; gap: 0.35rem; color: var(--color-success); font-size: 0.78rem; font-weight: 700; }
      .live i { width: 8px; height: 8px; border-radius: 50%; background: var(--color-success); animation: pulse 1.4s ease infinite; }
      .now {
        position: sticky; bottom: calc(5.4rem + var(--safe-bottom));
        display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        padding: 0.9rem 1rem; margin-top: 1rem; flex-wrap: wrap;
        border-color: color-mix(in srgb, var(--color-gold) 40%, transparent);
      }
      .n-info { display: flex; align-items: center; gap: 0.7rem; }
      .n-info strong { display: block; }
      .n-controls { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; }
      .vol { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--color-muted); }
      .vol input { width: 120px; }
      @keyframes pulse { 50% { opacity: 0.3; } }
      @media (min-width: 900px) { .now { bottom: 1.4rem; } }
    `
  ]
})
export class RadioComponent implements OnInit {
  readonly radio = inject(RadioService);
  readonly query = signal('');

  egyptFeatured(): RadioStation[] {
    return this.radio.stations().filter((s) => s.category === 'egypt');
  }

  filtered(): RadioStation[] {
    const q = this.query().trim();
    const list = this.radio.stations();
    if (q) {
      return list.filter((s) => s.name.includes(q));
    }
    return list.filter((s) => s.category !== 'egypt');
  }

  ngOnInit(): void {
    void this.radio.loadStations();
  }

  toggle(station: RadioStation): void {
    if (this.radio.current()?.id === station.id && this.radio.playing()) {
      this.radio.stop();
      return;
    }
    this.radio.play(station);
  }

  reload(): void {
    void this.radio.loadStations();
  }
}
