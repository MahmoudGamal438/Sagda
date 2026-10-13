import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from '../shared/icon.component';
import { InstallBannerComponent } from './install-banner.component';
import { WelcomeModalComponent } from './welcome-modal.component';
import { NotificationService } from '../core/services/notification.service';
import { UserDataService } from '../core/services/user-data.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IconComponent,
    InstallBannerComponent,
    WelcomeModalComponent
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private router = inject(Router);
  readonly notify = inject(NotificationService);
  readonly user = inject(UserDataService);
  compact = false;

  readonly nav = [
    { path: '/', icon: 'home' as const, label: 'الرئيسية' },
    { path: '/quran', icon: 'quran' as const, label: 'القرآن' },
    { path: '/adhkar', icon: 'adhkar' as const, label: 'الأذكار' },
    { path: '/tasbeeh', icon: 'tasbeeh' as const, label: 'المسبحة' },
    { path: '/prayer', icon: 'prayer' as const, label: 'الصلاة' }
  ];

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.compact = this.router.url.startsWith('/quran/read') || this.router.url.startsWith('/adhkar/read');
    });
  }

  dismissAlert(): void {
    this.notify.inAppAlert.set(null);
  }
}
