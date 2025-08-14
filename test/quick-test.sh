#!/bin/bash

# Quick Test Script for Empacy
# Tests basic functionality without full MCP connection

set -e

echo "=== Quick Empacy Test ==="

# Test 1: Check if empacy command works
echo "1. Testing empacy command..."
if command -v empacy &> /dev/null; then
    echo "✅ empacy command found"
    empacy --version
else
    echo "❌ empacy command not found"
    exit 1
fi

# Test 2: Test agent spawn
echo -e "\n2. Testing agent spawn..."
empacy agent spawn cto
echo "✅ Agent spawn successful"

# Test 3: Test project create
echo -e "\n3. Testing project create..."
empacy project create "Quick Test Project" --description "A quick test project" --domains "test"
echo "✅ Project create successful"

# Test 4: Test language add
echo -e "\n4. Testing language add..."
empacy language add "Quick Test Concept" "A quick test concept for testing"
echo "✅ Language add successful"

# Test 5: Test stdio server startup
echo -e "\n5. Testing stdio server startup..."
timeout 5s empacy start --stdio &
SERVER_PID=$!
sleep 2

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Stdio server started successfully"
    kill $SERVER_PID 2>/dev/null || true
else
    echo "❌ Stdio server failed to start"
    exit 1
fi

echo -e "\n🎉 All quick tests passed!"
