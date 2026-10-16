export interface RadioStation {
  id: number;
  name: string;
  url: string;
}

export const FALLBACK_STATIONS: RadioStation[] = [
  { id: 1, name: 'إذاعة القرآن الكريم - تراتيل', url: 'https://backup.qurango.net/radio/tarateel' },
  { id: 2, name: 'أحمد العجمي', url: 'https://backup.qurango.net/radio/ahmad_alajmy' },
  { id: 3, name: 'سعد الغامدي', url: 'https://backup.qurango.net/radio/saad_alghamdi' },
  {
    id: 4,
    name: 'عبد الباسط عبد الصمد (مجوّد)',
    url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad'
  },
  { id: 5, name: 'ياسر الدوسري', url: 'https://backup.qurango.net/radio/yasser_aldosari' }
];
