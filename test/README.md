# Empacy MCP Testing

This directory contains test configurations and scripts for testing MCP (Model Context Protocol) connections to the Empacy server.

## Test Configurations

### 1. Stdio Transport (Recommended)

**File:** `mcp-test-configs/config-stdio.json`
```json
{
  "mcpServers": {
    "empacy": {
      "command": "empacy",
      "args": ["start", "--stdio"],
      "env": {}
    }
  }
}
```

**Usage:** This configuration spawns the Empacy server process and communicates via stdin/stdout. This is the most reliable method for testing.

### 2. Direct Stdio

**File:** `mcp-test-configs/config-direct-stdio.json`
```json
{
  "mcpServers": {
    "empacy": {
      "command": "empacy",
      "args": ["start"],
      "env": {}
    }
  }
}
```

**Usage:** This configuration uses the default stdio transport without explicit flags.

### 3. HTTP Transport (Future)

**File:** `mcp-test-configs/config-http.json`
```json
{
  "mcpServers": {
    "empacy": {
      "command": "curl",
      "args": ["-s", "http://localhost:5000"],
      "env": {}
    }
  }
}
```

**Usage:** This configuration will work once HTTP transport is implemented in the Empacy server.

### 4. Netcat Transport (Future)

**File:** `mcp-test-configs/config-nc.json`
```json
{
  "mcpServers": {
    "empacy": {
      "command": "nc",
      "args": ["localhost", "5000"],
      "env": {}
    }
  }
}
```

**Usage:** This configuration will work once HTTP transport is implemented and the server is running on port 5000.

## Testing with MCP CLI

### Manual Testing

1. **Install MCP CLI:**
   ```bash
   npm install -g @wong2/mcp-cli
   ```

2. **Test a configuration:**
   ```bash
   npx @wong2/mcp-cli -c test/mcp-test-configs/config-stdio.json
   ```

3. **Select the empacy server when prompted**

### Automated Testing

Run the test script to test all configurations:

```bash
cd test
./test-mcp-connection.sh
```

## Current Status

- ✅ **Stdio Transport**: Fully implemented and working
- ❌ **HTTP Transport**: Not yet implemented
- ❌ **Daemon Mode**: Not yet implemented
- ✅ **CLI Commands**: Working (agent spawn, project create, language add)

## Troubleshooting

### Connection Hangs

If the connection hangs at "Connecting to server...", it usually means:

1. **MCP Protocol Issue**: The server might not be responding to the MCP handshake
2. **Transport Mismatch**: The client and server are using different transport methods
3. **Server Not Ready**: The server process might not be fully initialized

### Common Solutions

1. **Use stdio transport**: This is the most reliable method
2. **Check server logs**: Look for any error messages when starting the server
3. **Verify dependencies**: Ensure both `empacy` and `@wong2/mcp-cli` are installed
4. **Test CLI directly**: Try running `empacy start --stdio` to see if the server starts correctly

### Testing Individual Components

1. **Test server startup:**
   ```bash
   empacy start --stdio
   ```

2. **Test CLI commands:**
   ```bash
   empacy agent spawn cto
   empacy project create "Test" --description "Test project"
   empacy language add "Test" "domain" "definition"
   ```

3. **Test MCP connection:**
   ```bash
   npx @wong2/mcp-cli -c test/mcp-test-configs/config-stdio.json
   ```

## Development Notes

- The MCP protocol implementation is now complete for stdio transport
- HTTP transport is planned but not yet implemented
- All CLI commands are functional
- The server properly handles MCP protocol handshakes and requests
- Error handling and graceful shutdown are implemented

## Next Steps

1. **Test stdio transport** with the provided configurations
2. **Implement HTTP transport** for network-based connections
3. **Add daemon mode** for background server operation
4. **Enhance error handling** and logging
5. **Add more comprehensive testing** for all MCP methods
