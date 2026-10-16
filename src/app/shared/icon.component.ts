import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const ICONS: Record<string, string> = {
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.8V20h13V9.8"/><path d="M9.8 20v-5.2h4.4V20"/>',
  quran:
    '<path d="M4 5.2c2.4-.6 5-.4 7.2.9 2.2-1.3 4.8-1.5 7.2-.9V18c-2.4-.6-5-.4-7.2.9-2.2-1.3-4.8-1.5-7.2-.9Z"/><path d="M11.2 6.1V19"/>',
  adhkar:
    '<path d="M7.4 13V7a1.4 1.4 0 0 1 2.8 0v3.6"/><path d="M10.2 10.6V5.2a1.4 1.4 0 0 1 2.8 0v5.4"/><path d="M13 10.6V5.8a1.4 1.4 0 0 1 2.8 0v4.8"/><path d="M15.8 10.6V8a1.4 1.4 0 0 1 2.8 0v6.2a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-6-6v-1.8a1.4 1.4 0 0 1 2.8 0"/>',
  tasbeeh:
    '<circle cx="12" cy="4.6" r="1.35"/><circle cx="16.4" cy="6.6" r="1.35"/><circle cx="18.4" cy="11" r="1.35"/><circle cx="16.4" cy="15.4" r="1.35"/><circle cx="12" cy="17.4" r="1.35"/><circle cx="7.6" cy="15.4" r="1.35"/><circle cx="5.6" cy="11" r="1.35"/><circle cx="7.6" cy="6.6" r="1.35"/><path d="M12 17.4V20.5"/>',
  prayer:
    '<path d="M12 3c2.4 2.2 4 4 4 6a4 4 0 0 1-8 0c0-2 1.6-3.8 4-6Z"/><path d="M5 21v-6.6c0-1.6 1.3-2.9 3-2.9h8c1.7 0 3 1.3 3 2.9V21"/><path d="M3.5 21h17"/><path d="M4.2 21v-9.4M19.8 21v-9.4"/>',
  more: '<circle cx="5.5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18.5" cy="12" r="1.5"/>',
  settings:
    '<path d="M4 7h9M18 7h2M4 12h3M12 12h8M4 17h11M20 17h0.5"/><circle cx="15.5" cy="7" r="2"/><circle cx="9.5" cy="12" r="2"/><circle cx="17" cy="17" r="2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.6 4.6"/>',
  play: '<path d="M8.5 5.5 18 12l-9.5 6.5Z"/>',
  pause: '<path d="M9.5 5.5v13M14.5 5.5v13"/>',
  heart:
    '<path d="M12 20.5s-6.7-4.1-9-8.3C1.2 8.6 2.8 5 6.3 4.4 8.4 4 10.5 5.1 12 7c1.5-1.9 3.6-3 5.7-2.6 3.5.6 5.1 4.2 3.3 7.8-2.3 4.2-9 8.3-9 8.3Z"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="M5 12.5 9.5 17 19 7.5"/>',
  qibla: '<circle cx="12" cy="12" r="9"/><path d="M15.6 8.4 13.3 13.3 8.4 15.6l2.3-4.9Z"/>',
  calendar:
    '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3.5V6M16 3.5V6"/><path d="M7.5 13h3M13.5 13h3M7.5 16.5h3M13.5 16.5h3"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9Z"/>',
  copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5"/>',
  share:
    '<circle cx="6" cy="12" r="2.4"/><circle cx="17.5" cy="6" r="2.4"/><circle cx="17.5" cy="18" r="2.4"/><path d="M8.2 10.8 15.3 7.2M8.2 13.2l7.1 3.6"/>',
  sunrise:
    '<path d="M12 7V3.6M9.4 5.8 12 3.2l2.6 2.6"/><path d="M4 16h3.2M16.8 16H20M6.8 9.8l2 2M17.2 9.8l-2 2"/><path d="M8.2 16a3.8 3.8 0 0 1 7.6 0"/><path d="M3 19.5h18"/>',
  sunset:
    '<path d="M12 3.6V7M9.4 4.2 12 6.8l2.6-2.6"/><path d="M4 16h3.2M16.8 16H20M6.8 9.8l2 2M17.2 9.8l-2 2"/><path d="M8.2 16a3.8 3.8 0 0 1 7.6 0"/><path d="M3 19.5h18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.6v2.2M12 19.2v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6"/>',
  moon: '<path d="M20 14.6A8 8 0 0 1 9.4 4 8.6 8.6 0 1 0 20 14.6Z"/>',
  pin: '<path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z"/><circle cx="12" cy="10" r="2.4"/>',
  gps: '<circle cx="12" cy="12" r="7.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/><circle cx="12" cy="12" r="2.2"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4.6V10h-5.4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  chevronLeft: '<path d="M14.5 6 8.5 12l6 6"/>',
  chevronRight: '<path d="M9.5 6l6 6-6 6"/>',
  chevronDown: '<path d="M6 9.5l6 6 6-6"/>',
  radio:
    '<rect x="3.5" y="8" width="17" height="11" rx="2.5"/><circle cx="12" cy="13.5" r="3"/><path d="M7.4 8 16.5 4.6M17 8h0.01"/>',
  headset:
    '<path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v3.4a2 2 0 0 0 2 2h1.2V13H4ZM20 13v3.4a2 2 0 0 1-2 2h-1.2V13H20Z"/>',
  sparkles:
    '<path d="M12 3.5l1.6 4.3 4.3 1.6-4.3 1.6L12 15.3l-1.6-4.3L6.1 9.4l4.3-1.6Z"/><path d="M18.2 15l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7Z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.3 1-1.3 2"/><path d="M12 17.2h.01"/>',
  scroll:
    '<path d="M6 4h10.5a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2Z"/><path d="M6 4a2 2 0 0 0-2 2v1h2M9 8.5h6M9 12h6M9 15.5h4"/>',
  shield: '<path d="M12 3l7 2.5V11c0 4.6-3 8.2-7 10-4-1.8-7-5.4-7-10V5.5Z"/><path d="M9.4 12l1.9 1.9 3.5-3.7"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  arrowUp: '<path d="M12 19V6M6.5 11.5 12 6l5.5 5.5"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 4 1.6 5.6 1.6 5.6h-15.2S6 13 6 9Z"/><path d="M10 17.6a2 2 0 0 0 4 0"/>',
  book: '<path d="M4 5.6A2.1 2.1 0 0 1 6.1 3.5H17v15.4H6.1a2.1 2.1 0 0 0-2.1 2.1Z"/><path d="M17 18.9v1H6.1"/>',
  globe:
    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5S14.4 18.7 12 21c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z"/>',
  list: '<path d="M8 6.5h12M8 12h12M8 17.5h12"/><circle cx="4.6" cy="6.5" r="1.15"/><circle cx="4.6" cy="12" r="1.15"/><circle cx="4.6" cy="17.5" r="1.15"/>',
  wifiOff:
    '<path d="M3 4l18 18"/><path d="M5 12.6a11 11 0 0 1 4-2.2"/><path d="M8.6 15.9a6 6 0 0 1 2.4-1.1"/><path d="M2.6 9.1a15 15 0 0 1 4-2.5"/><path d="M12 19h.01"/>'
};

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
      [innerHTML]="markup"
    ></svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        width: 1.3rem;
        height: 1.3rem;
        flex: 0 0 auto;
      }
      svg {
        width: 100%;
        height: 100%;
        display: block;
      }
    `
  ]
})
export class IconComponent {
  @Input() name: keyof typeof ICONS | string = 'home';

  constructor(private sanitizer: DomSanitizer) {}

  get markup(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name] ?? ICONS['home']);
  }
}
