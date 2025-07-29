# Network Layer Mocking with Wiremock

**Document Type:** Technical Guide  
**Last Updated:** December 2024  
**Owner:** Mobile Development Team  
**Reviewers:** QA Team, DevOps Team  

## Executive Summary

This document outlines the implementation and usage of Wiremock as our network layer mocking solution for mobile application testing. Wiremock provides a standalone HTTP mock server that intercepts network requests and returns predefined responses, enabling reliable, fast, and deterministic testing.

## Table of Contents

1. [Overview](#overview)
2. [Business Value](#business-value)
3. [Technical Architecture](#technical-architecture)
4. [Implementation Guide](#implementation-guide)
5. [Configuration Management](#configuration-management)
6. [Testing Patterns](#testing-patterns)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Team Guidelines](#team-guidelines)

---

## Overview

### What is Network Layer Mocking?

Network layer mocking involves intercepting HTTP/HTTPS requests from your application and returning controlled responses instead of calling real external APIs. This technique is essential for:

- **Isolated Testing** - Remove dependencies on external services
- **Controlled Scenarios** - Test error conditions and edge cases
- **Performance** - Eliminate network latency and external service delays
- **Reliability** - Prevent test failures due to external service issues

### Why Wiremock?

| Criteria | Wiremock | Alternative Solutions |
|----------|----------|----------------------|
| **Standalone Operation** | ✅ Runs independently | ❌ Often requires integration |
| **Language Agnostic** | ✅ HTTP-based, works with any client | ⚠️ Some are language-specific |
| **Advanced Matching** | ✅ Complex URL patterns, headers, body matching | ⚠️ Limited in some tools |
| **Response Templating** | ✅ Dynamic responses with templates | ❌ Static responses only |
| **Admin Interface** | ✅ Web UI for monitoring | ⚠️ Limited or no UI |
| **Fault Injection** | ✅ Simulate network issues, delays | ❌ Not available |

---

## Business Value

### Development Team Benefits

- **🚀 Faster Development Cycles** - No waiting for backend services
- **🎯 Focused Testing** - Test specific scenarios without complex setup
- **🔄 Parallel Development** - Frontend and backend teams work independently
- **📊 Predictable Testing** - Deterministic results for CI/CD pipelines

### Quality Assurance Benefits

- **🧪 Comprehensive Test Coverage** - Test error scenarios easily
- **⚡ Faster Test Execution** - Local responses vs. network calls
- **🔍 Debugging Support** - Request/response logging and inspection
- **📈 Stable Test Results** - No flaky tests due to external dependencies

### Business Impact

| Metric | Before Wiremock | After Wiremock | Improvement |
|--------|----------------|----------------|-------------|
| Test Execution Time | ~10 minutes | ~3 minutes | 70% reduction |
| Test Reliability | 85% pass rate | 98% pass rate | 15% improvement |
| Development Velocity | Blocked by API availability | Independent development | Unblocked development |
| Bug Detection | Late stage | Early stage | Shift-left testing |

---

## Technical Architecture

### System Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Mobile App     │    │   Wiremock       │    │  Real API       │
│                 │    │   Server         │    │  (Production)   │
│  ┌───────────┐  │    │  ┌─────────────┐ │    │                 │
│  │Environment│  │    │  │   Mappings  │ │    │                 │
│  │Detection  │  │────┼─▶│   Engine    │ │    │                 │
│  │Logic      │  │    │  └─────────────┘ │    │                 │
│  └───────────┘  │    │  ┌─────────────┐ │    │                 │
│                 │    │  │  Response   │ │    │                 │
└─────────────────┘    │  │  Files      │ │    │                 │
                       │  └─────────────┘ │    │                 │
                       └──────────────────┘    └─────────────────┘
                               │                         │
                               └─────────────────────────┘
                                  Production Traffic
```

### Component Architecture

#### 1. Environment Detection Layer
**Location:** `src/config/environment.ts`

```typescript
const isTestEnvironment = __DEV__ && 
  (process.env.NODE_ENV === 'test' || (global as any).__MAESTRO__);

const BASE_URL = isTestEnvironment 
  ? WIREMOCK_URL 
  : PRODUCTION_API_URL;
```

**Responsibilities:**
- Runtime environment detection
- URL routing between mock and real services
- Platform-specific configuration (Android/iOS)

#### 2. Wiremock Server
**Port:** 8080  
**Admin Interface:** http://localhost:8080/__admin

**Core Components:**
- **Mappings Engine** - URL pattern matching and request routing
- **Response Generator** - Static and dynamic response generation
- **Request Recorder** - Logging and debugging support
- **Fault Injector** - Network failure simulation

#### 3. Configuration Files

| File Type | Location | Purpose |
|-----------|----------|---------|
| **Mappings** | `wiremock/mappings/*.json` | URL patterns and response definitions |
| **Response Files** | `wiremock/__files/*.json` | Static response content |
| **Server JAR** | `wiremock/wiremock-jre8-standalone-*.jar` | Wiremock executable |

---

## Implementation Guide

### Prerequisites

- **Java Runtime Environment** (JRE 8 or higher)
- **Development Environment** with __DEV__ flag support
- **Network Access** to localhost (port 8080)

### Step 1: Initial Setup

```bash
# 1. Create directory structure
mkdir -p wiremock/{mappings,__files}

# 2. Download Wiremock (automated via script)
./scripts/setup-wiremock.sh

# 3. Verify installation
java -jar wiremock/wiremock-jre8-standalone-*.jar --version
```

### Step 2: Environment Configuration

```typescript
// src/config/environment.ts
import { Platform } from 'react-native';

const WIREMOCK_ENDPOINTS = {
  android: 'http://10.0.2.2:8080',      // Android emulator
  ios: 'http://localhost:8080',          // iOS simulator
  device: 'http://YOUR_IP:8080'          // Physical device
};

export const BASE_URL = __DEV__ 
  ? WIREMOCK_ENDPOINTS[Platform.OS] 
  : 'https://api.production.com';
```

### Step 3: Create API Mappings

```json
// wiremock/mappings/users-api.json
{
  "request": {
    "method": "GET",
    "urlPathPattern": "/api/v1/users.*"
  },
  "response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json",
      "X-Mock-Server": "Wiremock"
    },
    "bodyFileName": "users-response.json"
  }
}
```

### Step 4: Define Response Data

```json
// wiremock/__files/users-response.json
{
  "users": [
    {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com",
      "role": "admin"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 20
  }
}
```

---

## Configuration Management

### Mapping File Structure

```json
{
  "request": {
    "method": "GET|POST|PUT|DELETE",
    "url": "/exact/path",                    // Exact match
    "urlPath": "/path/segment",              // Path prefix
    "urlPathPattern": "/api/.*/users",       // Regex pattern
    "headers": {
      "Authorization": {
        "matches": "Bearer .*"
      }
    },
    "queryParameters": {
      "status": {
        "equalTo": "active"
      }
    }
  },
  "response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "bodyFileName": "response.json",         // External file
    "jsonBody": {...},                       // Inline JSON
    "body": "Raw text response"              // Raw text
  }
}
```

### Advanced Patterns

#### Conditional Responses
```json
{
  "request": {
    "method": "GET",
    "urlPathPattern": "/api/users.*",
    "queryParameters": {
      "error": {"equalTo": "true"}
    }
  },
  "response": {
    "status": 500,
    "jsonBody": {
      "error": "Internal Server Error",
      "code": "ERR_DATABASE_UNAVAILABLE"
    }
  }
}
```

#### Dynamic Responses with Templating
```json
{
  "response": {
    "status": 200,
    "jsonBody": {
      "requestId": "{{randomValue type='UUID'}}",
      "timestamp": "{{now}}",
      "requestedPath": "{{request.url}}"
    }
  }
}
```

#### Response Delays and Faults
```json
{
  "response": {
    "status": 200,
    "fixedDelayMilliseconds": 2000,
    "fault": "CONNECTION_RESET_BY_PEER"
  }
}
```

---

## Testing Patterns

### 1. Happy Path Testing
```json
// Successful API responses
{
  "request": {"method": "GET", "urlPath": "/api/profile"},
  "response": {
    "status": 200,
    "jsonBody": {"id": 1, "name": "John Doe"}
  }
}
```

### 2. Error Scenario Testing
```json
// 4xx Client Errors
{
  "request": {"method": "POST", "urlPath": "/api/login"},
  "response": {
    "status": 401,
    "jsonBody": {"error": "Invalid credentials"}
  }
}

// 5xx Server Errors
{
  "request": {"method": "GET", "urlPath": "/api/data"},
  "response": {
    "status": 503,
    "jsonBody": {"error": "Service temporarily unavailable"}
  }
}
```

### 3. Edge Case Testing
```json
// Empty responses
{
  "response": {
    "status": 200,
    "jsonBody": {"users": [], "total": 0}
  }
}

// Malformed responses
{
  "response": {
    "status": 200,
    "body": "Invalid JSON response"
  }
}
```

### 4. Performance Testing
```json
// Slow responses
{
  "response": {
    "status": 200,
    "fixedDelayMilliseconds": 5000,
    "jsonBody": {"message": "Slow response"}
  }
}

// Timeout simulation
{
  "response": {
    "fault": "CONNECTION_RESET_BY_PEER"
  }
}
```

---

## Best Practices

### 1. File Organization

```
wiremock/
├── mappings/
│   ├── auth/
│   │   ├── login.json
│   │   └── logout.json
│   ├── users/
│   │   ├── get-users.json
│   │   ├── create-user.json
│   │   └── user-errors.json
│   └── products/
│       └── catalog.json
└── __files/
    ├── auth/
    ├── users/
    └── products/
```

### 2. Naming Conventions

| File Type | Convention | Example |
|-----------|------------|---------|
| **Mappings** | `{method}-{resource}-{scenario}.json` | `get-users-success.json` |
| **Responses** | `{resource}-{scenario}-response.json` | `users-success-response.json` |
| **Error Cases** | `{resource}-{error-type}.json` | `users-validation-error.json` |

### 3. Response Data Management

```json
// Good: Realistic data
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice.johnson@company.com",
  "createdAt": "2024-01-15T10:30:00Z"
}

// Bad: Fake/unrealistic data
{
  "id": 999999,
  "name": "Test User",
  "email": "test@test.com",
  "createdAt": "1970-01-01T00:00:00Z"
}
```

### 4. Environment Configuration

```typescript
// Good: Environment-aware configuration
const getBaseUrl = () => {
  if (__DEV__) {
    if ((global as any).__MAESTRO__) return WIREMOCK_URL;
    if (process.env.NODE_ENV === 'test') return WIREMOCK_URL;
  }
  return PRODUCTION_URL;
};

// Bad: Hard-coded URLs
const BASE_URL = 'http://localhost:8080';
```

### 5. Error Handling

```typescript
// Good: Graceful degradation
const fetchData = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    if (error.status === 503) {
      // Handle service unavailable
      return getCachedData();
    }
    throw error;
  }
};
```

---

## Troubleshooting

### Common Issues

#### Issue: Wiremock Server Won't Start

**Symptoms:**
- Connection refused errors
- Port already in use messages
- Java-related errors

**Diagnosis:**
```bash
# Check Java installation
java -version

