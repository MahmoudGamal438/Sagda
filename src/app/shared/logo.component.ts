import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <span class="logo" [class.with-text]="withText">
      <span class="badge" [style.width.px]="size" [style.height.px]="size">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id="sujdaGold" x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0" stop-color="#fdf3d4" />
              <stop offset="0.45" stop-color="#eccd80" />
              <stop offset="1" stop-color="#c39a45" />
            </linearGradient>
            <linearGradient id="sujdaBg" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0" stop-color="#0a1226" />
              <stop offset="0.55" stop-color="#12264a" />
              <stop offset="1" stop-color="#1c3a6e" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="62" height="62" rx="15" fill="url(#sujdaBg)" />
          <rect
            x="1"
            y="1"
            width="62"
            height="62"
            rx="15"
            fill="none"
            stroke="url(#sujdaGold)"
            stroke-opacity="0.5"
            stroke-width="1.2"
          />
          <g transform="scale(0.125)">
            <g transform="translate(256 274)" stroke="url(#sujdaGold)" stroke-opacity="0.2" fill="none" stroke-width="6" stroke-linejoin="round">
              <rect x="-108" y="-108" width="216" height="216" rx="14" />
              <rect x="-108" y="-108" width="216" height="216" rx="14" transform="rotate(45)" />
            </g>
            <g fill="url(#sujdaGold)">
              <path d="M156 236a12 12 0 0 1 24 0Z" />
              <rect x="164.5" y="236" width="7" height="16" rx="3" />
              <rect x="157" y="250" width="22" height="144" rx="8" />
              <path d="M332 236a12 12 0 0 1 24 0Z" />
              <rect x="340.5" y="236" width="7" height="16" rx="3" />
              <rect x="333" y="250" width="22" height="144" rx="8" />
            </g>
            <path d="M256 214a17 17 0 1 0 0 34 13 13 0 1 1 0-34Z" fill="url(#sujdaGold)" />
            <rect x="253" y="244" width="6" height="16" rx="3" fill="url(#sujdaGold)" />
            <path d="M210 394V310a46 46 0 0 1 92 0v84Z" fill="url(#sujdaGold)" />
            <path d="M234 394v-32a22 22 0 0 1 44 0v32Z" fill="#0a1226" opacity="0.62" />
            <rect x="120" y="392" width="272" height="12" rx="6" fill="url(#sujdaGold)" />
          </g>
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
