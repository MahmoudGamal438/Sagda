import { Injectable } from '@angular/core';
import { DhikrCategory } from '../models/adhkar.model';
import { ADHKAR_CATEGORIES } from '../data/adhkar.data';

@Injectable({ providedIn: 'root' })
export class AdhkarService {
  readonly categories = ADHKAR_CATEGORIES;

  byId(id: string): DhikrCategory | undefined {
    return this.categories.find((c) => c.id === id);
  }

  morningEvening(now = new Date()): DhikrCategory {
    const h = now.getHours();
    const id = h >= 4 && h < 15 ? 'morning' : 'evening';
    return this.byId(id)!;
  }

  search(query: string): Array<{ category: DhikrCategory; itemId: string }> {
    const q = query.trim();
    if (!q) {
      return [];
    }
    const hits: Array<{ category: DhikrCategory; itemId: string }> = [];
    for (const cat of this.categories) {
      if (cat.title.includes(q) || cat.description.includes(q)) {
        hits.push({ category: cat, itemId: cat.items[0]?.id ?? cat.id });
      }
      for (const item of cat.items) {
        if (item.text.includes(q) || item.source.includes(q)) {
          hits.push({ category: cat, itemId: item.id });
        }
      }
    }
    return hits;
  }
}
