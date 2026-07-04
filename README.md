# my-app

A modern React Native + Expo application demonstrating best practices for cross-platform development with seamless API mocking.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Run on specific platform
yarn ios          # iOS simulator
yarn android      # Android emulator
yarn web          # Web browser
```

## 📋 Tech Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| Expo | 52 | Cross-platform framework |
| React | 18.3.1 | UI library |
| React Native | 0.76.9 | Native runtime |
| Tamagui | 1.94.2 | Cross-platform UI components |
| Axios | 1.6.0 | HTTP client |
| MSW | 2.0.0 | Network mocking |
| Jest | 29.7.0 | Testing framework |
| TypeScript | 5.8.3 | Type safety |

## 🏗️ Project Structure

```
src/
├── App.tsx                    # Root component
├── components/
│   └── ListWithFetch.tsx      # Main user list component
├── services/
│   └── UserService.ts         # API service layer
├── viewmodels/
│   └── UserViewModel.ts       # Data management layer
├── utils/
│   └── apiMocker.ts           # API mocking utilities
└── config/
    └── environment.ts         # Environment configuration

test/
├── mocks/
│   ├── handlers.ts            # MSW request handlers
│   ├── mockedApiResponse.json # Mock data
│   └── server.ts              # MSW Jest server
├── setup/
│   └── testMocking.ts         # Test configuration
└── components/
    └── ListWithFetch.test.tsx # Component tests
```

## 🎯 Key Features

### Cross-Platform Support
- **iOS, Android, and Web** - Single codebase, multiple platforms
- **Responsive UI** - Built with Tamagui for consistent design
- **Safe Area Handling** - Proper layout on all device types

### Network Mocking (MSW)
- **Zero Configuration** - Works out of the box in development
- **Seamless Interception** - Network-level request handling
- **Consistent Mock Handlers** - Same configuration for dev and testing
- **Error Simulation** - Easy testing of failure scenarios

> 📖 See [MSW Setup Guide](./README-MSW-mocking.md) for detailed documentation
### Smart Environment Detection
```
Development → MSW intercepts and mocks requests
Testing     → MSW mocks requests in Jest
Production  → Real API (dummyjson.com)
```

## 📱 Environment Details

- **Platform**: macOS
- **Shell**: zsh 5.9
- **Current Branch**: feature/msw
- **Working Directory**: `/Users/umair.shaik/Projects/Practice/simple-expo/my-app`

## 🔧 Available Scripts

```bash
yarn start              # Start Expo development server
yarn ios                # Run on iOS simulator
yarn android            # Run on Android emulator
yarn web                # Run in web browser
yarn test               # Run Jest tests
yarn test --watch       # Run tests in watch mode
yarn format             # Format code with Prettier
yarn prebuild           # Generate native projects
```

## 📚 Documentation

### [MSW Network Mocking Guide](./README-MSW-mocking.md)
Complete guide to Mock Service Worker setup, usage, and configuration:
- Overview and architecture
- Configuration and handlers
- Development and testing usage
- Troubleshooting and best practices
- Migration guide from WireMock

### [Expo Prebuild Guide](./PREBUILD_GUIDE.md)
Guide to generating native Android and iOS projects:
- How Expo prebuild works
- Configuration-driven generation
- Native project structure
- When to use prebuild
- Making configuration and dependency changes

### Expo Prebuild
Expo prebuild generates native Android and iOS projects from your `app.json` configuration:
- **Configuration-driven** - Single source of truth in `app.json`
- **Reproducible builds** - Generate consistent native projects
- **Clean regeneration** - Use `--clean` for fresh start

```bash
# Generate native projects
yarn prebuild

# Clean regeneration
yarn prebuild --clean

# Platform-specific
yarn prebuild --platform android
yarn prebuild --platform ios
```

**Current Status**: Native folders (`android/`, `ios/`) are generated and configured.

> 📖 See [PREBUILD_GUIDE.md](./PREBUILD_GUIDE.md) for detailed documentation

## 🏗️ Architecture Overview

```
┌─────────────────────────────────┐
│  ListWithFetch Component        │
│  (User Interface)               │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│  UserViewModel                  │
│  (Data Management)              │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│  UserService                    │
│  (API Service)                  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│  Axios HTTP Client              │
└──────────────┬──────────────────┘
               │
        ┌──────┴──────┐
        │             │
    ┌───▼────┐   ┌────▼────┐
    │   MSW   │   │ Real API│
    │ Mocking │   │Production
    └─────────┘   └─────────┘
```

## 🧪 Testing

Tests are located in the `test/` directory and use Jest with MSW for API mocking.

```bash
# Run all tests
yarn test

# Run in watch mode
yarn test --watch

# Run specific test file
yarn test ListWithFetch.test.tsx
```

MSW is automatically configured in `jest.setup.js` to intercept API calls during testing.

## 🔄 Data Flow

1. **Component renders** → `ListWithFetch` mounts
2. **Effect hook** → Calls `UserService.fetchUsers()`
3. **HTTP request** → Axios GET to `https://dummyjson.com/users`
4. **MSW intercepts** → Matches handler pattern
5. **Mock response** → Returns data from `mockedApiResponse.json`
6. **Component updates** → Displays user list

## 🛠️ Development Workflow

### Adding a New Feature
1. Create component/service in `src/`
2. Add MSW handlers in `test/mocks/handlers.ts`
3. Write tests in `test/components/`
4. Run `yarn test` to verify

### Modifying API Endpoints
1. Update handlers in `test/mocks/handlers.ts`
2. Update mock data in `test/mocks/mockedApiResponse.json`
3. Update service methods in `src/services/`
4. Test with `yarn test`

### Building for Native Platforms
```bash
# Clean regenerate native projects
yarn prebuild

# Build and run
yarn ios    # or yarn android
```

## 📖 Best Practices

1. **Keep MSW Handlers Simple** - Focus on essential patterns
2. **Use Real Data Structure** - Match production API exactly
3. **Test Error Cases** - Use MSW to simulate failures
4. **Document Complex Logic** - Comment non-obvious code
5. **Reset Handlers in Tests** - Use `server.resetHandlers()` between tests
6. **Commit app.json Changes** - Source of truth for native config

## 🚧 Recent Changes

- Refactored test structure to top-level `test/` directory
- Migrated from WireMock to MSW for better integration
- Cleaned up verbose logging
- Improved Android/iOS native build compatibility

## 📝 Git Branches

- **feature/msw** (current) - Latest development with MSW integration
- **main** - Stable release-ready code

## 🤝 Contributing

When making changes:
1. Create a feature branch from `main`
2. Make your changes and add tests
3. Run `yarn test` and `yarn format`
4. Ensure all tests pass
5. Create a pull request

## 📞 Support

For detailed information on specific features:
- **Network Mocking**: See [README-MSW-mocking.md](./README-MSW-mocking.md)
- **Native Builds**: See [PREBUILD_GUIDE.md](./PREBUILD_GUIDE.md)
- **MSW Documentation**: [mswjs.io](https://mswjs.io/docs/)
- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)

## 📄 License

0BSD
