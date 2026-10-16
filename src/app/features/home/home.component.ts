import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdhkarService } from '../../core/services/adhkar.service';
import { PrayerService } from '../../core/services/prayer.service';
import { UserDataService } from '../../core/services/user-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { QuranService } from '../../core/services/quran.service';
import { SettingsService } from '../../core/services/settings.service';
import { DAILY_REMINDERS } from '../../core/data/calendar.data';
import { IconComponent } from '../../shared/icon.component';
import { PrayerKey } from '../../core/models/prayer.model';
import { countdown, findNextPrayer, prayerPhases, PrayerPhase } from '../../core/utils/prayer.util';

interface QuickLink {
  path: string;
  icon: string;
  label: string;
  hint: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe, IconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly prayer = inject(PrayerService);
  readonly user = inject(UserDataService);
  readonly notify = inject(NotificationService);
  readonly adhkar = inject(AdhkarService);
  readonly quran = inject(QuranService);
  readonly settings = inject(SettingsService);

  readonly now = signal(new Date());

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
  readonly obligatory: Exclude<PrayerKey, 'Sunrise'>[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  readonly countdown = computed(() => {
    const day = this.prayer.today();
    if (!day) {
      return null;
    }
    const next = findNextPrayer(day.timings, this.now());
    return { next, parts: countdown(next.at, this.now()) };
  });

  readonly phases = computed<Record<PrayerKey, PrayerPhase>>(() => {
    const day = this.prayer.today();
    if (!day) {
      return {} as Record<PrayerKey, PrayerPhase>;
    }
    return prayerPhases(day.timings, this.now());
  });

  readonly quickLinks: QuickLink[] = [
    { path: '/quran', icon: 'quran', label: 'المصحف الشريف', hint: '114 سورة' },
    { path: '/quran/listen', icon: 'headset', label: 'القرآن صوتيًا', hint: 'تلاوات مختارة' },
    { path: '/adhkar', icon: 'adhkar', label: 'الأذكار والأدعية', hint: 'صباح ومساء' },
    { path: '/prayer', icon: 'prayer', label: 'المواقيت والأذان', hint: 'تنبيهات ذكية' },
    { path: '/qibla', icon: 'qibla', label: 'اتجاه القبلة', hint: 'بوصلة وحساب' },
    { path: '/quran/tafsir', icon: 'book', label: 'التفسير', hint: 'ميسّر وجلالين' },
    { path: '/hadith', icon: 'book', label: 'الأحاديث النبوية', hint: 'موثقة المصدر' },
    { path: '/stories', icon: 'scroll', label: 'قصص الأنبياء', hint: 'من القرآن' },
    { path: '/ruqyah', icon: 'shield', label: 'الرقية الشرعية', hint: 'آيات وأدعية' },
    { path: '/quiz', icon: 'help', label: 'الاختبارات', hint: 'سؤال وجواب' },
    { path: '/radio', icon: 'radio', label: 'الراديو الإسلامي', hint: 'بث مباشر' },
    { path: '/tasbeeh', icon: 'tasbeeh', label: 'المسبحة', hint: 'عدّاد وتسبيح' }
  ];

  ngOnInit(): void {
    void this.prayer.loadToday();
    window.setInterval(() => this.now.set(new Date()), 1000);
  }

  toggleAlerts(): void {
    this.notify.setPrayerAlerts(!this.notify.prayerAlertsEnabled());
  }

  iconFor(key: PrayerKey): string {
    const map: Record<PrayerKey, string> = {
      Fajr: 'sunrise',
      Sunrise: 'sunrise',
      Dhuhr: 'sun',
      Asr: 'sun',
      Maghrib: 'sunset',
      Isha: 'moon'
    };
    return map[key];
  }

  phaseLabel(phase: PrayerPhase | undefined): string {
    switch (phase) {
      case 'current':
        return 'وقتها الآن';
      case 'past':
        return 'انتهى وقتها';
      default:
        return 'قادمة';
    }
  }

  isNext(key: PrayerKey): boolean {
    return this.phases()[key] === 'current' || (key === 'Fajr' && this.phases()['Isha'] === 'current');
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
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
