import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdhkarService } from '../../core/services/adhkar.service';
import { PrayerService } from '../../core/services/prayer.service';
import { UserDataService } from '../../core/services/user-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { QuranService } from '../../core/services/quran.service';
import { DAILY_REMINDERS } from '../../core/data/calendar.data';
import { PrayerKey } from '../../core/models/prayer.model';
import { remainingLabel } from '../../core/utils/prayer.util';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly prayer = inject(PrayerService);
  readonly user = inject(UserDataService);
  readonly notify = inject(NotificationService);
  readonly adhkar = inject(AdhkarService);
  readonly quran = inject(QuranService);
  readonly now = signal(new Date());
  readonly remaining = signal('--');

  readonly greeting = computed(() => {
    const h = this.now().getHours();
    if (h < 12) {
      return 'صباح الخير';
    }
    if (h < 17) {
      return 'طاب يومك';
    }
    return 'مساء الخير';
  });

  readonly todayDhikr = computed(() => this.adhkar.morningEvening(this.now()));
  readonly benefit = DAILY_REMINDERS[new Date().getDate() % DAILY_REMINDERS.length];
  readonly prayerKeys: PrayerKey[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  ngOnInit(): void {
    void this.prayer.loadToday();
    window.setInterval(() => {
      this.now.set(new Date());
      const next = this.prayer.nextPrayer();
      this.remaining.set(next ? remainingLabel(next.at) : '--');
    }, 30000);
    const next = this.prayer.nextPrayer();
    this.remaining.set(next ? remainingLabel(next.at) : '--');
  }

  toggleAlerts(): void {
    this.notify.setPrayerAlerts(!this.notify.prayerAlertsEnabled());
  }

  lastSurahName(): string {
    const p = this.user.progress();
    if (!p) {
      return 'ابدأ من الفاتحة';
    }
    const s = this.quran.surahs().find((x) => x.number === p.surah);
    return s ? `${s.name} · آية ${p.ayah}` : `سورة ${p.surah}`;
  }
}
