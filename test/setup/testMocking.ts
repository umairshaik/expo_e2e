import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import mockedApiResponse from '../mocks/mockedApiResponse.json';

let mockAdapter: MockAdapter;

export const setupTestMocking = () => {
  // Create mock adapter for axios with no delay in tests
  mockAdapter = new MockAdapter(axios);

  // Mock the users endpoint
  mockAdapter.onGet(/\/users$/).reply(() => {
    console.log('🧪 Test Mock: Serving mocked users data');
    return [200, mockedApiResponse];
  });

  // Mock individual user endpoint
  mockAdapter.onGet(/\/users\/(\d+)$/).reply((config) => {
    const matches = config.url?.match(/\/users\/(\d+)$/);
    const userId = matches ? parseInt(matches[1]) : null;
    
    if (userId) {
      const user = mockedApiResponse.users.find(u => u.id === userId);
      if (user) {
        console.log('🧪 Test Mock: Serving single user data for ID:', userId);
        return [200, user];
      } else {
        console.log('🧪 Test Mock: User not found for ID:', userId);
        return [404, { message: 'User not found' }];
      }
    }
    
    return [400, { message: 'Invalid user ID' }];
  });
};

export const teardownTestMocking = () => {
  if (mockAdapter) {
    mockAdapter.restore();
  }
};

export const resetTestMocks = () => {
  if (mockAdapter) {
    mockAdapter.reset();
    setupTestMocking(); // Re-setup default mocks
  }
};

export const getTestMockAdapter = () => mockAdapter;