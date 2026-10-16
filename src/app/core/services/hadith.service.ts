import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  HadithCategory,
  HadithDetail,
  HadithListItem,
  HadithPage
} from '../models/hadith.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class HadithService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  readonly categories = signal<HadithCategory[]>([]);
  readonly items = signal<HadithListItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly lastPage = signal(1);
  readonly totalItems = signal(0);
  readonly currentCategory = signal<HadithCategory | null>(null);

  private detailCache = new Map<string, HadithDetail>();

  async loadCategories(): Promise<void> {
    const cached = this.storage.get<HadithCategory[] | null>('hadith-categories', null);
    if (cached?.length) {
      this.categories.set(cached);
      return;
    }
    try {
      const res = await firstValueFrom(
        this.http.get<HadithCategory[]>(`${environment.hadithApi}/categories/list/?language=ar`)
      );
      const roots = res.filter((c) => c.parent_id === null);
      this.categories.set(roots);
      this.storage.set('hadith-categories', roots);
    } catch {
      this.error.set('تعذر تحميل التصنيفات. تحقق من الاتصال.');
    }
  }

  async loadCategory(category: HadithCategory, page = 1): Promise<void> {
    this.currentCategory.set(category);
    this.currentPage.set(page);
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await firstValueFrom(
        this.http.get<HadithPage | ''>(
          `${environment.hadithApi}/hadeeths/list/?language=ar&category_id=${category.id}&page=${page}`
        )
      );
      if (res === '' || !res.data) {
        this.items.set([]);
        this.lastPage.set(1);
        this.totalItems.set(0);
        return;
      }
      this.items.set(res.data);
      this.lastPage.set(Number(res.meta.last_page) || 1);
      this.totalItems.set(Number(res.meta.total_items) || res.data.length);
    } catch {
      this.error.set('تعذر تحميل الأحاديث. تحقق من الاتصال.');
    } finally {
      this.loading.set(false);
    }
  }

  async get(id: string): Promise<HadithDetail | null> {
    const memory = this.detailCache.get(id);
    if (memory) {
      return memory;
    }
    const stored = this.storage.get<HadithDetail | null>(`hadith:${id}`, null);
    if (stored) {
      this.detailCache.set(id, stored);
      return stored;
    }
    try {
      const res = await firstValueFrom(
        this.http.get<HadithDetail | ''>(`${environment.hadithApi}/hadeeths/one/?language=ar&id=${id}`)
      );
      if (res === '' || !res.id) {
        return null;
      }
      this.detailCache.set(id, res);
      this.storage.set(`hadith:${id}`, res);
      return res;
    } catch {
      return null;
    }
  }
}
