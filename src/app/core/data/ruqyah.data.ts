export interface RuqyahItem {
  id: string;
  title: string;
  description: string;
  type: 'quran' | 'dua';
  surah?: number;
  from?: number;
  to?: number;
  text?: string;
  source: string;
  repeat?: number;
}

export const RUQYAH_ITEMS: RuqyahItem[] = [
  {
    id: 'fatiha',
    title: 'سورة الفاتحة',
    description: 'أمّ الكتاب، وهي من أعظم ما يُرقى به.',
    type: 'quran',
    surah: 1,
    from: 1,
    to: 7,
    source: 'القرآن الكريم · سورة الفاتحة',
    repeat: 3
  },
  {
    id: 'kursi',
    title: 'آية الكرسي',
    description: 'أعظم آية في القرآن، تُقرأ في الرقية والتحصين.',
    type: 'quran',
    surah: 2,
    from: 255,
    to: 255,
    source: 'القرآن الكريم · البقرة 255',
    repeat: 1
  },
  {
    id: 'baqara-end',
    title: 'آخر آيتين من سورة البقرة',
    description: 'خواتيم البقرة، من قرأهما في ليلة كفتاه.',
    type: 'quran',
    surah: 2,
    from: 285,
    to: 286,
    source: 'القرآن الكريم · البقرة 285-286',
    repeat: 1
  },
  {
    id: 'muawwidhat',
    title: 'المعوذات (الإخلاص والفلق والناس)',
    description: 'تُقرأ ثلاثًا صباحًا ومساءً وعند الرقية.',
    type: 'quran',
    surah: 112,
    from: 1,
    to: 4,
    source: 'القرآن الكريم · الإخلاص',
    repeat: 3
  },
  {
    id: 'falaq',
    title: 'سورة الفلق',
    description: 'استعاذة من شر الغاسق والنفاثات والحاسد.',
    type: 'quran',
    surah: 113,
    from: 1,
    to: 5,
    source: 'القرآن الكريم · الفلق',
    repeat: 3
  },
  {
    id: 'nas',
    title: 'سورة الناس',
    description: 'استعاذة من شر الوسواس الخنّاس.',
    type: 'quran',
    surah: 114,
    from: 1,
    to: 6,
    source: 'القرآن الكريم · الناس',
    repeat: 3
  },
  {
    id: 'sihr-araf',
    title: 'آيات إبطال السحر (الأعراف)',
    description: 'من قصة موسى مع السحرة.',
    type: 'quran',
    surah: 7,
    from: 117,
    to: 122,
    source: 'القرآن الكريم · الأعراف 117-122',
    repeat: 1
  },
  {
    id: 'sihr-yunus',
    title: 'آيات إبطال السحر (يونس)',
    description: '﴿وما كان الله ليُظهر عليكم من سلطان﴾ فتبين بطلان السحر.',
    type: 'quran',
    surah: 10,
    from: 79,
    to: 82,
    source: 'القرآن الكريم · يونس 79-82',
    repeat: 1
  },
  {
    id: 'sihr-taha',
    title: 'آيات إبطال السحر (طه)',
    description: '﴿وما أفلح الساحر حيث أتى﴾.',
    type: 'quran',
    surah: 20,
    from: 65,
    to: 69,
    source: 'القرآن الكريم · طه 65-69',
    repeat: 1
  },
  {
    id: 'hasad',
    title: 'آيات الحسد والعين (القلم)',
    description: '﴿وإن يكاد الذين كفروا ليُزلقونك بأبصارهم﴾.',
    type: 'quran',
    surah: 68,
    from: 51,
    to: 52,
    source: 'القرآن الكريم · القلم 51-52',
    repeat: 1
  },
  {
    id: 'dua-1',
    title: 'دعاء الرقية النبوية',
    description: 'كان النبي ﷺ يرقي بها.',
    type: 'dua',
    text: 'بِسْمِ اللَّهِ أَرْقِيكَ، بِسْمِ اللَّهِ أَشْفِيكَ، مِنْ كُلِّ دَاءٍ يُؤْذِيكَ، وَمِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ، اللَّهُ يَشْفِيكَ، بِسْمِ اللَّهِ أَرْقِيكَ.',
    source: 'رواه مسلم',
    repeat: 3
  },
  {
    id: 'dua-2',
    title: 'دعاء ذهاب الباس',
    description: 'كان النبي ﷺ يدعو به للمريض.',
    type: 'dua',
    text: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي، لَا شَافِيَ إِلَّا أَنْتَ.',
    source: 'رواه البخاري ومسلم',
    repeat: 3
  },
  {
    id: 'dua-3',
    title: 'الاستعاذة بكلمات الله التامات',
    description: 'تُقال للتحصين من كل شر.',
    type: 'dua',
    text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.',
    source: 'رواه مسلم',
    repeat: 3
  },
  {
    id: 'dua-4',
    title: 'تعويذ الأبناء',
    description: 'كان النبي ﷺ يعوّذ بها الحسن والحسين رضي الله عنهما.',
    type: 'dua',
    text: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ.',
    source: 'رواه البخاري',
    repeat: 1
  }
];
