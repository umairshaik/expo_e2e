#!/bin/bash

# Test runner script for Maestro tests with WireMock

set -e  # Exit on any error

echo "🎭 Running Maestro tests with network mocking..."

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    ./scripts/stop-wiremock.sh
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Start WireMock server
echo "🚀 Starting WireMock server..."
./scripts/setup-wiremock.sh

# Wait a moment for WireMock to be fully ready
sleep 2

# Verify WireMock is responding
echo "🔍 Verifying WireMock is ready..."
if ! curl -s http://localhost:8080/__admin/health > /dev/null; then
    echo "❌ WireMock is not responding, aborting tests"
    exit 1
fi

echo "✅ WireMock is ready, running Maestro tests..."

# Run Maestro tests
maestro test .maestro/

echo "🎉 Maestro tests completed!"

# Cleanup will be called automatically due to trap 