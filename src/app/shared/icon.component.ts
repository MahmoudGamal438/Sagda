import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg [attr.viewBox]="viewBox" aria-hidden="true" focusable="false">
      <path [attr.d]="path" fill="currentColor" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        width: 1.25rem;
        height: 1.25rem;
      }
      svg {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class IconComponent {
  @Input() name: keyof typeof PATHS = 'home';
  readonly viewBox = '0 0 24 24';

  get path(): string {
    return PATHS[this.name] ?? PATHS['home'];
  }
}

const PATHS: Record<string, string> = {
  home: 'M12 3 3 10h2v10h6V14h2v6h6V10h2z',
  quran: 'M6 4h9a3 3 0 0 1 3 3v13H8a2 2 0 0 0-2 2V4zm3 4v2h7V8H9zm0 4v2h7v-2H9z',
  adhkar: 'M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3zm1 4v5l4 2-.7 1.5L11 13V7h2z',
  tasbeeh: 'M12 2a6 6 0 0 1 2 11.7V16h3v2h-3v4h-2v-4H9v-2h3v-2.3A6 6 0 0 1 12 2z',
  prayer: 'M12 2 8 8h8L12 2zm-7 8h14v2H5v-2zm2 4h10v8H7v-8z',
  more: 'M5 11h4v4H5v-4zm5 0h4v4h-4v-4zm5 0h4v4h-4v-4z',
  settings: 'M19.4 13a7.8 7.8 0 0 0 0-2l2-1.5-2-3.5-2.4 1A7.6 7.6 0 0 0 14 5.1V2.5H10V5a7.6 7.6 0 0 0-3 .9L4.6 5 2.6 8.5 4.6 10a7.8 7.8 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 0 0 3 1V21.5h4V19a7.6 7.6 0 0 0 3-.9l2.4 1 2-3.5zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z',
  search: 'M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm8.3 12.9-3.1-3.1A8 8 0 1 0 10 18a8 8 0 0 0 5.8-2.2l3.1 3.1z',
  play: 'M8 5v14l11-7z',
  pause: 'M7 5h4v14H7zm6 0h4v14h-4z',
  heart: 'M12 21s-7-4.4-9.5-8.2C.4 9.6 1.7 5.5 5.4 4.4 7.6 3.7 10 4.8 12 7c2-2.2 4.4-3.3 6.6-2.6 3.7 1.1 5 5.2 2.9 8.4C19 16.6 12 21 12 21z',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5 9.5 17 19 7.5',
  qibla: 'M12 2 8 10h8L12 2zm0 8a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 2.5 1.5 4.5H10.5z',
  calendar: 'M7 3h2v2h6V3h2v2h3v16H4V5h3V3zm13 8H4v8h16v-8z',
  star: 'M12 3 9.5 9H3l5.2 3.8L6.2 19 12 15.2 17.8 19l-2-6.2L21 9h-6.5z',
  copy: 'M8 7h10v12H8V7zm-3 3h2v10h8v2H5V10z',
  share: 'M14 4h6v6h-2V7.4l-7 7-1.4-1.4 7-7H14V4zM5 7h7v2H7v10h10v-5h2v7H5V7z'
};
