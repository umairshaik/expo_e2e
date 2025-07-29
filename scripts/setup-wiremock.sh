#!/bin/bash

# Setup script for WireMock with Maestro tests

WIREMOCK_VERSION="2.35.0"
WIREMOCK_JAR="wiremock-jre8-standalone-${WIREMOCK_VERSION}.jar"
WIREMOCK_URL="https://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-jre8-standalone/${WIREMOCK_VERSION}/${WIREMOCK_JAR}"

echo "🔧 Setting up WireMock for Maestro tests..."

# Create directories if they don't exist
mkdir -p wiremock/mappings
mkdir -p wiremock/__files

# Download WireMock if it doesn't exist
if [ ! -f "wiremock/${WIREMOCK_JAR}" ]; then
    echo "📥 Downloading WireMock..."
    curl -o "wiremock/${WIREMOCK_JAR}" "${WIREMOCK_URL}"
    echo "✅ WireMock downloaded successfully"
else
    echo "✅ WireMock already exists"
fi

# Copy mock data if it doesn't exist
if [ ! -f "wiremock/__files/users-response.json" ]; then
    echo "📋 Copying mock data..."
    cp test/mocks/mockedApiResponse.json wiremock/__files/users-response.json
    echo "✅ Mock data copied"
else
    echo "✅ Mock data already exists"
fi

echo "🚀 Starting WireMock server on port 8080..."
cd wiremock
java -jar "${WIREMOCK_JAR}" --port 8080 &
WIREMOCK_PID=$!

echo "WireMock PID: ${WIREMOCK_PID}"
echo "${WIREMOCK_PID}" > wiremock.pid

# Wait for WireMock to start
sleep 3

# Test if WireMock is running
if curl -s http://localhost:8080/__admin/health > /dev/null; then
    echo "✅ WireMock is running successfully on http://localhost:8080"
    echo "📊 Admin interface: http://localhost:8080/__admin"
    echo "🧪 Test endpoint: http://localhost:8080/users"
else
    echo "❌ Failed to start WireMock"
    exit 1
fi

echo "🎯 Ready to run Maestro tests with mocked network responses!"
echo ""
echo "To stop WireMock later, run:"
echo "  kill \$(cat wiremock/wiremock.pid)" 