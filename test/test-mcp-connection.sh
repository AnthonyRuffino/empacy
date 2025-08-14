#!/bin/bash

# Test MCP Connection Script for Empacy
# This script helps test different MCP connection configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration directory
CONFIG_DIR="mcp-test-configs"

echo -e "${BLUE}=== Empacy MCP Connection Test Suite ===${NC}\n"

# Function to test a configuration
test_config() {
    local config_file=$1
    local config_name=$(basename "$config_file" .json)
    
    echo -e "${YELLOW}Testing configuration: ${config_name}${NC}"
    echo -e "Config file: ${config_file}"
    
    if [ ! -f "$config_file" ]; then
        echo -e "${RED}❌ Config file not found: ${config_file}${NC}\n"
        return 1
    fi
    
    echo -e "Configuration:"
    cat "$config_file" | sed 's/^/  /'
    echo
    
    echo -e "${BLUE}Attempting MCP connection...${NC}"
    
    # Test the connection with timeout
    timeout 30s npx @wong2/mcp-cli -c "$config_file" <<< "empacy" || {
        echo -e "${RED}❌ Connection failed or timed out${NC}\n"
        return 1
    }
    
    echo -e "${GREEN}✅ Connection successful!${NC}\n"
    return 0
}

# Function to test stdio server directly
test_stdio_server() {
    echo -e "${YELLOW}Testing stdio server directly...${NC}"
    
    # Start the server in background
    echo -e "${BLUE}Starting empacy start --stdio in background...${NC}"
    empacy start --stdio &
    local server_pid=$!
    
    # Wait a moment for server to start
    sleep 2
    
    # Test with a simple echo
    echo -e "${BLUE}Testing server response...${NC}"
    echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize"}' | timeout 10s empacy start --stdio || {
        echo -e "${RED}❌ Direct stdio test failed${NC}"
        kill $server_pid 2>/dev/null || true
        return 1
    }
    
    # Clean up
    kill $server_pid 2>/dev/null || true
    echo -e "${GREEN}✅ Direct stdio test successful${NC}\n"
}

# Function to test CLI commands
test_cli_commands() {
    echo -e "${YELLOW}Testing CLI commands...${NC}"
    
    echo -e "${BLUE}Testing agent spawn...${NC}"
    empacy agent spawn cto || {
        echo -e "${RED}❌ Agent spawn failed${NC}"
        return 1
    }
    
    echo -e "${BLUE}Testing project create...${NC}"
    empacy project create "Test Project" --description "A test project" --domains "frontend,backend" || {
        echo -e "${RED}❌ Project create failed${NC}"
        return 1
    }
    
    echo -e "${BLUE}Testing language add...${NC}"
    empacy language add "Test Concept" "frontend" "A test concept for testing" || {
        echo -e "${RED}❌ Language add failed${NC}"
        return 1
    }
    
    echo -e "${GREEN}✅ CLI commands test successful${NC}\n"
}

# Main test execution
main() {
    echo -e "${BLUE}Starting MCP connection tests...${NC}\n"
    
    # Test CLI commands first
    test_cli_commands
    
    # Test stdio server directly
    test_stdio_server
    
    # Test each configuration file
    local success_count=0
    local total_count=0
    
    for config_file in "$CONFIG_DIR"/*.json; do
        if [ -f "$config_file" ]; then
            total_count=$((total_count + 1))
            if test_config "$config_file"; then
                success_count=$((success_count + 1))
            fi
        fi
    done
    
    echo -e "${BLUE}=== Test Results ===${NC}"
    echo -e "Successful connections: ${GREEN}${success_count}${NC}/${total_count}"
    
    if [ $success_count -eq $total_count ]; then
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        exit 0
    else
        echo -e "${RED}❌ Some tests failed${NC}"
        exit 1
    fi
}

# Check if required tools are available
check_dependencies() {
    local missing_deps=()
    
    if ! command -v npx &> /dev/null; then
        missing_deps+=("npx")
    fi
    
    if ! command -v empacy &> /dev/null; then
        missing_deps+=("empacy")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing dependencies: ${missing_deps[*]}${NC}"
        echo -e "Please install missing dependencies and try again."
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies available${NC}\n"
}

# Run dependency check and main tests
check_dependencies
main
