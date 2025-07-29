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
- Run your Maestro tests
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
The `ListWithFetch.tsx` component has been modified to detect when running in a test environment:

```javascript
const isTestEnvironment = __DEV__ && (
  process.env.NODE_ENV === 'test' || 
  global.__MAESTRO__ || 
  false
);

const BASE_URL = isTestEnvironment 
  ? 'http://10.0.2.2:8080' // WireMock server (Android emulator)
  : 'https://dummyjson.com'; // Production API
```

### 2. Mock Data
- Your existing mock data from `test/mocks/mockedApiResponse.json` is reused
- WireMock serves this data at `http://localhost:8080/users`
- Android emulators access it via `http://10.0.2.2:8080/users`

### 3. Maestro Detection
The setup script sets `global.__MAESTRO__ = true` so your app knows it's running under Maestro.

## Files Created

- `wiremock/mappings/users.json` - WireMock mapping configuration
- `wiremock/__files/users-response.json` - Mock response data (copy of your existing mock)
- `scripts/setup-wiremock.sh` - Downloads and starts WireMock
- `scripts/stop-wiremock.sh` - Stops WireMock server
- `scripts/run-maestro-tests.sh` - Complete test runner with cleanup
- `.maestro/flow-with-mocks.yaml` - Maestro test that expects mocked data

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
- Verify the app is in test mode by checking console logs
- Ensure WireMock is running: `curl http://localhost:8080/__admin/health`
- For iOS simulator, you might need to use `http://localhost:8080` instead

### Network requests failing
- Android emulator: Use `http://10.0.2.2:8080`
- iOS simulator: Use `http://localhost:8080`
- Check WireMock logs for incoming requests

## Alternative Approaches

### Option 1: WireMock Cloud
For cloud-based mocking without local setup:

1. Sign up at [WireMock Cloud](https://app.wiremock.cloud/)
2. Import your mappings
3. Update the BASE_URL to use your WireMock Cloud URL

### Option 2: JSON Server
For a simpler alternative to WireMock:

```bash
# Install json-server
npm install -g json-server

# Start server with your mock data
json-server --watch test/mocks/mockedApiResponse.json --port 8080
```

### Option 3: Build Variants
Create different app builds for testing (more complex but cleaner separation).

## Benefits of This Approach

1. **Reliable Tests**: No dependency on external APIs
2. **Faster Execution**: Local responses are much faster
3. **Controlled Environment**: Test specific scenarios (errors, edge cases)
4. **Offline Testing**: No internet connection required
5. **Reusable**: Same mock data used in unit tests and E2E tests 