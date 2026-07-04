import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mockedApiResponse from '../../test/mocks/mockedApiResponse.json';

let mockAdapter: MockAdapter | null = null;

export const enableApiMocking = () => {
  if (!__DEV__) {
    return;
  }

  if (mockAdapter) {
    return;
  }

  mockAdapter = new MockAdapter(axios, { delayResponse: 500 });

  mockAdapter.onGet(/\/users$/).reply(() => {
    return [200, mockedApiResponse];
  });

  mockAdapter.onGet(/\/users\/(\d+)$/).reply((config) => {
    const matches = config.url?.match(/\/users\/(\d+)$/);
    const userId = matches ? parseInt(matches[1]) : null;
    
    if (userId) {
      const user = mockedApiResponse.users.find(u => u.id === userId);
      if (user) {
        return [200, user];
      } else {
        return [404, { message: 'User not found' }];
      }
    }
    
    return [400, { message: 'Invalid user ID' }];
  });
};

export const disableApiMocking = () => {
  if (mockAdapter) {
    mockAdapter.restore();
    mockAdapter = null;
  }
};

export const resetMocks = () => {
  if (mockAdapter) {
    mockAdapter.reset();
  }
};

export const getMockAdapter = () => mockAdapter;