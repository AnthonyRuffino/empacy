/**
 * Project CLI - Command-line interface for project management
 * Provides project creation and management functionality
 */

import { logger } from './utils/logger.js';
import { EmpacyServer } from './core/server.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

/**
 * Create a new project
 */
export async function createProject(name, description, domains) {
  try {
    logger.info(`Creating project: ${name}`);
    
    // Create a temporary MCP server instance for CLI operations
    const mcpServer = new Server(
      {
        name: 'empacy-cli',
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
    
    const empacyServer = new EmpacyServer(mcpServer);
    
    // Create the project
    const project = await empacyServer.createProject(name, description, domains);
    
    logger.info(`Project ${name} created successfully with ID: ${project.id}`);
    return project;
  } catch (error) {
    logger.error(`Failed to create project ${name}:`, error);
    throw error;
  }
}

/**
 * List all projects
 */
export async function listProjects() {
  try {
    logger.info('Listing projects...');
    
    // For now, return a placeholder since we don't have persistent storage
    // In a real implementation, this would read from a database or file system
    return [
      {
        id: 'project_placeholder',
        name: 'No projects found',
        status: 'placeholder',
        createdAt: new Date().toISOString(),
      }
    ];
  } catch (error) {
    logger.error('Failed to list projects:', error);
    throw error;
  }
}

/**
 * Get project details
 */
export async function getProject(projectId) {
  try {
    logger.info(`Getting project: ${projectId}`);
    
    // For now, return a placeholder
    // In a real implementation, this would read from storage
    return {
      id: projectId,
      name: 'Project not found',
      status: 'not_found',
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`Failed to get project ${projectId}:`, error);
    throw error;
  }
}