# Check port availability
lsof -i :8080

# Check Wiremock process
ps aux | grep wiremock
```

**Solutions:**
```bash
# Kill existing processes
kill $(lsof -t -i:8080)

# Use alternative port
java -jar wiremock.jar --port 8081

# Check Java version
# Wiremock requires Java 8 or higher
```

#### Issue: App Still Hitting Real API

**Symptoms:**
- Real data appears in app
- Network requests to production URLs
- Missing mock headers in responses

**Diagnosis:**
```bash
# Check Wiremock admin interface
curl http://localhost:8080/__admin/requests

# Verify app configuration
# Look for debug logs showing BASE_URL
```

**Solutions:**
1. Restart application to pick up environment changes
2. Verify environment detection logic
3. Check platform-specific URL configuration
4. Confirm Wiremock is running and accessible

#### Issue: Mock Responses Not Matching

**Symptoms:**
- 404 Not Found from Wiremock
- Unexpected responses
- Missing request data

**Diagnosis:**
```bash
# Check request logs
curl http://localhost:8080/__admin/requests | jq

# Verify mapping patterns
curl http://localhost:8080/__admin/mappings | jq
```

**Solutions:**
1. Review URL patterns in mapping files
2. Check HTTP method matching
3. Verify header and parameter matching
4. Test mappings with curl commands

### Debugging Commands

```bash
# Wiremock health check
curl http://localhost:8080/__admin/health

