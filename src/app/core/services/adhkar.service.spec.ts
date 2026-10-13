import { AdhkarService } from './adhkar.service';

describe('AdhkarService', () => {
  const service = new AdhkarService();

  it('includes required categories', () => {
    const ids = service.categories.map((c) => c.id);
    expect(ids).toContain('morning');
    expect(ids).toContain('evening');
    expect(ids).toContain('after-prayer');
    expect(ids).toContain('ruqyah');
  });

  it('returns morning or evening by hour', () => {
    const morning = new Date();
    morning.setHours(8, 0, 0, 0);
    expect(service.morningEvening(morning).id).toBe('morning');
    const evening = new Date();
    evening.setHours(18, 0, 0, 0);
    expect(service.morningEvening(evening).id).toBe('evening');
  });

  it('does not invent empty categories', () => {
    for (const c of service.categories) {
      expect(c.items.length).toBeGreaterThan(0);
      for (const item of c.items) {
        expect(item.source.length).toBeGreaterThan(0);
        expect(item.repeat).toBeGreaterThan(0);
      }
    }
  });
});
