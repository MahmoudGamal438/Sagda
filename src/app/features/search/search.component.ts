import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { QuranService } from '../../core/services/quran.service';
import { AdhkarService } from '../../core/services/adhkar.service';
import { Ayah } from '../../core/models/quran.model';
import { StateBlockComponent } from '../../shared/state-block.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, RouterLink, StateBlockComponent],
  template: `
    <section class="page">
      <h1 class="page-title">البحث الشامل</h1>
      <form class="card pad" (submit)="$event.preventDefault(); run()">
        <input [(ngModel)]="q" name="q" placeholder="سورة أو آية أو ذكر" />
        <button class="btn btn-primary" type="submit">بحث</button>
      </form>
      @if (loading()) {
        <app-state-block kind="loading" title="جارٍ البحث" message="قد يستغرق ثوانٍ." />
      }
      @if (error()) {
        <app-state-block kind="error" title="تعذر البحث في القرآن" [message]="error()!" />
      }
      <h2>الأذكار</h2>
      @for (h of dhikrHits(); track h.itemId) {
        <a class="card pad" [routerLink]="['/adhkar/read', h.category.id]">{{ h.category.title }}</a>
      }
      <h2>الآيات</h2>
      @for (a of ayahs(); track a.number) {
        <article class="card pad">
          <p class="ayah">{{ a.text }}</p>
          <small>آية رقم {{ a.number }}</small>
        </article>
      }
    </section>
  `,
  styles: [`
    .pad { padding: 0.9rem; margin: 0.5rem 0; display: grid; gap: 0.5rem; }
    .ayah { font-family: var(--font-quran); }
  `]
})
export class SearchComponent {
  private quran = inject(QuranService);
  private adhkar = inject(AdhkarService);
  q = '';
  ayahs = signal<Ayah[]>([]);
  dhikrHits = signal(this.adhkar.search(''));
  loading = signal(false);
  error = signal<string | null>(null);

  async run(): Promise<void> {
    this.dhikrHits.set(this.adhkar.search(this.q));
    this.loading.set(true);
    this.error.set(null);
    try {
      this.ayahs.set(await this.quran.search(this.q));
    } catch {
      this.error.set('البحث في نص القرآن يحتاج اتصالًا.');
    } finally {
      this.loading.set(false);
    }
  }
}
