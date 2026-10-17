import { Component, inject } from '@angular/core';
import { InstallService } from '../core/services/install.service';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-install-banner',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (install.showBanner() && !install.installed()) {
      <div class="banner card" role="dialog" aria-label="تثبيت التطبيق">
        <button type="button" class="go" (click)="installNow()">
          <span class="icon"><app-icon name="download" /></span>
          <span class="txt">
            <strong>ثبّت سجدة</strong>
            <small class="muted">
              @if (install.isIos && !install.canPrompt()) {
                شارك ثم «إضافة إلى الشاشة الرئيسية»
              } @else {
                وصول أسرع للقرآن والمواقيت
              }
            </small>
          </span>
        </button>
        <button
          type="button"
          class="icon-btn"
          (click)="install.dismiss()"
          aria-label="إغلاق شريط التثبيت"
        >
          <app-icon name="close" />
        </button>
      </div>
    }
  `,
  styles: [
    `
      .banner {
        position: fixed;
        inset-inline-end: 0.8rem;
        bottom: calc(4.9rem + var(--safe-bottom));
        z-index: 12;
        display: flex;
        align-items: center;
        gap: 0.2rem;
        padding: 0.35rem 0.5rem;
        max-width: min(280px, calc(100% - 1.6rem));
        border-color: color-mix(in srgb, var(--color-gold) 30%, transparent);
        animation: rise 0.35s ease;
      }
      .go {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        min-width: 0;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        text-align: start;
        cursor: pointer;
      }
      .icon {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        flex: 0 0 auto;
        border-radius: 10px;
        color: var(--color-gold);
        background: color-mix(in srgb, var(--color-gold) 14%, transparent);
      }
      .txt {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
        min-width: 0;
      }
      .txt strong {
        font-size: 0.8rem;
      }
      .txt small {
        font-size: 0.68rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .icon-btn {
        width: 30px;
        height: 30px;
        flex: 0 0 auto;
      }
      @keyframes rise {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @media (min-width: 900px) {
        .banner {
          bottom: 1.2rem;
          inset-inline-end: 1rem;
          max-width: 300px;
        }
      }
    `
  ]
})
export class InstallBannerComponent {
  readonly install = inject(InstallService);

  async installNow(): Promise<void> {
    await this.install.install();
  }
}
