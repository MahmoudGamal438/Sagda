import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Ayah,
  Reciter,
  SurahDetail,
  SurahMeta
} from '../models/quran.model';
import { StorageService } from './storage.service';

interface ApiEnvelope<T> {
  code: number;
  status: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class QuranService {
  readonly reciters: Reciter[] = [
    { id: 'ar.alafasy', name: 'مشاري راشد العفاسي', style: 'مرتل' },
    { id: 'ar.husary', name: 'محمود خليل الحصري', style: 'مرتل' },
    { id: 'ar.minshawi', name: 'محمد صديق المنشاوي', style: 'مرتل' },
    { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد', style: 'مرتل' },
    { id: 'ar.sudais', name: 'عبد الرحمن السديس', style: 'مرتل' },
    { id: 'ar.shaatree', name: 'أبو بكر الشاطري', style: 'مرتل' },
    { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي', style: 'مرتل' }
  ];

  readonly surahs = signal<SurahMeta[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private surahCache = new Map<string, SurahDetail>();

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  async loadSurahList(): Promise<SurahMeta[]> {
    const cached = this.storage.get<SurahMeta[] | null>('surahs', null);
    if (cached?.length === 114) {
      this.surahs.set(cached);
      return cached;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await firstValueFrom(
        this.http.get<ApiEnvelope<SurahMeta[]>>(`${environment.quranApi}/surah`)
      );
      this.surahs.set(res.data);
      this.storage.set('surahs', res.data);
      return res.data;
    } catch {
      this.error.set('تعذر تحميل قائمة السور. تحقق من الاتصال ثم أعد المحاولة.');
      throw new Error('surah-list');
    } finally {
      this.loading.set(false);
    }
  }

  async getSurah(number: number, edition = 'quran-uthmani'): Promise<SurahDetail> {
    const key = `${number}:${edition}`;
    const memory = this.surahCache.get(key);
    if (memory) {
      return memory;
    }
    const stored = this.storage.get<SurahDetail | null>(`surah:${key}`, null);
    if (stored?.ayahs?.length) {
      this.surahCache.set(key, stored);
      return stored;
    }
    const res = await firstValueFrom(
      this.http.get<ApiEnvelope<SurahDetail>>(`${environment.quranApi}/surah/${number}/${edition}`)
    );
    this.surahCache.set(key, res.data);
    this.storage.set(`surah:${key}`, res.data);
    return res.data;
  }

  async search(query: string): Promise<Ayah[]> {
    const q = query.trim();
    if (!q) {
      return [];
    }
    const res = await firstValueFrom(
      this.http.get<ApiEnvelope<{ count: number; matches: Ayah[] }>>(
        `${environment.quranApi}/search/${encodeURIComponent(q)}/all/quran-uthmani`
      )
    );
    return res.data.matches ?? [];
  }

  ayahAudioUrl(globalAyahNumber: number, reciterId: string): string {
    return `${environment.quranAudioCdn}/${reciterId}/${globalAyahNumber}.mp3`;
  }

  surahAudioUrl(surahNumber: number, reciterId: string): string {
    return `${environment.quranAudioSurahCdn}/${reciterId}/${surahNumber}.mp3`;
  }

  revelationLabel(type: string): string {
    return type === 'Meccan' ? 'مكية' : type === 'Medinan' ? 'مدنية' : type;
  }
}
