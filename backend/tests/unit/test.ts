import { reset, charge, buildApp } from '../../../backend/app';

// Mock the createClient function from the 'redis' module
jest.mock('redis', () => ({
  createClient: jest.fn(),
}));

// Mock the methods of the Redis client
const mockRedisClient = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  multi: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Unit Tests', () => {
  it('should reset the balance of the given account', async () => {
    // Mock the createClient function to return our mock Redis client
    (require('redis') as any).createClient.mockReturnValue(mockRedisClient);

    // Mock the set and disconnect methods
    mockRedisClient.set.mockResolvedValue(undefined);
    mockRedisClient.disconnect.mockResolvedValue(undefined);

    // Call the reset function
    await reset('account');

    // Assert that set and disconnect methods were called
    expect(mockRedisClient.set).toHaveBeenCalledWith('account/balance', '100');
    expect(mockRedisClient.disconnect).toHaveBeenCalled();
  });

  it('should charge the account if there is sufficient balance', async () => {
    // Mock the createClient function to return our mock Redis client
    (require('redis') as any).createClient.mockReturnValue(mockRedisClient);

    // Mock the get, multi, and disconnect methods
    mockRedisClient.get.mockResolvedValue('100');
    mockRedisClient.multi.mockReturnValue({ exec: jest.fn().mockResolvedValue(undefined) });
    mockRedisClient.disconnect.mockResolvedValue(undefined);

    // Call the charge function
    const result = await charge('account', 10);

    // Assert that get, multi, and disconnect methods were called
    expect(mockRedisClient.get).toHaveBeenCalledWith('account/balance');
    expect(mockRedisClient.multi).toHaveBeenCalledTimes(1);
    expect(mockRedisClient.disconnect).toHaveBeenCalled();

    // Assert the result
    expect(result).toEqual({ isAuthorized: true, remainingBalance: 90, charges: 10 });
  });
});

