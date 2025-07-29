#!/bin/bash

# Stop WireMock server

echo "🛑 Stopping WireMock server..."

if [ -f "wiremock/wiremock.pid" ]; then
    PID=$(cat wiremock/wiremock.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "✅ WireMock server stopped (PID: $PID)"
        rm wiremock/wiremock.pid
    else
        echo "⚠️  WireMock process not found (PID: $PID)"
        rm wiremock/wiremock.pid
    fi
else
    echo "⚠️  WireMock PID file not found"
    # Try to kill any java process running WireMock
    pkill -f "wiremock-jre8-standalone"
    echo "✅ Attempted to stop any running WireMock processes"
fi 