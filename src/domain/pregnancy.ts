export type PregnancyProgress = {
  gestationalDays: number;
  completedWeeks: number;
  dayInWeek: number;
  currentWeek: number;
  dueDate: string;
  daysUntilDue: number;
};

const MS_PER_DAY = 86_400_000;
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function dateToUtcMilliseconds(isoDate: string): number {
  const match = ISO_RE.exec(isoDate);
  if (!match) throw new Error('Укажите дату в формате ГГГГ-ММ-ДД.');
  const [, y, m, d] = match;
  const year = Number(y), month = Number(m), day = Number(d);
  const utc = new Date(0);
  utc.setUTCFullYear(year, month - 1, day);
  utc.setUTCHours(0, 0, 0, 0);
  if (utc.getUTCFullYear() !== year || utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) {
    throw new Error('Несуществующая дата.');
  }
  return utc.getTime();
}

export function formatIsoDate(value: number): string {
  return new Date(value).toISOString().slice(0, 10);
}

export function addDays(isoDate: string, days: number): string {
  return formatIsoDate(dateToUtcMilliseconds(isoDate) + days * MS_PER_DAY);
}

export function todayLocal(date = new Date()): string {
  const year = date.getFullYear();
  return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function calculatePregnancy(lmp: string, today = todayLocal()): PregnancyProgress {
  const elapsed = Math.floor((dateToUtcMilliseconds(today) - dateToUtcMilliseconds(lmp)) / MS_PER_DAY);
  if (elapsed < 0) throw new Error('Дата последней менструации не может быть в будущем.');
  if (elapsed > 42 * 7 + 6) throw new Error('Срок выходит за пределы календаря. Уточните дату или начните новую историю.');
  return {
    gestationalDays: elapsed,
    completedWeeks: Math.floor(elapsed / 7),
    dayInWeek: elapsed % 7,
    currentWeek: Math.min(42, Math.floor(elapsed / 7) + 1),
    dueDate: addDays(lmp, 280),
    daysUntilDue: 280 - elapsed,
  };
}
