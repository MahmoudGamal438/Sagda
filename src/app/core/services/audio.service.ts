import { Injectable, signal } from '@angular/core';
import { SettingsService } from './settings.service';
import { QuranService } from './quran.service';

@Injectable({ providedIn: 'root' })
export class AudioService {
  readonly playing = signal(false);
  readonly currentAyah = signal<number | null>(null);
  readonly currentSurah = signal<number | null>(null);
  readonly progress = signal(0);
  readonly duration = signal(0);
  readonly error = signal<string | null>(null);
  readonly repeatCount = signal(1);
  readonly range = signal<{ from: number; to: number } | null>(null);

  private audio = new Audio();
  private queue: number[] = [];
  private repeatsLeft = 1;

  constructor(
    private quran: QuranService,
    private settings: SettingsService
  ) {
    this.audio.preload = 'auto';
    this.audio.addEventListener('timeupdate', () => {
      this.progress.set(this.audio.currentTime);
      this.duration.set(this.audio.duration || 0);
    });
    this.audio.addEventListener('ended', () => this.onEnded());
    this.audio.addEventListener('error', () => {
      this.error.set('تعذر تشغيل التلاوة. تحقق من الاتصال.');
      this.playing.set(false);
    });
  }

  playAyah(globalNumber: number, surah: number): void {
    this.queue = [globalNumber];
    this.range.set(null);
    this.repeatsLeft = this.repeatCount();
    this.currentSurah.set(surah);
    this.load(globalNumber);
  }

  playRange(ayahNumbers: number[], surah: number): void {
    this.queue = [...ayahNumbers];
    this.range.set({ from: ayahNumbers[0], to: ayahNumbers[ayahNumbers.length - 1] });
    this.repeatsLeft = this.repeatCount();
    this.currentSurah.set(surah);
    this.load(this.queue[0]);
  }

  playSurah(surah: number, firstAyahGlobal: number, lastAyahGlobal: number): void {
    const list: number[] = [];
    for (let n = firstAyahGlobal; n <= lastAyahGlobal; n++) {
      list.push(n);
    }
    this.playRange(list, surah);
  }

  pause(): void {
    this.audio.pause();
    this.playing.set(false);
  }

  resume(): void {
    void this.audio.play().then(() => this.playing.set(true));
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.playing.set(false);
    this.currentAyah.set(null);
  }

  seek(value: number): void {
    this.audio.currentTime = value;
  }

  setVolume(value: number): void {
    this.audio.volume = Math.min(1, Math.max(0, value));
  }

  setRate(value: number): void {
    this.audio.playbackRate = value;
    this.settings.patch({ playbackRate: value });
  }

  next(): void {
    const i = this.queue.indexOf(this.currentAyah() ?? -1);
    if (i >= 0 && i < this.queue.length - 1) {
      this.load(this.queue[i + 1]);
    }
  }

  prev(): void {
    const i = this.queue.indexOf(this.currentAyah() ?? -1);
    if (i > 0) {
      this.load(this.queue[i - 1]);
    }
  }

  private load(ayah: number): void {
    const reciter = this.settings.settings().reciterId;
    this.audio.src = this.quran.ayahAudioUrl(ayah, reciter);
    this.audio.playbackRate = this.settings.settings().playbackRate;
    this.currentAyah.set(ayah);
    this.error.set(null);
    void this.audio.play()
      .then(() => this.playing.set(true))
      .catch(() => {
        this.error.set('منع المتصفح التشغيل التلقائي. اضغط تشغيل.');
        this.playing.set(false);
      });
  }

  private onEnded(): void {
    const current = this.currentAyah();
    const i = this.queue.indexOf(current ?? -1);
    if (i >= 0 && i < this.queue.length - 1) {
      this.load(this.queue[i + 1]);
      return;
    }
    this.repeatsLeft -= 1;
    if (this.repeatsLeft > 0 && this.queue.length) {
      this.load(this.queue[0]);
      return;
    }
    this.playing.set(false);
  }
}
