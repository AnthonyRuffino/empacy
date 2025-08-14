#!/usr/bin/env node

/**
 * Empacy - Multi-Agent MCP Server
 * Main entry point for the MCP server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { logger } from './utils/logger.js';

logger.info('Starting Empacy MCP Server...');

// Create MCP server with proper API
const server = new McpServer({ 
  name: "empacy", 
  version: "1.0.8" 
});

// Register tools
server.registerTool(
  "empacy.spawnAgent",
  {
    title: "Spawn Agent",
    description: "Spawn a new agent with specified role and context",
    inputSchema: {
      type: "object",
      properties: {
        role: { type: "string", minLength: 1 },
        context: {
          type: "object",
          properties: {
            projectId: { type: "string" },
            contextFiles: { 
              type: "array", 
              items: { type: "string" } 
            }
          },
          additionalProperties: false
        }
      },
      required: ["role"],
      additionalProperties: false
    }
  },
  async (args) => {
    logger.info(`Spawning agent with role: ${args.role}`);
    
    try {
      // For now, return a mock response
      // In the future, this would integrate with the actual agent manager
      const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return { 
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            success: true,
            agentId,
            role: args.role,
            status: 'spawned'
          }, null, 2)
        }] 
      };
    } catch (error) {
      logger.error('Failed to spawn agent:', error);
      return { 
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            success: false,
            error: error.message
          }, null, 2)
        }] 
      };
    }
  }
);

server.registerTool(
  "empacy.createProject",
  {
    title: "Create Project",
    description: "Create a new project with specified name, description, and domains",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
        description: { type: "string" },
        domains: { 
          type: "array", 
          items: { type: "string" } 
        }
      },
      required: ["name"],
      additionalProperties: false
    }
  },
  async (args) => {
    logger.info(`Creating project: ${args.name}`);
    
    try {
      // For now, return a mock response
      // In the future, this would integrate with the actual project manager
      const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return { 
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            success: true,
            projectId,
            name: args.name,
            status: 'created'
          }, null, 2)
        }] 
      };
    } catch (error) {
      logger.error('Failed to create project:', error);
      return { 
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            success: false,
            error: error.message
          }, null, 2)
        }] 
      };
    }
  }
);

server.registerTool(
  "empacy.updateUbiquitousLanguage",
  {
    title: "Update Ubiquitous Language",
    description: "Update ubiquitous language concepts",
    inputSchema: {
      type: "object",
      properties: {
        concepts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              shortName: { type: "string" },
              definition: { type: "string" },
              domain: { type: "string" }
            },
            required: ["name", "definition", "domain"],
            additionalProperties: false
          }
        }
      },
      required: ["concepts"],
      additionalProperties: false
    }
  },
  async (args) => {
    logger.info('Updating ubiquitous language');
    
    try {
      // For now, return a mock response
      return { 
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            success: true,
            conceptsCount: args.concepts.length,
            status: 'language_updated'
          }, null, 2)
        }] 
      };
    } catch (error) {
      logger.error('Failed to update ubiquitous language:', error);
      return { 
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            success: false,
            error: error.message
          }, null, 2)
        }] 
      };
    }
  }
);

// Set up stdio transport
const transport = new StdioServerTransport();

// Connect the server to the transport
await server.connect(transport);

logger.info('Empacy MCP Server started successfully');

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
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
