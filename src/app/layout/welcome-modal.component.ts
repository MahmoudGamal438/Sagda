import { Component, inject, signal } from '@angular/core';
import { SettingsService, DEFAULT_DUA } from '../core/services/settings.service';

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="overlay" role="dialog" aria-labelledby="welcome-title" aria-modal="true">
        <article class="card sheet">
          <p class="eyebrow">دعاء شخصي · ليس قرآنًا ولا حديثًا</p>
          <h2 id="welcome-title">مرحبًا بك في سجدة</h2>
          <blockquote>{{ settings.settings().personalDua || defaultDua }}</blockquote>
          <div class="actions">
            <button type="button" class="btn btn-primary" (click)="start()">ابدأ رحلتك مع سجدة</button>
            <button type="button" class="btn btn-ghost" (click)="dismiss()">تخطي</button>
          </div>
        </article>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: rgba(7, 18, 36, 0.55);
    }
    .sheet {
      width: min(520px, 100%);
      padding: 1.6rem;
      text-align: center;
      animation: rise 0.45s ease;
    }
    .eyebrow {
      color: var(--color-gold-700);
      font-size: 0.85rem;
      margin: 0 0 0.4rem;
    }
    blockquote {
      font-family: var(--font-quran);
      font-size: 1.25rem;
      line-height: 2;
      margin: 1rem 0 1.4rem;
    }
    .actions { display: flex; flex-direction: column; gap: 0.5rem; }
    @keyframes rise {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: none; }
    }
  `]
})
export class WelcomeModalComponent {
  readonly settings = inject(SettingsService);
  readonly defaultDua = DEFAULT_DUA;
  readonly visible = signal(false);

  start(): void {
    this.close();
  }

  dismiss(): void {
    this.close();
  }

  private close(): void {
    localStorage.setItem('sujda:welcome-seen', '1');
    this.visible.set(false);
  }
}
