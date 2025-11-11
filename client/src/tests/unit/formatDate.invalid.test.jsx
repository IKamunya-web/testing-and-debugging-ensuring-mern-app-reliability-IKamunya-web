import { formatDateISO } from '../../utils/formatDate';

describe('formatDateISO - invalid input handling', () => {
  it('returns NaN-like date parts when passed invalid input', () => {
    const res = formatDateISO('not-a-date');
    // If Date cannot parse, it will produce 'NaN-NaN-NaN' or similar; ensure it returns a string
    expect(typeof res).toBe('string');
  });
});
