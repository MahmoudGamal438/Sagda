import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent)
      },
      {
        path: 'quran',
        loadComponent: () =>
          import('./features/quran/quran-list.component').then((m) => m.QuranListComponent)
      },
      {
        path: 'quran/read/:id',
        loadComponent: () =>
          import('./features/quran/quran-reader.component').then((m) => m.QuranReaderComponent)
      },
      {
        path: 'quran/listen',
        loadComponent: () =>
          import('./features/quran/quran-listen.component').then((m) => m.QuranListenComponent)
      },
      {
        path: 'quran/tafsir',
        loadComponent: () =>
          import('./features/quran/quran-tafsir.component').then((m) => m.QuranTafsirComponent)
      },
      {
        path: 'quran/khatma',
        loadComponent: () =>
          import('./features/quran/khatma.component').then((m) => m.KhatmaComponent)
      },
      {
        path: 'adhkar',
        loadComponent: () =>
          import('./features/adhkar/adhkar-library.component').then((m) => m.AdhkarLibraryComponent)
      },
      {
        path: 'adhkar/read/:id',
        loadComponent: () =>
          import('./features/adhkar/adhkar-reader.component').then((m) => m.AdhkarReaderComponent)
      },
      {
        path: 'tasbeeh',
        loadComponent: () =>
          import('./features/tasbeeh/tasbeeh.component').then((m) => m.TasbeehComponent)
      },
      {
        path: 'prayer',
        loadComponent: () =>
          import('./features/prayer-times/prayer-times.component').then((m) => m.PrayerTimesComponent)
      },
      {
        path: 'reminders',
        loadComponent: () =>
          import('./features/reminders/reminders.component').then((m) => m.RemindersComponent)
      },
      {
        path: 'qibla',
        loadComponent: () =>
          import('./features/qibla/qibla.component').then((m) => m.QiblaComponent)
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/islamic-calendar/calendar.component').then((m) => m.CalendarComponent)
      },
      {
        path: 'asma',
        loadComponent: () =>
          import('./features/asma/asma.component').then((m) => m.AsmaComponent)
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/favorites/favorites.component').then((m) => m.FavoritesComponent)
      },
      {
        path: 'stats',
        loadComponent: () =>
          import('./features/stats/stats.component').then((m) => m.StatsComponent)
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/search/search.component').then((m) => m.SearchComponent)
      },
      {
        path: 'zakat',
        loadComponent: () =>
          import('./features/zakat/zakat.component').then((m) => m.ZakatComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent)
      },
      {
        path: 'more',
        loadComponent: () =>
          import('./features/more/more.component').then((m) => m.MoreComponent)
      },
      {
        path: 'offline',
        loadComponent: () =>
          import('./features/offline/offline.component').then((m) => m.OfflineComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
