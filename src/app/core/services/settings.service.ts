import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AppSettings } from '../models/settings.model';
import { StorageService } from './storage.service';

export const DEFAULT_DUA =
  'اللهم أصلح شأن عبدك محمود كله ولا تكله إلى نفسه طرفة عين، اللهم محمود وما بقلبه';

const DEFAULTS: AppSettings = {
  theme: 'system',
  quranFontSize: 28,
  quranLineHeight: 2.2,
  reciterId: 'ar.alafasy',
  playbackRate: 1,
  showTranslation: false,
  translationEdition: 'en.sahih',
  tafsirEdition: 'ar.muyassar',
  personalDua: DEFAULT_DUA,
  autoNextDhikr: true,
  reduceMotion: false,
  tasbeehVibrate: true,
  tasbeehSound: false,
  installPromptDismissedAt: null
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private storage = inject(StorageService);
  readonly settings = signal<AppSettings>(this.load());
  readonly theme = computed(() => this.settings().theme);

  private load(): AppSettings {
    const stored = this.storage.get<Partial<AppSettings>>('settings', {});
    return { ...DEFAULTS, ...stored };
  }

  constructor() {
    effect(() => {
      this.storage.set('settings', this.settings());
      this.applyTheme(this.settings().theme);
    });
    this.applyTheme(this.settings().theme);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.settings().theme === 'system') {
        this.applyTheme('system');
      }
    });
  }

  patch(partial: Partial<AppSettings>): void {
    this.settings.update((current) => ({ ...current, ...partial }));
  }

  resetDua(): void {
    this.patch({ personalDua: DEFAULT_DUA });
  }

  private applyTheme(theme: AppSettings['theme']): void {
    const dark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset['theme'] = dark ? 'dark' : 'light';
  }
}
