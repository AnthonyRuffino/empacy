import { EmpacyServer } from './core/server.js';
import { logger } from './utils/logger.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

/**
 * Start HTTP server for Empacy MCP server
 */
export async function startHttpServer(host = 'localhost', port = 3000) {
  try {
    logger.info(`Starting HTTP server on ${host}:${port}`);
    
    // For now, we'll use stdio transport since we haven't implemented HTTP transport yet
    // TODO: Implement proper HTTP transport
    logger.warn('HTTP transport not yet implemented, falling back to stdio');
    await startStdioServer();
    
  } catch (error) {
    logger.error('Failed to start HTTP server:', error);
    throw error;
  }
}

/**
 * Start stdio server for Empacy MCP server
 */
export async function startStdioServer() {
  try {
    logger.info('Starting stdio server...');
    
    // For now, just log that we're ready and keep the process alive
    // TODO: Implement proper MCP stdio transport
    logger.info('Empacy MCP server ready for stdio transport');
    logger.info('Note: MCP protocol implementation not yet complete');
    
    // Keep the process alive
    process.on('SIGINT', () => {
      logger.info('Shutting down Empacy MCP server...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      logger.info('Shutting down Empacy MCP server...');
      process.exit(0);
    });
    
    // Keep process alive
    setInterval(() => {
      // Heartbeat to keep process alive
    }, 60000);
    
  } catch (error) {
    logger.error('Failed to start stdio server:', error);
    throw error;
  }
}
