#!/usr/bin/env node

/**
 * Empacy - Multi-Agent MCP Server
 * Main entry point for the MCP server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { EmpacyServer } from './core/server.js';
import { logger } from './utils/logger.js';

// Initialize the MCP server
const server = new Server(
  {
    name: 'empacy',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// Create Empacy server instance
const empacyServer = new EmpacyServer(server);

// Set up server transport
const transport = new StdioServerTransport();

// Start the server
server.connect(transport);

logger.info('Empacy MCP Server started successfully');

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  server.close();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
