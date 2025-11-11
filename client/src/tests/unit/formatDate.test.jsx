import { formatDateISO } from '../../utils/formatDate';

describe('formatDateISO', () => {
  it('formats a Date to YYYY-MM-DD', () => {
    const date = new Date('2020-05-04T12:00:00Z');
    expect(formatDateISO(date)).toBe('2020-05-04');
  });
});
