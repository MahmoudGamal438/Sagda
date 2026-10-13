import { Injectable } from '@angular/core';

const PREFIX = 'sujda:';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* quota or private mode */
    }
  }

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  }
}
