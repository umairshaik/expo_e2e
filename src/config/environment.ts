import { Platform } from 'react-native';

// Check if we're in a test environment or if Maestro is running
const isTestEnvironment =
  __DEV__ &&
  // Check for Maestro environment variable or any test indicator
  (process.env.NODE_ENV === 'test' || (global as any).__MAESTRO__ || false);

// MSW will handle mocking in development, so we use real URLs
// MSW intercepts requests and returns mocked responses when active
const BASE_URL = 'https://dummyjson.com';

// Add some logging to help debug
console.log('🔍 Debug info:', {
  __DEV__,
  NODE_ENV: process.env.NODE_ENV,
  __MAESTRO__: (global as any).__MAESTRO__,
  isTestEnvironment,
  BASE_URL,
  MSW_ENABLED: __DEV__, // MSW will be active in development
});

export { isTestEnvironment, BASE_URL };