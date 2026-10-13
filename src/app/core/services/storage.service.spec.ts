import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new StorageService();
  });

  it('returns fallback when empty', () => {
    expect(service.get('missing', 7)).toBe(7);
  });

  it('roundtrips JSON values', () => {
    service.set('k', { a: 1 });
    expect(service.get('k', { a: 0 })).toEqual({ a: 1 });
  });
});
