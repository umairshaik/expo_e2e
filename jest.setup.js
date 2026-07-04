import { setupTestMocking, teardownTestMocking, resetTestMocks } from './test/setup/testMocking';

// increasing jest timeout to 10 seconds due to slow ci env
jest.setTimeout(10000);

//establish api mocking before all tests
beforeAll(() => {
  setupTestMocking();
});

//clean up after the tests are finished
afterAll(() => {
  teardownTestMocking();
});

afterEach(() => {
  //reset any requests handlers that we may add during the tests,
  //so they don't affect other tests.
  resetTestMocks();
});
