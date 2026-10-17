export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan' | string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  style: string;
  /** دولة القارئ، تُستخدم لعرض القُرّاء المصريين أولًا */
  country?: string;
  /** معدل البت المتاح فعليًا على CDN لهذه التلاوة */
  bitrate?: 64 | 128;
  /** متاح فقط بمسار السورة الكاملة لا بمسار الآية */
  surahOnly?: boolean;
}

export interface TafsirAyah {
  number: number;
  text: string;
  numberInSurah: number;
}

export interface Bookmark {
  surah: number;
  ayah: number;
  label: string;
  createdAt: number;
}

export interface VerseNote {
  id: string;
  surah: number;
  ayah: number;
  text: string;
  updatedAt: number;
}

export interface ReadingProgress {
  surah: number;
  ayah: number;
  updatedAt: number;
}

export interface KhatmaPlan {
  days: number;
  startDate: string;
  dailyAyahs: number;
  completedAyahs: number;
  lastCompletedDate: string;
}

export interface Collection {
  id: string;
  name: string;
  items: Array<{ surah: number; ayah: number }>;
}
