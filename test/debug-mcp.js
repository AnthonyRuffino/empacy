#!/usr/bin/env node

/**
 * Debug MCP Connection Script
 * This script tests the MCP connection step by step to identify issues
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== Debug MCP Connection ===\n');

// Start the Empacy server
console.log('1. Starting Empacy server...');
const empacyProcess = spawn('empacy', ['start', '--stdio'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let serverReady = false;

// Handle server output
empacyProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Server stdout:', output.trim());
  
  if (output.includes('ready for stdio transport')) {
    serverReady = true;
    console.log('✅ Server is ready!');
  }
});

empacyProcess.stderr.on('data', (data) => {
  const output = data.toString();
  console.log('Server stderr:', output.trim());
});

// Wait for server to be ready
setTimeout(() => {
  if (!serverReady) {
    console.log('❌ Server not ready after timeout');
    empacyProcess.kill();
    process.exit(1);
  }
  
  console.log('\n2. Sending initialize message...');
  
  // Send initialize message
  const initMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
      clientInfo: {
        name: 'debug-client',
        version: '1.0.0',
      },
    },
  };
  
  console.log('Sending:', JSON.stringify(initMessage, null, 2));
  empacyProcess.stdin.write(JSON.stringify(initMessage) + '\n');
  
  // Wait for response
  setTimeout(() => {
    console.log('\n3. Sending tools/list message...');
    
    const toolsMessage = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {},
    };
    
    console.log('Sending:', JSON.stringify(toolsMessage, null, 2));
    empacyProcess.stdin.write(JSON.stringify(toolsMessage) + '\n');
    
    // Wait for response and then close
    setTimeout(() => {
      console.log('\n4. Closing connection...');
      empacyProcess.stdin.end();
      
      setTimeout(() => {
        console.log('✅ Test completed successfully!');
        process.exit(0);
      }, 1000);
    }, 2000);
  }, 2000);
  
}, 3000);

// Handle process exit
empacyProcess.on('exit', (code) => {
  console.log(`\nServer process exited with code ${code}`);
});

// Handle errors
empacyProcess.on('error', (error) => {
  console.error('Server process error:', error);
  process.exit(1);
});

// Handle timeout
setTimeout(() => {
  console.log('\n❌ Test timed out');
  empacyProcess.kill();
  process.exit(1);
}, 15000);
