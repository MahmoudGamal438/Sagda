export type RadioCategory = 'egypt' | 'quran' | 'tafsir' | 'reciter';

export interface RadioStation {
  id: number;
  name: string;
  url: string;
  country?: string;
  category?: RadioCategory;
  featured?: boolean;
}

export const EGYPT_STATIONS: RadioStation[] = [
  {
    id: -1,
    name: 'إذاعة القرآن الكريم من القاهرة',
    url: 'https://stream.radiojar.com/8s5u5tpdtwzuv',
    country: 'مصر',
    category: 'egypt',
    featured: true
  },
  {
    id: -2,
    name: 'إذاعة الشيخ محمود خليل الحصري',
    url: 'https://qurango.net/radio/mahmoud_khalil_alhussary_warsh',
    country: 'مصر',
    category: 'egypt'
  },
  {
    id: -3,
    name: 'إذاعة الشيخ مصطفى إسماعيل',
    url: 'https://qurango.net/radio/mustafa_ismail',
    country: 'مصر',
    category: 'egypt'
  },
  {
    id: -4,
    name: 'إذاعة الشيخ عبد الباسط عبد الصمد (مجوّد)',
    url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad',
    country: 'مصر',
    category: 'egypt'
  },
  {
    id: -5,
    name: 'مختصر التفسير',
    url: 'https://qurango.net/radio/mukhtasartafsir',
    category: 'tafsir'
  },
  {
    id: -6,
    name: 'إذاعة القرآن الكريم (عامة)',
    url: 'https://stream.radiojar.com/0tpy1h0kxtzuv',
    category: 'quran'
  },
  {
    id: -7,
    name: 'إذاعة الشيخ مشاري العفاسي',
    url: 'https://qurango.net/radio/mishary_alafasi',
    category: 'reciter'
  }
];

export const FALLBACK_STATIONS: RadioStation[] = [
  ...EGYPT_STATIONS,
  { id: 1, name: 'إذاعة القرآن الكريم - تراتيل', url: 'https://backup.qurango.net/radio/tarateel', category: 'quran' },
  { id: 2, name: 'أحمد العجمي', url: 'https://backup.qurango.net/radio/ahmad_alajmy', category: 'reciter' },
  { id: 3, name: 'سعد الغامدي', url: 'https://backup.qurango.net/radio/saad_alghamdi', category: 'reciter' },
  { id: 5, name: 'ياسر الدوسري', url: 'https://backup.qurango.net/radio/yasser_aldosari', category: 'reciter' }
];
