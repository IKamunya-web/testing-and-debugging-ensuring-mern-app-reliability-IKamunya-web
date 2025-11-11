const errorHandler = require('../../src/middleware/errorHandler');
const structuredLogger = require('../../src/utils/structuredLogger');

// Mock the structured logger
jest.mock('../../src/utils/structuredLogger', () => ({
  error: jest.fn()
}));

describe('errorHandler middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs error and sends 500 response', () => {
    const err = new Error('boom');
    const req = { method: 'GET', url: '/api/posts', id: undefined };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(structuredLogger.error).toHaveBeenCalledWith(
      'boom',
      expect.objectContaining({
        method: 'GET',
        url: '/api/posts',
        statusCode: 500
      })
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'boom',
      requestId: undefined 
    });
  });

  it('handles errors without message property', () => {
    const err = 'String error';
    const req = { method: 'POST', url: '/api/posts' };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(structuredLogger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
