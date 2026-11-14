import { describe, expect, it } from 'vitest';
import { addDays, calculatePregnancy, dateToUtcMilliseconds } from '../src/domain/pregnancy';
import { getWeekCard } from '../src/data/weeks';

describe('pregnancy calendar', () => {
  it('computes LMP and 280-day estimated due date', () => {
    const p = calculatePregnancy('2026-09-01', '2026-10-09');
    expect(p.completedWeeks).toBe(5);
    expect(p.dayInWeek).toBe(3);
    expect(p.currentWeek).toBe(6);
    expect(p.dueDate).toBe(addDays('2026-09-01', 280));
  });

  it('does not drift across daylight-saving transitions', () => {
    expect(calculatePregnancy('2026-03-27', '2026-03-30').gestationalDays).toBe(3);
  });

  it('handles leap dates and rejects invalid days', () => {
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(() => dateToUtcMilliseconds('2026-02-30')).toThrow();
  });

  it('rejects future LMP and out-of-range pregnancy', () => {
    expect(() => calculatePregnancy('2026-12-01', '2026-11-14')).toThrow();
    expect(() => calculatePregnancy('2025-01-01', '2026-11-14')).toThrow();
  });

  it('returns a weekly draft for all 42 weeks', () => {
    for (let w = 1; w <= 42; w++) {
      expect(getWeekCard(w).tasks.length).toBeGreaterThan(0);
      expect(getWeekCard(w).reviewed).toBe(false);
    }
  });
});
