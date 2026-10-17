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
    { id: 'ar.husary', name: 'محمود خليل الحصري', style: 'مرتل', country: 'مصر', bitrate: 128 },
    {
      id: 'ar.husarymujawwad',
      name: 'محمود خليل الحصري',
      style: 'مجوّد',
      country: 'مصر',
      bitrate: 128
    },
    { id: 'ar.minshawi', name: 'محمد صديق المنشاوي', style: 'مرتل', country: 'مصر', bitrate: 128 },
    {
      id: 'ar.minshawimujawwad',
      name: 'محمد صديق المنشاوي',
      style: 'مجوّد',
      country: 'مصر',
      bitrate: 64
    },
    {
      id: 'ar.abdulbasitmurattal',
      name: 'عبد الباسط عبد الصمد',
      style: 'مرتل',
      country: 'مصر',
      bitrate: 64
    },
    {
      id: 'ar.muhammadjibreel',
      name: 'محمد جبريل',
      style: 'مرتل',
      country: 'مصر',
      bitrate: 128
    },
    { id: 'ar.alafasy', name: 'مشاري راشد العفاسي', style: 'مرتل', bitrate: 128 },
    { id: 'ar.abdurrahmaansudais', name: 'عبد الرحمن السديس', style: 'مرتل', bitrate: 64 },
    { id: 'ar.shaatree', name: 'أبو بكر الشاطري', style: 'مرتل', bitrate: 128 },
    { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي', style: 'مرتل', bitrate: 128 },
    { id: 'ar.hudhaify', name: 'علي الحذيفي', style: 'مرتل', bitrate: 128 },
    { id: 'ar.muhammadayyoub', name: 'محمد أيوب', style: 'مرتل', bitrate: 128 }
  ];

  /** القُرّاء المصريون أولًا لعرضهم في صدارة الواجهة */
  readonly egyptianReciters: Reciter[] = this.reciters.filter((r) => r.country === 'مصر');


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
    const reciter = this.reciters.find((r) => r.id === reciterId);
    const bitrate = reciter?.bitrate ?? 128;
    if (reciter?.surahOnly) {
      return this.surahAudioUrl(Math.max(1, globalAyahNumber), reciterId);
    }
    return `${environment.quranAudioCdn.replace(/\/\d+$/, '')}/${bitrate}/${reciterId}/${globalAyahNumber}.mp3`;
  }

  surahAudioUrl(surahNumber: number, reciterId: string): string {
    return `${environment.quranAudioSurahCdn}/${reciterId}/${surahNumber}.mp3`;
  }

  reciterName(id: string): string {
    return this.reciters.find((r) => r.id === id)?.name ?? id;
  }

  revelationLabel(type: string): string {
    return type === 'Meccan' ? 'مكية' : type === 'Medinan' ? 'مدنية' : type;
  }
}
