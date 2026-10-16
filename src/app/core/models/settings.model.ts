export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  quranFontSize: number;
  quranLineHeight: number;
  reciterId: string;
  playbackRate: number;
  showTranslation: boolean;
  translationEdition: string;
  tafsirEdition: string;
  personalDua: string;
  autoNextDhikr: boolean;
  reduceMotion: boolean;
  tasbeehVibrate: boolean;
  tasbeehSound: boolean;
  alertVolume: number;
  adhanVoice: string;
  installPromptDismissedAt: number | null;
}

export interface Reminder {
  id: string;
  title: string;
  message: string;
  hour: number;
  minute: number;
  days: number[];
  enabled: boolean;
  sound: boolean;
}

export interface TasbeehSession {
  id: string;
  phrase: string;
  count: number;
  target: number;
  startedAt: number;
  endedAt: number;
}

export interface ActivityEntry {
  id: string;
  type: 'quran' | 'adhkar' | 'tasbeeh' | 'prayer';
  title: string;
  at: number;
}
