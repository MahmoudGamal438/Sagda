import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AppSettings } from '../models/settings.model';
import { StorageService } from './storage.service';
import { DEFAULT_ADHAN_VOICE } from '../data/adhan-voices.data';

export const DEFAULT_DUA =
  'اللهم أصلح شأن عبدك محمود كله ولا تكله إلى نفسه طرفة عين، اللهم محمود وما بقلبه';

const DEFAULTS: AppSettings = {
  theme: 'dark',
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
  alertVolume: 0.7,
  adhanVoice: DEFAULT_ADHAN_VOICE,
  installPromptDismissedAt: null
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private storage = inject(StorageService);
  readonly settings = signal<AppSettings>(this.load());
  readonly theme = computed(() => this.settings().theme);
  readonly isDark = signal(false);

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

  toggleTheme(): void {
    this.patch({ theme: this.resolveDark() ? 'light' : 'dark' });
  }

  private resolveDark(): boolean {
    const theme = this.settings().theme;
    return (
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }

  private applyTheme(theme: AppSettings['theme']): void {
    const dark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.isDark.set(dark);
    document.documentElement.dataset['theme'] = dark ? 'dark' : 'light';
  }
}