# View all mappings
curl http://localhost:8080/__admin/mappings | jq

# View request history
curl http://localhost:8080/__admin/requests | jq

# Reset request history
curl -X DELETE http://localhost:8080/__admin/requests

# Reload mappings
curl -X POST http://localhost:8080/__admin/mappings/reset
```

---

## Team Guidelines

### Development Workflow

1. **Feature Development**
   - Create mock data before implementing API calls
   - Test both success and error scenarios
   - Document expected API behavior

2. **Code Review**
   - Verify mock configurations match API specifications
   - Ensure error scenarios are covered
   - Check for realistic test data

3. **Testing**
   - Run tests with Wiremock enabled
   - Verify network layer isolation
   - Test platform-specific configurations

### Collaboration Guidelines

#### For Backend Developers
- Provide API specifications early
- Share realistic sample data
- Communicate API changes promptly

#### For Frontend Developers
- Create comprehensive mock scenarios
- Document edge cases and error conditions
- Maintain mock data consistency

#### For QA Engineers
- Validate mock scenarios against real APIs
- Test error handling thoroughly
- Report discrepancies between mock and real responses

### Maintenance Process

#### Weekly Tasks
- [ ] Review and update mock data
- [ ] Check for new API endpoints
- [ ] Validate error scenarios

#### Release Tasks
- [ ] Compare mock responses with production APIs
- [ ] Update response schemas if needed
- [ ] Verify platform compatibility

#### Monthly Tasks
- [ ] Clean up unused mock files
- [ ] Update Wiremock version if needed
- [ ] Review and optimize mapping patterns

---

## Conclusion

Wiremock provides a robust foundation for network layer mocking, enabling faster development cycles, reliable testing, and improved developer productivity. By following the patterns and practices outlined in this document, teams can build maintainable, comprehensive test suites that accurately simulate real-world scenarios.

### Key Success Metrics

- **Development Velocity**: Reduced dependency on backend services
- **Test Reliability**: Consistent, deterministic test results
- **Quality Assurance**: Comprehensive error scenario coverage
- **Team Collaboration**: Independent frontend/backend development

### Next Steps

1. Implement Wiremock in your project following this guide
2. Train team members on configuration and best practices
3. Establish monitoring and maintenance processes
4. Gather feedback and iterate on the implementation

---

**Document History:**
- v1.0 - Initial documentation
- v1.1 - Added troubleshooting section
- v1.2 - Enhanced team guidelines

**Related Documents:**
- [API Specification Guide](link)
- [Testing Strategy Overview](link)
- [Mobile Development Standards](link) 