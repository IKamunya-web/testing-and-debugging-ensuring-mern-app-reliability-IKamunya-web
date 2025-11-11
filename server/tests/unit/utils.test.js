const { validatePostInput } = require('../../src/utils/validators');

describe('Server utils - validatePostInput', () => {
  it('returns isValid=false when title missing', () => {
    const { errors, isValid } = validatePostInput({ content: 'hello' });
    expect(isValid).toBe(false);
    expect(errors).toHaveProperty('title');
  });

  it('returns isValid=false when content missing', () => {
    const { errors, isValid } = validatePostInput({ title: 'hi' });
    expect(isValid).toBe(false);
    expect(errors).toHaveProperty('content');
  });

  it('returns isValid=true when both present', () => {
    const { errors, isValid } = validatePostInput({ title: 'hi', content: 'there' });
    expect(isValid).toBe(true);
    expect(Object.keys(errors).length).toBe(0);
  });
});
