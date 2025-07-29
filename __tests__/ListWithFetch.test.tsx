import React from 'react';
import {
  cleanup,
  render,
  screen,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react-native';
import ListWithFetch from '../src/components/ListWithFetch';
import {server} from '../test/mocks/server';
import {rest} from 'msw';
import mockedApiResponse from '../test/mocks/mockedApiResponse.json';

afterEach(cleanup);

// In this test suite, we are testing the component that fetches data from the server
// We are using msw to mock the server response

test('displays images from the server', async () => {
  // Render the component
  render(<ListWithFetch />);

  // Loader is initially visible
  expect(screen.getByLabelText(/loader/i)).toBeOnTheScreen();
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loader/i), {
    timeout: 1500,
  });
  // Verify that users are fetched and rendered
  expect(await screen.findAllByTestId(/user-container/i)).toHaveLength(10);

  // Verifying that the loader is no longer visible
  // There are 2 ways to verify that a component is not in the UI tree
  // 1. Use waitForElementToBeRemoved to wait for the element to be removed from the DOM
  // 2. Use getBy* methods and expect them to throw an error with a corresponding message
  // 3. Use queryBy* methods and expect them to return null (See the next expect statement)
  expect(() => screen.getByLabelText(/loader/i)).toThrow(
    'Unable to find an element with accessibility label: /loader/i',
  );

  // Verifying that there are no errors
  expect(screen.queryByLabelText(/alert/i)).toBeNull();
});

test('displays error upon error response from server', async () => {
  // Simulate an error response from the server
  server.resetHandlers(
    rest.get('https://dummyjson.com/users', (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  // Render the component
  render(<ListWithFetch />);

  // Loader is initially visible
  expect(screen.getByLabelText(/loader/i)).toBeOnTheScreen();
  // Verify that the error is rendered
  expect(await screen.findByText(/error oopsie/i)).toBeOnTheScreen();
  // Verifying that the loader is no longer visible
  expect(screen.queryByLabelText(/loader/i)).toBeNull();
});

test('displays mock data from JSON file successfully', async () => {
  // Override the default handler with mock data from JSON file
  server.resetHandlers(
    rest.get('https://dummyjson.com/users', (req, res, ctx) => {
      console.log('----------- serving mock data from JSON file ----------');
      return res(ctx.json(mockedApiResponse));
    }),
  );

  // Render the component
  render(<ListWithFetch />);

  // Wait for loading to complete
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loader/i), {
    timeout: 1500,
  });

  // Verify that users are rendered (FlatList initially renders visible items, typically 10)
  expect(await screen.findAllByTestId(/user-container/i)).toHaveLength(10);

  // Verify specific user data is displayed from the JSON file
  expect(screen.getByText('Umair Medhurst')).toBeOnTheScreen();
  expect(screen.getByText('atuny0@sohu.com')).toBeOnTheScreen();
  expect(screen.getByText('Sheldon Quigley')).toBeOnTheScreen();

  // Verify no errors are shown
  expect(screen.queryByLabelText(/alert/i)).toBeNull();
});

test('validates all 30 users are loaded from JSON file', async () => {
  // Override the default handler with mock data from JSON file
  server.resetHandlers(
    rest.get('https://dummyjson.com/users', (req, res, ctx) => {
      console.log('----------- serving full mock data to validate 30 users ----------');
      return res(ctx.json(mockedApiResponse));
    }),
  );

  // Render the component
  const {UNSAFE_root} = render(<ListWithFetch />);

  // Wait for loading to complete
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loader/i), {
    timeout: 1500,
  });

  // Initially, only ~10 items are rendered due to FlatList virtualization
  const renderedItems = await screen.findAllByTestId(/user-container/i);
  expect(renderedItems.length).toBeLessThanOrEqual(10);

  // Find the FlatList component
  const flatList = screen.getByTestId('user-list');
  
  // Access the data prop of the FlatList to verify all 30 users are loaded
  // Even though only ~10 are rendered, all 30 should be in the data array
  expect(flatList.props.data).toHaveLength(30);

  // Verify the data contains users from different positions in our JSON file
  const userData = flatList.props.data;
  
  // Check first user (index 0)
  expect(userData[0].firstName).toBe('Umair');
  expect(userData[0].lastName).toBe('Medhurst');
  expect(userData[0].email).toBe('atuny0@sohu.com');
  
  // Check middle user (index 14 - 15th user)
  expect(userData[14].firstName).toBe('Jeanne');
  expect(userData[14].lastName).toBe('Halvorson');
  expect(userData[14].email).toBe('kminchelle@qq.com');
  
  // Check last user (index 29 - 30th user)
  expect(userData[29].firstName).toBe('Maurine');
  expect(userData[29].lastName).toBe('Stracke');
  expect(userData[29].email).toBe('kdulyt@umich.edu');

  // Verify that the first user is rendered (since it's in the visible area)
  expect(screen.getByText('Umair Medhurst')).toBeOnTheScreen();
  expect(screen.getByText('atuny0@sohu.com')).toBeOnTheScreen();

  // Verify no errors are shown
  expect(screen.queryByLabelText(/alert/i)).toBeNull();
});
