import { DatePipe } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from '../shared/icon.component';
import { LogoComponent } from '../shared/logo.component';
import { InstallBannerComponent } from './install-banner.component';
import { WelcomeModalComponent } from './welcome-modal.component';
import { AudioPlayerComponent } from './audio-player.component';
import { NotificationService } from '../core/services/notification.service';
import { UserDataService } from '../core/services/user-data.service';
import { PrayerService } from '../core/services/prayer.service';
import { SettingsService } from '../core/services/settings.service';
import { BOTTOM_NAV, NAV_GROUPS } from '../core/data/nav.data';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IconComponent,
    LogoComponent,
    InstallBannerComponent,
    WelcomeModalComponent,
    AudioPlayerComponent,
    DatePipe
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private router = inject(Router);
  readonly notify = inject(NotificationService);
  readonly user = inject(UserDataService);
  readonly prayer = inject(PrayerService);
  readonly settings = inject(SettingsService);

  compact = false;
  readonly menuOpen = signal(false);
  readonly locOpen = signal(false);
  readonly showTop = signal(false);
  readonly now = signal(new Date());

  readonly bottomNav = BOTTOM_NAV;
  readonly groups = NAV_GROUPS;

  readonly hijriLabel = computed(() => {
    const day = this.prayer.today();
    if (!day) {
      return '—';
    }
    return `${day.date.hijriWeekday} ${day.date.hijri}`;
  });

  readonly cityName = computed(() => this.prayer.settings().city?.name ?? 'حدّد المدينة');

  constructor() {
    void this.prayer.loadToday();
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.compact =
        this.router.url.startsWith('/quran/read') || this.router.url.startsWith('/adhkar/read');
      this.menuOpen.set(false);
      this.locOpen.set(false);
    });
    window.setInterval(() => this.now.set(new Date()), 30000);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showTop.set(window.scrollY > 480);
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.menuOpen.set(false);
    this.locOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleLoc(): void {
    this.locOpen.update((v) => !v);
  }

  toggleTheme(): void {
    this.settings.toggleTheme();
  }

  pickCity(name: string): void {
    const city = this.prayer.cities.find((c) => c.name === name);
    if (city) {
      this.prayer.patchSettings({ city, useGeolocation: false });
      void this.prayer.loadToday(true);
    }
  }

  async useGps(): Promise<void> {
    this.locOpen.set(false);
    await this.prayer.useGeolocation();
  }

  async refresh(): Promise<void> {
    await this.prayer.loadToday(true);
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  dismissAlert(): void {
    this.notify.inAppAlert.set(null);
  }
}
