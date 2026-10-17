import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FALLBACK_STATIONS, EGYPT_STATIONS, RadioStation } from '../models/radio.model';
import { StorageService } from './storage.service';

interface RadioEnvelope {
  radios: Array<{ id: number; name: string; url: string }>;
}

@Injectable({ providedIn: 'root' })
export class RadioService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  readonly stations = signal<RadioStation[]>(this.loadInitial());
  readonly current = signal<RadioStation | null>(null);
  readonly playing = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly volume = signal(this.storage.get('radio-volume', 0.8));

  private audio = new Audio();

  private loadInitial(): RadioStation[] {
    const cached = this.storage.get<RadioStation[]>('radio-stations', FALLBACK_STATIONS);
    return this.withEgypt(cached);
  }

  private withEgypt(list: RadioStation[]): RadioStation[] {
    const rest = (list ?? []).filter(
      (s) => !EGYPT_STATIONS.some((e) => e.url === s.url)
    );
    return [...EGYPT_STATIONS, ...rest];
  }

  constructor() {
    this.audio.preload = 'none';
    this.audio.volume = this.volume();
    this.audio.addEventListener('playing', () => {
      this.playing.set(true);
      this.loading.set(false);
      this.error.set(null);
    });
    this.audio.addEventListener('pause', () => this.playing.set(false));
    this.audio.addEventListener('waiting', () => this.loading.set(true));
    this.audio.addEventListener('error', () => {
      this.error.set('تعذر الاتصال بالبث. قد تكون الإذاعة متوقفة مؤقتًا، جرّب محطة أخرى.');
      this.playing.set(false);
      this.loading.set(false);
    });
    this.audio.addEventListener('stalled', () => this.loading.set(true));
  }

  async loadStations(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<RadioEnvelope>(`${environment.radioApi}/radios?language=ar`)
      );
      if (res.radios?.length) {
        const mapped: RadioStation[] = res.radios.map((r) => ({
          id: r.id,
          name: r.name,
          url: r.url,
          category: 'quran'
        }));
        const merged = this.withEgypt(mapped);
        this.stations.set(merged);
        this.storage.set('radio-stations', merged);
      }
    } catch {
      // keep cached / fallback list
    }
  }

  play(station: RadioStation): void {
    this.error.set(null);
    this.loading.set(true);
    this.current.set(station);
    this.audio.src = station.url;
    void this.audio
      .play()
      .then(() => this.playing.set(true))
      .catch(() => {
        this.error.set('منع المتصفح التشغيل التلقائي، أو تعذر الاتصال بالبث.');
        this.loading.set(false);
        this.playing.set(false);
      });
  }

  stop(): void {
    this.audio.pause();
    this.audio.removeAttribute('src');
    this.playing.set(false);
    this.loading.set(false);
  }

  setVolume(value: number): void {
    const v = Math.min(1, Math.max(0, value));
    this.volume.set(v);
    this.audio.volume = v;
    this.storage.set('radio-volume', v);
  }
}
