import {server} from './test/mocks/server';

// increasing jest timeout to 10 seconds due to slow ci env
jest.setTimeout(10000);

//establish api mocking before all tests
beforeAll(() => server.listen());

//clean up after the tests are finished
afterAll(() => server.close());

afterEach(() => {
  //reset any requests handlers that we may add during the tests,
  //so they don't affect other tests.
  server.resetHandlers();
});
