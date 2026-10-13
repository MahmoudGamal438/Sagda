import { Component, inject } from '@angular/core';
import { InstallService } from '../core/services/install.service';

@Component({
  selector: 'app-install-banner',
  standalone: true,
  template: `
    @if (install.showBanner() && !install.installed()) {
      <div class="banner card" role="dialog" aria-label="تثبيت التطبيق">
        <p>ثبّت سجدة على هاتفك، واجعل القرآن والأذكار ومواقيت الصلاة أقرب إليك في كل يوم.</p>
        @if (install.isIos && !install.canPrompt()) {
          <p class="hint">على iPhone: شارك ثم «إضافة إلى الشاشة الرئيسية».</p>
        }
        <div class="row">
          @if (install.canPrompt()) {
            <button type="button" class="btn btn-gold" (click)="installNow()">تثبيت التطبيق</button>
          }
          <button type="button" class="btn btn-ghost" (click)="install.dismiss()">ليس الآن</button>
        </div>
      </div>
    }
  `,
  styles: [`
    .banner {
      position: fixed;
      inset-inline: 0.8rem;
      bottom: calc(5.2rem + var(--safe-bottom));
      z-index: 12;
      padding: 1rem;
    }
    .hint { color: var(--color-muted); font-size: 0.9rem; }
    .row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    @media (min-width: 900px) {
      .banner { bottom: 1.2rem; width: min(420px, calc(100% - 2rem)); inset-inline-end: 1rem; inset-inline-start: auto; }
    }
  `]
})
export class InstallBannerComponent {
  readonly install = inject(InstallService);

  async installNow(): Promise<void> {
    await this.install.install();
  }
}
