import { Injectable, signal } from '@angular/core';
import { SettingsService } from './settings.service';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Injectable({ providedIn: 'root' })
export class InstallService {
  readonly canPrompt = signal(false);
  readonly installed = signal(false);
  readonly isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  readonly showBanner = signal(false);

  private deferred: BeforeInstallPromptEvent | null = null;

  constructor(private settings: SettingsService) {
    this.installed.set(
      window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferred = e as BeforeInstallPromptEvent;
      this.canPrompt.set(true);
      this.maybeShow();
    });
    window.addEventListener('appinstalled', () => {
      this.installed.set(true);
      this.showBanner.set(false);
      this.canPrompt.set(false);
    });
    this.maybeShow();
  }

  async install(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.deferred) {
      return 'unavailable';
    }
    await this.deferred.prompt();
    const { outcome } = await this.deferred.userChoice;
    if (outcome === 'accepted') {
      this.installed.set(true);
      this.showBanner.set(false);
    }
    this.deferred = null;
    this.canPrompt.set(false);
    return outcome;
  }

  dismiss(): void {
    this.showBanner.set(false);
    this.settings.patch({ installPromptDismissedAt: Date.now() });
  }

  openFromSettings(): void {
    this.showBanner.set(true);
  }

  private maybeShow(): void {
    if (this.installed()) {
      return;
    }
    const dismissed = this.settings.settings().installPromptDismissedAt;
    if (dismissed && Date.now() - dismissed < 7 * 24 * 3600 * 1000) {
      return;
    }
    if (this.canPrompt() || this.isIos) {
      this.showBanner.set(true);
    }
  }
}
