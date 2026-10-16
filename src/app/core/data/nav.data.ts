export interface NavItem {
  path: string;
  icon: string;
  label: string;
  keywords?: string[];
}

export interface NavGroup {
  title: string;
  icon: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'الرئيسية',
    icon: 'home',
    items: [
      { path: '/', icon: 'home', label: 'لوحة اليوم', keywords: ['الرئيسية', 'مواقيت', 'التقويم'] },
      { path: '/favorites', icon: 'heart', label: 'المفضلة', keywords: ['محفوظات'] },
      { path: '/stats', icon: 'list', label: 'الإحصائيات', keywords: ['نشاط', 'تقدم'] }
    ]
  },
  {
    title: 'القرآن الكريم',
    icon: 'quran',
    items: [
      { path: '/quran', icon: 'quran', label: 'المصحف والسور', keywords: ['قرآن', 'سورة', 'آية', 'مصحف'] },
      { path: '/quran/listen', icon: 'headset', label: 'التلاوات الصوتية', keywords: ['صوت', 'قارئ', 'تلاوة', 'استماع'] },
      { path: '/quran/tafsir', icon: 'book', label: 'التفسير', keywords: ['تفسير', 'ميسر', 'جلالين'] },
      { path: '/quran/khatma', icon: 'check', label: 'خطة الختمة', keywords: ['ختمة', 'ورد', 'ورد يومي'] }
    ]
  },
  {
    title: 'الذكر والدعاء',
    icon: 'adhkar',
    items: [
      { path: '/adhkar', icon: 'adhkar', label: 'الأذكار والأدعية', keywords: ['ذكر', 'دعاء', 'صباح', 'مساء'] },
      { path: '/tasbeeh', icon: 'tasbeeh', label: 'المسبحة', keywords: ['تسبيح', 'سبحة', 'عدّاد'] },
      { path: '/ruqyah', icon: 'shield', label: 'الرقية الشرعية', keywords: ['رقية', 'شفاء', 'عين', 'حسد'] },
      { path: '/asma', icon: 'star', label: 'أسماء الله الحسنى', keywords: ['أسماء', 'حسنى'] }
    ]
  },
  {
    title: 'العبادة',
    icon: 'prayer',
    items: [
      { path: '/prayer', icon: 'prayer', label: 'مواقيت الصلاة والأذان', keywords: ['صلاة', 'أذان', 'فجر', 'مواقيت', 'تنبيه'] },
      { path: '/qibla', icon: 'qibla', label: 'اتجاه القبلة', keywords: ['قبلة', 'بوصلة', 'اتجاه'] },
      { path: '/calendar', icon: 'calendar', label: 'التقويم الهجري', keywords: ['تقويم', 'هجري', 'مناسبات'] },
      { path: '/reminders', icon: 'bell', label: 'التذكيرات', keywords: ['تذكير', 'منبه'] },
      { path: '/zakat', icon: 'shield', label: 'حاسبة الزكاة', keywords: ['زكاة', 'حساب', 'مال'] }
    ]
  },
  {
    title: 'المحتوى',
    icon: 'book',
    items: [
      { path: '/hadith', icon: 'book', label: 'الأحاديث النبوية', keywords: ['حديث', 'أحاديث', 'سنة'] },
      { path: '/stories', icon: 'scroll', label: 'قصص الأنبياء', keywords: ['قصص', 'أنبياء', 'سيرة'] },
      { path: '/quiz', icon: 'help', label: 'اختبارات وأسئلة', keywords: ['اختبار', 'أسئلة', 'سؤال وجواب'] }
    ]
  },
  {
    title: 'الصوتيات والأدوات',
    icon: 'radio',
    items: [
      { path: '/radio', icon: 'radio', label: 'الراديو الإسلامي', keywords: ['راديو', 'بث', 'بث مباشر'] },
      { path: '/assistant', icon: 'sparkles', label: 'المساعد', keywords: ['مساعد', 'مساعدة'] },
      { path: '/search', icon: 'search', label: 'البحث العام', keywords: ['بحث'] },
      { path: '/settings', icon: 'settings', label: 'الإعدادات', keywords: ['إعدادات', 'مظهر', 'صوت'] },
      { path: '/offline', icon: 'wifiOff', label: 'العمل دون اتصال', keywords: ['أوفلاين', 'دون اتصال'] }
    ]
  }
];

export const BOTTOM_NAV: NavItem[] = [
  { path: '/', icon: 'home', label: 'الرئيسية' },
  { path: '/prayer', icon: 'prayer', label: 'الأذان' },
  { path: '/radio', icon: 'radio', label: 'الراديو' },
  { path: '/assistant', icon: 'sparkles', label: 'المساعد' },
  { path: '/more', icon: 'more', label: 'المزيد' }
];
