const logger = require('../../src/utils/logger');

describe('logger', () => {
  it('calls console.error when error is logged', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('test-error');
    expect(spy).toHaveBeenCalledWith('test-error');
    spy.mockRestore();
  });
});
