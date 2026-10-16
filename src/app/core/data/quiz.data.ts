export type QuizCategory = 'quran' | 'seerah' | 'worship' | 'hadith';
export type QuizLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  level: QuizLevel;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  source?: string;
}

export const QUIZ_CATEGORIES: Array<{ id: QuizCategory; title: string; icon: string }> = [
  { id: 'quran', title: 'القرآن الكريم', icon: 'quran' },
  { id: 'seerah', title: 'السيرة النبوية', icon: 'scroll' },
  { id: 'worship', title: 'العبادات', icon: 'prayer' },
  { id: 'hadith', title: 'الحديث', icon: 'book' }
];

export const QUIZ_LEVELS: Array<{ id: QuizLevel; title: string }> = [
  { id: 'beginner', title: 'مبتدئ' },
  { id: 'intermediate', title: 'متوسط' },
  { id: 'advanced', title: 'متقدّم' }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'quran',
    level: 'beginner',
    question: 'كم عدد سور القرآن الكريم؟',
    options: ['110 سور', '114 سورة', '120 سورة', '100 سورة'],
    answer: 1,
    explanation: 'عدد سور القرآن الكريم مئة وأربع عشرة سورة.'
  },
  {
    id: 'q2',
    category: 'quran',
    level: 'beginner',
    question: 'ما أول سورة في المصحف؟',
    options: ['البقرة', 'الناس', 'الفاتحة', 'العلق'],
    answer: 2,
    explanation: 'أول سورة في المصحف هي الفاتحة.',
    source: 'ترتيب المصحف العثماني'
  },
  {
    id: 'q3',
    category: 'quran',
    level: 'beginner',
    question: 'أكمل: أول ما نزل من القرآن قوله تعالى…',
    options: ['﴿الحمد لله رب العالمين﴾', '﴿اقرأ باسم ربك الذي خلق﴾', '﴿قل هو الله أحد﴾', '﴿يا أيها المدثر﴾'],
    answer: 1,
    explanation: 'أول ما نزل قوله تعالى ﴿اقرأ باسم ربك الذي خلق﴾ من سورة العلق.',
    source: 'رواه البخاري'
  },
  {
    id: 'q4',
    category: 'quran',
    level: 'intermediate',
    question: 'ما السورة الوحيدة التي لا تبدأ بالبسملة؟',
    options: ['الأنفال', 'التوبة', 'يونس', 'النمل'],
    answer: 1,
    explanation: 'سورة التوبة هي الوحيدة التي لم تُفتتح بالبسملة.',
    source: 'مصاحف المصحف العثماني'
  },
  {
    id: 'q5',
    category: 'quran',
    level: 'intermediate',
    question: 'كم عدد أجزاء القرآن الكريم؟',
    options: ['20 جزءًا', '30 جزءًا', '40 جزءًا', '60 جزءًا'],
    answer: 1,
    explanation: 'قُسّم القرآن إلى ثلاثين جزءًا.'
  },
  {
    id: 'q6',
    category: 'quran',
    level: 'advanced',
    question: 'ما السورة التي ذُكرت فيها البسملة مرتين؟',
    options: ['البقرة', 'النمل', 'هود', 'الأنبياء'],
    answer: 1,
    explanation: 'سورة النمل وردت فيها البسملة في أولها وفي الآية 30 من رسالة سليمان لملكة سبأ.'
  },
  {
    id: 'q7',
    category: 'seerah',
    level: 'beginner',
    question: 'في أي مدينة وُلد النبي محمد ﷺ؟',
    options: ['المدينة المنورة', 'مكة المكرمة', 'الطائف', 'بيت المقدس'],
    answer: 1,
    explanation: 'وُلد النبي ﷺ في مكة المكرمة عام الفيل.'
  },
  {
    id: 'q8',
    category: 'seerah',
    level: 'beginner',
    question: 'من كان يكفل النبي ﷺ بعد وفاة جده عبد المطلب؟',
    options: ['العباس', 'أبو طالب', 'أبو لهب', 'حمزة'],
    answer: 1,
    explanation: 'كفله عمه أبو طالب بعد وفاة جده.'
  },
  {
    id: 'q9',
    category: 'seerah',
    level: 'beginner',
    question: 'أين كان نزول الوحي على النبي ﷺ أول مرة؟',
    options: ['غار ثور', 'غار حراء', 'المسجد الحرام', 'جبل عرفة'],
    answer: 1,
    explanation: 'نزل الوحي أول مرة في غار حراء.',
    source: 'رواه البخاري'
  },
  {
    id: 'q10',
    category: 'seerah',
    level: 'intermediate',
    question: 'ما أول غزوة كبرى في الإسلام؟',
    options: ['أحد', 'الخندق', 'بدر', 'خيبر'],
    answer: 2,
    explanation: 'غزوة بدر الكبرى هي أول الغزوات الكبرى.'
  },
  {
    id: 'q11',
    category: 'seerah',
    level: 'intermediate',
    question: 'من أول من أسلم من النساء؟',
    options: ['عائشة', 'خديجة رضي الله عنها', 'فاطمة', 'حفصة'],
    answer: 1,
    explanation: 'أول من أسلم من النساء خديجة بنت خويلد رضي الله عنها.'
  },
  {
    id: 'q12',
    category: 'seerah',
    level: 'advanced',
    question: 'ما أول مسجد بُني في الإسلام عند قدوم النبي ﷺ مهاجرًا؟',
    options: ['المسجد النبوي', 'مسجد قباء', 'المسجد الأقصى', 'مسجد القبلتين'],
    answer: 1,
    explanation: 'أول مسجد بُني عند الهجرة هو مسجد قباء.'
  },
  {
    id: 'q13',
    category: 'worship',
    level: 'beginner',
    question: 'كم عدد الصلوات المفروضة في اليوم والليلة؟',
    options: ['ثلاث', 'أربع', 'خمس', 'سبع'],
    answer: 2,
    explanation: 'فرض الله خمس صلوات في اليوم والليلة.'
  },
  {
    id: 'q14',
    category: 'worship',
    level: 'beginner',
    question: 'كم عدد ركعات صلاة المغرب؟',
    options: ['2', '3', '4', '5'],
    answer: 1,
    explanation: 'صلاة المغرب ثلاث ركعات.'
  },
  {
    id: 'q15',
    category: 'worship',
    level: 'beginner',
    question: 'عدد ركعات صلاة الفجر المفروضة:',
    options: ['ركعتان', 'ثلاث', 'أربع', 'ركعة'],
    answer: 0,
    explanation: 'صلاة الفجر ركعتان.'
  },
  {
    id: 'q16',
    category: 'worship',
    level: 'intermediate',
    question: 'ما وقت إخراج زكاة الفطر؟',
    options: ['بعد صلاة العيد', 'قبل صلاة العيد', 'أول رمضان', 'آخر شعبان'],
    answer: 1,
    explanation: 'تُخرج زكاة الفطر قبل صلاة العيد.',
    source: 'رواه البخاري'
  },
  {
    id: 'q17',
    category: 'worship',
    level: 'intermediate',
    question: 'كم عدد الأشهر الحرم؟',
    options: ['شهران', 'ثلاثة', 'أربعة', 'ستة'],
    answer: 2,
    explanation: 'الأشهر الحرم أربعة: ذو القعدة وذو الحجة والمحرّم ورجب.'
  },
  {
    id: 'q18',
    category: 'worship',
    level: 'advanced',
    question: 'ما الشهر الذي فرض فيه الصيام على المسلمين؟',
    options: ['شعبان', 'رجب', 'رمضان', 'محرم'],
    answer: 2,
    explanation: 'فُرض صيام رمضان، وقد كان فرضه في السنة الثانية من الهجرة.'
  },
  {
    id: 'q19',
    category: 'hadith',
    level: 'beginner',
    question: 'أكمل الحديث: «إنما الأعمال…»',
    options: ['بالإخلاص', 'بالنيات', 'بالأقوال', 'بالأجر'],
    answer: 1,
    explanation: '«إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى».',
    source: 'متفق عليه'
  },
  {
    id: 'q20',
    category: 'hadith',
    level: 'beginner',
    question: 'من صاحبا كتابي الصحيح في الحديث؟',
    options: ['الترمذي والنسائي', 'البخاري ومسلم', 'أبو داود وابن ماجه', 'أحمد والدارمي'],
    answer: 1,
    explanation: 'الصحيحان هما صحيح البخاري وصحيح مسلم.'
  },
  {
    id: 'q21',
    category: 'hadith',
    level: 'intermediate',
    question: 'كم عدد أحاديث الأربعين النووية؟',
    options: ['40 حديثًا', '41 حديثًا', '42 حديثًا', '50 حديثًا'],
    answer: 2,
    explanation: 'جمع الإمام النووي اثنين وأربعين حديثًا في الأربعين النووية.'
  },
  {
    id: 'q22',
    category: 'hadith',
    level: 'intermediate',
    question: 'أكمل: «الدين…»',
    options: ['معاملة', 'النصيحة', 'أخلاق', 'يسر'],
    answer: 1,
    explanation: '«الدين النصيحة» رواه مسلم.'
  },
  {
    id: 'q23',
    category: 'hadith',
    level: 'advanced',
    question: 'أكمل الحديث: «من غشّنا…»',
    options: ['فقد كفر', 'فليس منّا', 'فقد خسر', 'فلا بارك الله له'],
    answer: 1,
    explanation: '«من غشّنا فليس منّا» رواه مسلم.'
  }
];
