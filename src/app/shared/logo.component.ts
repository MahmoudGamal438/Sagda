import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <span class="logo" [class.with-text]="withText">
      <span class="badge" [style.width.px]="size" [style.height.px]="size">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id="sujdaGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#f8ecc7" />
              <stop offset="0.55" stop-color="#e8c875" />
              <stop offset="1" stop-color="#c9a44e" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="60" height="60" rx="17" class="bg" />
          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="17"
            fill="none"
            stroke="url(#sujdaGold)"
            stroke-opacity="0.55"
            stroke-width="1.4"
          />
          <path
            d="M20 50V31a12 12 0 0 1 24 0v19"
            fill="none"
            stroke="url(#sujdaGold)"
            stroke-width="4"
            stroke-linecap="round"
          />
          <path
            d="M15.5 50.5h33"
            stroke="url(#sujdaGold)"
            stroke-width="4"
            stroke-linecap="round"
          />
          <path
            d="M35.4 23.2a8.6 8.6 0 1 0 0 17.2 6.7 6.7 0 1 1 0-17.2Z"
            fill="url(#sujdaGold)"
          />
          <path
            d="M32 3.4l1.5 3.7 3.7 1.5-3.7 1.5L32 13.8l-1.5-3.7L26.8 8.6l3.7-1.5Z"
            fill="url(#sujdaGold)"
          />
        </svg>
      </span>
      @if (withText) {
        <span class="wordmark">
          <strong>سجدة <em>| SAJDA</em></strong>
          @if (tagline) {
            <small>{{ tagline }}</small>
          }
        </span>
      }
    </span>
  `,
  styles: [
    `
      .logo {
        display: inline-flex;
        align-items: center;
        gap: 0.7rem;
      }
      .badge {
        display: inline-grid;
        place-items: center;
        flex: 0 0 auto;
        filter: drop-shadow(0 8px 18px rgba(11, 20, 40, 0.25));
      }
      svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      .bg {
        fill: #0b1428;
      }
      html[data-theme="light"] .bg {
        fill: #0b1428;
      }
      .wordmark {
        display: flex;
        flex-direction: column;
        line-height: 1.15;
      }
      .wordmark strong {
        font-size: 1.2rem;
        font-weight: 800;
        letter-spacing: 0.01em;
      }
      .wordmark strong em {
        font-style: normal;
        font-size: 0.72rem;
        letter-spacing: 0.14em;
        color: var(--color-gold);
        font-weight: 700;
        opacity: 0.9;
      }
      .wordmark small {
        color: var(--color-muted);
        font-size: 0.72rem;
      }
    `
  ]
})
export class LogoComponent {
  @Input() size = 44;
  @Input() withText = true;
  @Input() tagline = 'قرآن · أذكار · صلاة';
}
