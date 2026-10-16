export interface AdhanVoice {
  id: string;
  muezzin: string;
  place: string;
  file: string;
}

export const ADHAN_VOICES: AdhanVoice[] = [
  {
    id: 'rifaat',
    muezzin: 'الشيخ محمد رفعت',
    place: 'القاهرة',
    file: '/audio/adhan/rifaat.mp3'
  },
  {
    id: 'naqshbandi',
    muezzin: 'الشيخ سيد النقشبندي',
    place: 'طنطا',
    file: '/audio/adhan/naqshbandi.mp3'
  },
  {
    id: 'abdulbasit',
    muezzin: 'الشيخ عبد الباسط عبد الصمد',
    place: 'القاهرة',
    file: '/audio/adhan/abdulbasit.mp3'
  },
  {
    id: 'husary',
    muezzin: 'الشيخ محمود خليل الحصري',
    place: 'القاهرة',
    file: '/audio/adhan/husary.mp3'
  },
  {
    id: 'minshawi',
    muezzin: 'الشيخ محمد صديق المنشاوي',
    place: 'المنيا',
    file: '/audio/adhan/minshawi.mp3'
  },
  {
    id: 'mustafa-ismail',
    muezzin: 'الشيخ مصطفى إسماعيل',
    place: 'مصر',
    file: '/audio/adhan/mustafa-ismail.mp3'
  },
  {
    id: 'banna',
    muezzin: 'الشيخ محمود علي البنا',
    place: 'القاهرة',
    file: '/audio/adhan/banna.mp3'
  },
  {
    id: 'shuaisha',
    muezzin: 'الشيخ أبو العينين شعيشع',
    place: 'القاهرة',
    file: '/audio/adhan/shuaisha.mp3'
  }
];

export const DEFAULT_ADHAN_VOICE = 'rifaat';

export function findAdhanVoice(id: string): AdhanVoice {
  return ADHAN_VOICES.find((v) => v.id === id) ?? ADHAN_VOICES[0];
}
