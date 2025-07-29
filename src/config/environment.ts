import { Platform } from 'react-native';

// Check if we're in a test environment or if Maestro is running
const isTestEnvironment =
  __DEV__ &&
  // Check for Maestro environment variable or any test indicator
  (process.env.NODE_ENV === 'test' || (global as any).__MAESTRO__ || false); // You can add more conditions here

// For Maestro testing - use WireMock server
// Note: In production, you'd use environment variables or build-time flags

// If testing on physical device, replace with your computer's IP address
// You can find it with: ipconfig getifaddr en0 (macOS) or hostname -I (Linux)
const DEVELOPMENT_HOST = 'localhost'; // Change this to your IP if using physical device

const BASE_URL = __DEV__
  ? Platform.OS === 'android' 
    ? `http://10.0.2.2:8080` // Android emulator - maps to host machine
    : `http://${DEVELOPMENT_HOST}:8080` // iOS simulator or physical device
  : 'https://dummyjson.com';

// Add some logging to help debug
console.log('🔍 Debug info:', {
  __DEV__,
  NODE_ENV: process.env.NODE_ENV,
  __MAESTRO__: (global as any).__MAESTRO__,
  isTestEnvironment,
  BASE_URL,
});

export { isTestEnvironment, BASE_URL };