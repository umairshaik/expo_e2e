# Network Mocking with Maestro Tests

This guide explains how to run Maestro tests with mocked network responses using WireMock.

## Quick Start

### 1. Run tests with mocking (easiest method):

```bash
./scripts/run-maestro-tests.sh
```

This script will:

- Download WireMock if needed
- Start the WireMock server with your mock data
- Run your Maestro tests (all tests in the .maestro/ directory)
- Clean up and stop WireMock when done

### 2. Manual setup (if you need more control):

```bash
# Start WireMock server
./scripts/setup-wiremock.sh

# In another terminal, run Maestro tests
maestro test .maestro/flow-with-mocks.yaml

# Stop WireMock when done
./scripts/stop-wiremock.sh
```

## How It Works

### 1. App Configuration

The application uses environment configuration in `src/config/environment.ts` to detect when running in a test environment:

```typescript
import { Platform } from 'react-native';

// Check if we're in a test environment or if Maestro is running
const isTestEnvironment =
  __DEV__ &&
  // Check for Maestro environment variable or any test indicator
  (process.env.NODE_ENV === 'test' || (global as any).__MAESTRO__ || false);

// For Maestro testing - use WireMock server
const DEVELOPMENT_HOST = 'localhost'; // Change this to your IP if using physical device

const BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? `http://10.0.2.2:8080` // Android emulator - maps to host machine
    : `http://${DEVELOPMENT_HOST}:8080` // iOS simulator or physical device
  : 'https://dummyjson.com';
```

Then in `ListWithFetch.tsx`, this configuration is imported and used:

```typescript
import { BASE_URL } from '../config/environment';

// Later in the component
const fetchData = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    setUsersData(response.data.users);
    // ...
```

### 2. Mock Data

- Your existing mock data from `test/mocks/mockedApiResponse.json` is reused
- WireMock serves this data at `http://localhost:8080/users`
- Android emulators access it via `http://10.0.2.2:8080/users`
- iOS simulators access it via `http://localhost:8080/users`

### 3. Maestro Detection

The `.maestro/setup.js` script sets `global.__MAESTRO__ = true` so your app knows it's running under Maestro:

```javascript
// Set global flag to indicate Maestro is running
// Check if global exists and create it if not
if (typeof global === 'undefined') {
  var global = this;
}
global.__MAESTRO__ = true;

output.screens = {
  listWitchFetch: {
    firstItemId: '1-user-container',
    fifteenthItemId: '15-user-container',
  },
};

// You can add more setup here if needed
console.log(' Maestro environment setup complete');
```

The Maestro flow in `.maestro/flow-with-mocks.yaml` then uses these outputs in the test flow:

```yaml
# Wait for the app to load and make the network request
# This should now use mocked data from WireMock
- extendedWaitUntil:
    visible: 'Umair Medhurst'
    timeout: 10000

# ListWithFetch screen flow - should now use mocked data
- assertVisible:
    id: ${output.screens.listWitchFetch.firstItemId}
```

## Files Created

- `wiremock/mappings/users.json` - WireMock mapping configuration
- `wiremock/__files/users-response.json` - Mock response data (copy of your existing mock)
- `scripts/setup-wiremock.sh` - Downloads and starts WireMock
- `scripts/stop-wiremock.sh` - Stops WireMock server
- `scripts/run-maestro-tests.sh` - Complete test runner with cleanup
- `.maestro/flow-with-mocks.yaml` - Maestro test that expects mocked data
- `.maestro/setup.js` - Maestro setup script that sets `global.__MAESTRO__` flag

## Customizing Mock Responses

### Adding Error Scenarios

Create additional mappings in `wiremock/mappings/`:

```json
{
  "request": {
    "method": "GET",
    "urlPathPattern": "/users.*",
    "queryParameters": {
      "error": {
        "equalTo": "true"
      }
    }
  },
  "response": {
    "status": 500,
    "headers": {
      "Content-Type": "application/json"
    },
    "jsonBody": {
      "error": "Internal Server Error"
    }
  }
}
```

### Different Response Based on Parameters

WireMock supports conditional responses based on headers, query parameters, etc.

## Troubleshooting

### WireMock not starting

- Ensure Java is installed: `java -version`
- Check if port 8080 is available: `lsof -i :8080`

### App still hitting real API

- Verify the app is in test mode by checking console logs (look for the debug info with BASE_URL)
- Ensure WireMock is running: `curl http://localhost:8080/__admin/health`
- Check the proper URL is being used:
  - Android emulator: `http://10.0.2.2:8080`
  - iOS simulator: `http://localhost:8080`
  - Physical device: Update DEVELOPMENT_HOST in environment.ts with your computer's IP address

### Network requests failing

- Android emulator: Use `http://10.0.2.2:8080`
- iOS simulator: Use `http://localhost:8080`
- Physical device: Change DEVELOPMENT_HOST in environment.ts to your computer's IP address
- Check WireMock logs for incoming requests

## Alternative Approaches

### Option 1: WireMock Cloud

For cloud-based mocking without local setup:

1. Sign up at [WireMock Cloud](https://app.wiremock.cloud/)
2. Import your mappings
3. Update the BASE_URL in `src/config/environment.ts` to use your WireMock Cloud URL

### Option 2: JSON Server

For a simpler alternative to WireMock:

```bash
# Install json-server
npm install -g json-server

# Start server with your mock data
json-server --watch test/mocks/mockedApiResponse.json --port 8080
```

Then update the BASE_URL in the same way.

### Option 3: Build Variants

Create different app builds for testing with environment variables (more complex but cleaner separation).

## Benefits of This Approach

1. **Reliable Tests**: No dependency on external APIs
2. **Faster Execution**: Local responses are much faster
3. **Controlled Environment**: Test specific scenarios (errors, edge cases)
4. **Offline Testing**: No internet connection required
5. **Reusable**: Same mock data used in unit tests and E2E tests
6. **Platform Agnostic**: Works on both Android and iOS with the appropriate host configuration
