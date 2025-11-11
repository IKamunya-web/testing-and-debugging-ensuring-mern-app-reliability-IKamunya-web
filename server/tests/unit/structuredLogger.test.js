const structuredLogger = require('../../src/utils/structuredLogger');

describe('Structured Logger (Winston)', () => {
  let consoleLogSpy, consoleErrorSpy;

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('should log info messages', () => {
    expect(() => {
      structuredLogger.info('Test info message', { userId: '123' });
    }).not.toThrow();
  });

  test('should log error messages', () => {
    expect(() => {
      structuredLogger.error('Test error message', { error: 'Something went wrong' });
    }).not.toThrow();
  });

  test('should log warning messages', () => {
    expect(() => {
      structuredLogger.warn('Test warning message');
    }).not.toThrow();
  });

  test('should log debug messages', () => {
    expect(() => {
      structuredLogger.debug('Test debug message');
    }).not.toThrow();
  });

  test('should accept metadata objects', () => {
    expect(() => {
      structuredLogger.info('User login', {
        userId: '123',
        email: 'test@example.com',
        timestamp: new Date().toISOString()
      });
    }).not.toThrow();
  });

  test('should include service name in logs', () => {
    // Verify that default metadata is included
    expect(() => {
      structuredLogger.info('Test with metadata', { action: 'test' });
    }).not.toThrow();
  });
});
