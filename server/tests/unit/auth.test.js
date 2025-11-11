const { generateToken } = require('../../src/utils/auth');
const mongoose = require('mongoose');

describe('generateToken', () => {
  it('returns null when no user', () => {
    expect(generateToken(null)).toBeNull();
  });

  it('returns id string when passed a user object with _id', () => {
    const user = { _id: new mongoose.Types.ObjectId() };
    const token = generateToken(user);
    expect(typeof token).toBe('string');
    expect(token).toBe(user._id.toString());
  });

  it('returns string when passed a plain value', () => {
    expect(generateToken('abc')).toBe('abc');
  });
});
