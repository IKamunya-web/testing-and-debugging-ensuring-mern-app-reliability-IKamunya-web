const authMiddleware = require('../../src/middleware/auth');

function mockReq(headers = {}) {
  return {
    header: (name) => headers[name.toLowerCase()],
  };
}

describe('authMiddleware', () => {
  it('adds req.user when Authorization header present as Bearer token', () => {
    const req = mockReq({ authorization: 'Bearer 12345' });
    const res = {};
    let called = false;
    authMiddleware(req, res, () => { called = true; });
    expect(called).toBe(true);
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('12345');
  });

  it('calls next and does not set user when header missing', () => {
    const req = mockReq({});
    const res = {};
    let called = false;
    authMiddleware(req, res, () => { called = true; });
    expect(called).toBe(true);
    expect(req.user).toBeUndefined();
  });

  it('parses token when header contains token only', () => {
    const req = mockReq({ authorization: 'token-only' });
    const res = {};
    let called = false;
    authMiddleware(req, res, () => { called = true; });
    expect(called).toBe(true);
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('token-only');
  });
});
