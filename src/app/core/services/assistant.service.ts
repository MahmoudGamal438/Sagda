import { inject, Injectable } from '@angular/core';
import { AdhkarService } from './adhkar.service';
import { QuranService } from './quran.service';
import { NAV_GROUPS } from '../data/nav.data';
import { ASMA_UL_HUSNA } from '../data/asma.data';
import { PROPHET_STORIES } from '../data/stories.data';

export interface AssistantResult {
  title: string;
  context: string;
  path: string;
  icon: string;
  kind: string;
}

@Injectable({ providedIn: 'root' })
export class AssistantService {
  private adhkar = inject(AdhkarService);
  private quran = inject(QuranService);

  search(query: string): AssistantResult[] {
    const q = query.trim();
    if (q.length < 2) {
      return [];
    }
    const results: AssistantResult[] = [];

    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        const haystack = [item.label, group.title, ...(item.keywords ?? [])].join(' ');
        if (haystack.includes(q)) {
          results.push({
            title: item.label,
            context: group.title,
            path: item.path,
            icon: item.icon,
            kind: 'قسم'
          });
        }
      }
    }

    for (const cat of this.adhkar.categories) {
      if (cat.title.includes(q) || cat.description.includes(q)) {
        results.push({
          title: cat.title,
          context: 'الأذكار والأدعية',
          path: `/adhkar/read/${cat.id}`,
          icon: 'adhkar',
          kind: 'أذكار'
        });
      }
      for (const item of cat.items) {
        if (item.text.includes(q)) {
          results.push({
            title: `${item.text.slice(0, 60)}…`,
            context: `${cat.title} · ${item.source}`,
            path: `/adhkar/read/${cat.id}`,
            icon: 'adhkar',
            kind: 'ذكر'
          });
          break;
        }
      }
    }

    const surahs = this.quran.surahs();
    for (const s of surahs) {
      if (s.name.replace('سُورَةُ ', '').includes(q) || s.englishName.toLowerCase().includes(q.toLowerCase())) {
        results.push({
          title: s.name,
          context: `سورة رقم ${s.number} · ${s.numberOfAyahs} آية`,
          path: `/quran/read/${s.number}`,
          icon: 'quran',
          kind: 'سورة'
        });
      }
    }

    for (const name of ASMA_UL_HUSNA) {
      if (name.arabic.includes(q) || name.meaning.includes(q)) {
        results.push({
          title: `${name.arabic} — ${name.meaning}`,
          context: `أسماء الله الحسنى · ${name.note}`,
          path: '/asma',
          icon: 'star',
          kind: 'اسم'
        });
      }
    }

    for (const story of PROPHET_STORIES) {
      if (story.name.includes(q) || story.title.includes(q) || story.topics.some((t) => t.includes(q))) {
        results.push({
          title: story.title,
          context: 'قصص الأنبياء',
          path: `/stories/${story.id}`,
          icon: 'scroll',
          kind: 'قصة'
        });
      }
    }

    return results.slice(0, 20);
  }
}
