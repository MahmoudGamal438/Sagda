import { Injectable, inject, signal } from '@angular/core';
import {
  ActivityEntry,
  Reminder,
  TasbeehSession
} from '../models/settings.model';
import {
  Bookmark,
  Collection,
  KhatmaPlan,
  ReadingProgress,
  VerseNote
} from '../models/quran.model';
import { DhikrProgress } from '../models/adhkar.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private storage = inject(StorageService);
  readonly progress = signal<ReadingProgress | null>(this.storage.get('reading', null));
  readonly bookmarks = signal<Bookmark[]>(this.storage.get('bookmarks', []));
  readonly notes = signal<VerseNote[]>(this.storage.get('notes', []));
  readonly favorites = signal<Array<{ surah: number; ayah: number }>>(
    this.storage.get('favorites', [])
  );
  readonly collections = signal<Collection[]>(this.storage.get('collections', []));
  readonly khatma = signal<KhatmaPlan | null>(this.storage.get('khatma', null));
  readonly dhikrProgress = signal<Record<string, DhikrProgress>>(
    this.storage.get('dhikr-progress', {})
  );
  readonly reminders = signal<Reminder[]>(this.storage.get('reminders', this.defaultReminders()));
  readonly tasbeehSessions = signal<TasbeehSession[]>(this.storage.get('tasbeeh-sessions', []));
  readonly activity = signal<ActivityEntry[]>(this.storage.get('activity', []));
  readonly online = signal(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.online.set(true));
    window.addEventListener('offline', () => this.online.set(false));
  }

  saveReading(surah: number, ayah: number): void {
    const next = { surah, ayah, updatedAt: Date.now() };
    this.progress.set(next);
    this.storage.set('reading', next);
    this.log('quran', `سورة ${surah} آية ${ayah}`);
  }

  toggleFavorite(surah: number, ayah: number): void {
    this.favorites.update((list) => {
      const exists = list.some((i) => i.surah === surah && i.ayah === ayah);
      const next = exists
        ? list.filter((i) => !(i.surah === surah && i.ayah === ayah))
        : [...list, { surah, ayah }];
      this.storage.set('favorites', next);
      return next;
    });
  }

  isFavorite(surah: number, ayah: number): boolean {
    return this.favorites().some((i) => i.surah === surah && i.ayah === ayah);
  }

  addBookmark(surah: number, ayah: number, label: string): void {
    const next = [...this.bookmarks(), { surah, ayah, label, createdAt: Date.now() }];
    this.bookmarks.set(next);
    this.storage.set('bookmarks', next);
  }

  removeBookmark(createdAt: number): void {
    const next = this.bookmarks().filter((b) => b.createdAt !== createdAt);
    this.bookmarks.set(next);
    this.storage.set('bookmarks', next);
  }

  saveNote(surah: number, ayah: number, text: string): void {
    const id = `${surah}:${ayah}`;
    const rest = this.notes().filter((n) => n.id !== id);
    const next = [...rest, { id, surah, ayah, text, updatedAt: Date.now() }];
    this.notes.set(next);
    this.storage.set('notes', next);
  }

  addCollection(name: string): void {
    const next = [...this.collections(), { id: crypto.randomUUID(), name, items: [] }];
    this.collections.set(next);
    this.storage.set('collections', next);
  }

  addToCollection(id: string, surah: number, ayah: number): void {
    const next = this.collections().map((c) =>
      c.id === id ? { ...c, items: [...c.items, { surah, ayah }] } : c
    );
    this.collections.set(next);
    this.storage.set('collections', next);
  }

  setKhatma(days: number): void {
    const dailyAyahs = Math.ceil(6236 / days);
    const plan: KhatmaPlan = {
      days,
      startDate: new Date().toISOString().slice(0, 10),
      dailyAyahs,
      completedAyahs: 0,
      lastCompletedDate: ''
    };
    this.khatma.set(plan);
    this.storage.set('khatma', plan);
  }

  addKhatmaProgress(ayahs: number): void {
    const plan = this.khatma();
    if (!plan) {
      return;
    }
    const next = {
      ...plan,
      completedAyahs: Math.min(6236, plan.completedAyahs + ayahs),
      lastCompletedDate: new Date().toISOString().slice(0, 10)
    };
    this.khatma.set(next);
    this.storage.set('khatma', next);
  }

  saveDhikrProgress(progress: DhikrProgress): void {
    const all = { ...this.dhikrProgress(), [progress.categoryId]: progress };
    this.dhikrProgress.set(all);
    this.storage.set('dhikr-progress', all);
    this.log('adhkar', progress.categoryId);
  }

  saveReminders(list: Reminder[]): void {
    this.reminders.set(list);
    this.storage.set('reminders', list);
  }

  addTasbeehSession(session: TasbeehSession): void {
    const next = [session, ...this.tasbeehSessions()].slice(0, 50);
    this.tasbeehSessions.set(next);
    this.storage.set('tasbeeh-sessions', next);
    this.log('tasbeeh', `${session.phrase} × ${session.count}`);
  }

  log(type: ActivityEntry['type'], title: string): void {
    const next = [
      { id: crypto.randomUUID(), type, title, at: Date.now() },
      ...this.activity()
    ].slice(0, 40);
    this.activity.set(next);
    this.storage.set('activity', next);
  }

  todayTasbeehCount(): number {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return this.tasbeehSessions()
      .filter((s) => s.endedAt >= start.getTime())
      .reduce((sum, s) => sum + s.count, 0);
  }

  private defaultReminders(): Reminder[] {
    return [
      {
        id: 'morning',
        title: 'أذكار الصباح',
        message: 'وقت أذكار الصباح',
        hour: 6,
        minute: 30,
        days: [0, 1, 2, 3, 4, 5, 6],
        enabled: true,
        sound: true
      },
      {
        id: 'evening',
        title: 'أذكار المساء',
        message: 'وقت أذكار المساء',
        hour: 17,
        minute: 0,
        days: [0, 1, 2, 3, 4, 5, 6],
        enabled: true,
        sound: true
      },
      {
        id: 'sleep',
        title: 'أذكار النوم',
        message: 'لا تنسَ أذكار النوم',
        hour: 22,
        minute: 0,
        days: [0, 1, 2, 3, 4, 5, 6],
        enabled: false,
        sound: false
      },
      {
        id: 'wird',
        title: 'الورد القرآني',
        message: 'حان وقت وردك اليومي',
        hour: 20,
        minute: 0,
        days: [0, 1, 2, 3, 4, 5, 6],
        enabled: true,
        sound: false
      }
    ];
  }
}
