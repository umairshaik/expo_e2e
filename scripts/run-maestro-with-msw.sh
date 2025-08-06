#!/bin/bash

# Maestro tests with MSW (Mock Service Worker) integration
# This script runs Maestro tests using MSW for API mocking instead of WireMock

echo "🎭 Starting Maestro tests with MSW mocking..."

# Function to check if Maestro is installed
check_maestro() {
    if ! command -v maestro &> /dev/null; then
        echo "❌ Maestro CLI not found"
        echo "📥 Please install Maestro: https://maestro.mobile.dev/getting-started/installing-maestro"
        exit 1
    fi
    echo "✅ Maestro CLI found: $(maestro --version)"
}

# Function to check if app is running
check_app_running() {
    echo "📱 Checking if React Native app is running..."
    if ! curl -s http://localhost:8081/status > /dev/null 2>&1; then
        echo "⚠️  Metro bundler not detected on localhost:8081"
        echo "🚀 Please start your React Native app first:"
        echo "   yarn start"
        echo "   yarn ios  # or yarn android"
        echo ""
        read -p "Press Enter when your app is running, or Ctrl+C to exit..."
    else
        echo "✅ Metro bundler detected"
    fi
}

# Function to run Maestro tests
run_maestro_tests() {
    echo ""
    echo "🧪 Running Maestro tests..."
    echo "📝 MSW will automatically provide mocked responses"
    echo ""
    
    # Run basic flow test
    echo "🔄 Running basic flow test..."
    if maestro test .maestro/flow.yaml; then
        echo "✅ Basic flow test passed"
    else
        echo "❌ Basic flow test failed"
        return 1
    fi
    
    echo ""
    
    # Run mocked flow test (now using MSW instead of WireMock)
    echo "🔄 Running MSW mocked flow test..."
    if maestro test .maestro/flow-with-mocks.yaml; then
        echo "✅ MSW mocked flow test passed"
    else
        echo "❌ MSW mocked flow test failed"
        return 1
    fi
}

# Function to display results
show_results() {
    echo ""
    echo "🎉 All Maestro tests completed successfully!"
    echo ""
    echo "📊 Test Summary:"
    echo "  ✅ Basic app flow"
    echo "  ✅ MSW mocked data flow"
    echo ""
    echo "🎭 MSW Benefits:"
    echo "  • No external server required"
    echo "  • Automatic activation in development"
    echo "  • Same mock data as unit tests"
    echo "  • Faster test execution"
    echo ""
}

# Main execution
main() {
    check_maestro
    check_app_running
    
    if run_maestro_tests; then
        show_results
    else
        echo ""
        echo "❌ Some tests failed. Check the output above for details."
        echo ""
        echo "🔧 Troubleshooting tips:"
        echo "  • Ensure your app is running (yarn start + yarn ios/android)"
        echo "  • Check that MSW is active (look for '🎭 MSW mocking enabled' in app logs)"
        echo "  • Verify mock data matches expected format"
        echo "  • Check Maestro setup.js is setting global.__MAESTRO__ = true"
        exit 1
    fi
}

# Run the script
main "$@"