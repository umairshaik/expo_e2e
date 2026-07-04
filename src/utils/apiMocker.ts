import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mockedApiResponse from '../../test/mocks/mockedApiResponse.json';

let mockAdapter: MockAdapter | null = null;

export const enableApiMocking = () => {
  if (!__DEV__) {
    return;
  }

  if (mockAdapter) {
    console.log('🎭 API mocking already enabled');
    return;
  }

  // Create mock adapter for axios
  mockAdapter = new MockAdapter(axios, { delayResponse: 500 });

  // Mock the users endpoint
  mockAdapter.onGet(/\/users$/).reply(() => {
    console.log('🎭 Axios Mock: Serving mocked users data');
    console.log('📊 Returning', mockedApiResponse.users.length, 'users from mock data');
    console.log('🔥 First user in mock data:', mockedApiResponse.users[0]?.firstName, mockedApiResponse.users[0]?.lastName);
    return [200, mockedApiResponse];
  });

  // Mock individual user endpoint
  mockAdapter.onGet(/\/users\/(\d+)$/).reply((config) => {
    const matches = config.url?.match(/\/users\/(\d+)$/);
    const userId = matches ? parseInt(matches[1]) : null;
    
    if (userId) {
      const user = mockedApiResponse.users.find(u => u.id === userId);
      if (user) {
        console.log('🎭 Axios Mock: Serving single user data for ID:', userId);
        console.log('👤 Found user:', user.firstName, user.lastName);
        return [200, user];
      } else {
        console.log('❌ Axios Mock: User not found for ID:', userId);
        return [404, { message: 'User not found' }];
      }
    }
    
    return [400, { message: 'Invalid user ID' }];
  });

  console.log('🎭 Axios mocking enabled in development');
  console.log('🔍 Axios mock will intercept requests to /users endpoints');
};

export const disableApiMocking = () => {
  if (mockAdapter) {
    mockAdapter.restore();
    mockAdapter = null;
    console.log('🎭 Axios mocking disabled');
  }
};

export const resetMocks = () => {
  if (mockAdapter) {
    mockAdapter.reset();
    console.log('🎭 Axios mocks reset');
  }
};

// For testing - expose the mock adapter
export const getMockAdapter = () => mockAdapter;