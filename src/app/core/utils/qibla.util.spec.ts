import { compassDelta, qiblaBearing } from './qibla.util';

describe('qibla utils', () => {
  it('computes a bearing towards Makkah from Cairo', () => {
    const bearing = qiblaBearing(30.0444, 31.2357);
    expect(bearing).toBeGreaterThan(100);
    expect(bearing).toBeLessThan(160);
  });

  it('normalizes compass delta', () => {
    expect(compassDelta(10, 350)).toBe(-20);
    expect(compassDelta(350, 10)).toBe(20);
  });
});
