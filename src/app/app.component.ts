import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrayerService } from './core/services/prayer.service';
import { QuranService } from './core/services/quran.service';
import { NotificationService } from './core/services/notification.service';
import { SettingsService } from './core/services/settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: [':host { display: block; min-height: 100vh; }']
})
export class AppComponent implements OnInit {
  private prayer = inject(PrayerService);
  private quran = inject(QuranService);
  private notify = inject(NotificationService);
  private settings = inject(SettingsService);

  ngOnInit(): void {
    void this.settings;
    void this.quran.loadSurahList().catch(() => undefined);
    void this.prayer.loadToday().catch(() => undefined);
    this.notify.startWatch();
  }
}
