import { logger } from '../utils/logger.js';
import { AgentManager } from './agent-manager.js';
import { ContextManager } from './context-manager.js';
import { UbiquitousLanguageManager } from './ubiquitous-language-manager.js';

/**
 * EmpacyServer - Core MCP server implementation
 * Manages agent coordination, context distribution, and MCP protocol handling
 */
export class EmpacyServer {
  constructor(mcpServer) {
    this.mcpServer = mcpServer;
    this.agentManager = new AgentManager();
    this.contextManager = new ContextManager();
    this.ubiquitousLanguageManager = new UbiquitousLanguageManager();
    
    this.setupMCPHandlers();
    logger.info('EmpacyServer initialized');
  }

  /**
   * Set up MCP protocol handlers
   */
  setupMCPHandlers() {
    // Handle MCP server initialization
    this.mcpServer.onRequest('initialize', async (request) => {
      logger.info('MCP server initialization requested');
      return {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
        serverInfo: {
          name: 'empacy',
          version: '1.0.0',
          description: 'Multi-Agent MCP Server for collaborative development',
        },
      };
    });

    // Handle agent spawning requests
    this.mcpServer.onRequest('spawnAgent', async (request) => {
      const { role, context } = request.params;
      logger.info(`Spawning agent with role: ${role}`);
      
      try {
        const agent = await this.agentManager.spawnAgent(role, context);
        return { success: true, agentId: agent.id, status: 'spawned' };
      } catch (error) {
        logger.error('Failed to spawn agent:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle context distribution
    this.mcpServer.onRequest('distributeContext', async (request) => {
      const { agentId, contextFiles } = request.params;
      logger.info(`Distributing context to agent: ${agentId}`);
      
      try {
        await this.contextManager.distributeContext(agentId, contextFiles);
        return { success: true, status: 'context_distributed' };
      } catch (error) {
        logger.error('Failed to distribute context:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle ubiquitous language updates
    this.mcpServer.onRequest('updateUbiquitousLanguage', async (request) => {
      const { concepts } = request.params;
      logger.info('Updating ubiquitous language');
      
      try {
        await this.ubiquitousLanguageManager.updateConcepts(concepts);
        return { success: true, status: 'language_updated' };
      } catch (error) {
        logger.error('Failed to update ubiquitous language:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle agent status requests
    this.mcpServer.onRequest('getAgentStatus', async (request) => {
      const { agentId } = request.params;
      logger.info(`Getting status for agent: ${agentId}`);
      
      try {
        const status = await this.agentManager.getAgentStatus(agentId);
        return { success: true, status };
      } catch (error) {
        logger.error('Failed to get agent status:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle project creation
    this.mcpServer.onRequest('createProject', async (request) => {
      const { name, description, domains } = request.params;
      logger.info(`Creating project: ${name}`);
      
      try {
        const project = await this.createProject(name, description, domains);
        return { success: true, projectId: project.id, status: 'created' };
      } catch (error) {
        logger.error('Failed to create project:', error);
        return { success: false, error: error.message };
      }
    });

    logger.info('MCP handlers configured successfully');
  }

  /**
   * Create a new project with specified domains
   */
  async createProject(name, description, domains) {
    logger.info(`Creating project: ${name} with ${domains.length} domains`);
    
    const project = {
      id: this.generateProjectId(),
      name,
      description,
      domains,
      createdAt: new Date().toISOString(),
      status: 'initializing',
    };

    // Initialize project structure
    await this.initializeProjectStructure(project);
    
    // Spawn initial agents for the project
    await this.spawnProjectAgents(project);
    
    logger.info(`Project ${name} created successfully with ID: ${project.id}`);
    return project;
  }

  /**
   * Initialize project file structure
   */
  async initializeProjectStructure(project) {
    logger.info(`Initializing project structure for: ${project.name}`);
    
    // Create project directories
    const projectDir = `./projects/${project.id}`;
    await this.createProjectDirectories(projectDir, project.domains);
    
    // Initialize project files
    await this.initializeProjectFiles(projectDir, project);
    
    logger.info(`Project structure initialized for: ${project.name}`);
  }

  /**
   * Create project directory structure
   */
  async createProjectDirectories(projectDir, domains) {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Create main project directory
    await fs.mkdir(projectDir, { recursive: true });
    
    // Create domain directories
    for (const domain of domains) {
      const domainDir = path.join(projectDir, 'domains', domain);
      await fs.mkdir(domainDir, { recursive: true });
      
      // Create subdirectories for each domain
      await fs.mkdir(path.join(domainDir, 'phases'), { recursive: true });
      await fs.mkdir(path.join(domainDir, 'implementation'), { recursive: true });
      await fs.mkdir(path.join(domainDir, 'tests'), { recursive: true });
    }
    
    // Create shared directories
    await fs.mkdir(path.join(projectDir, 'shared'), { recursive: true });
    await fs.mkdir(path.join(projectDir, 'docs'), { recursive: true });
    await fs.mkdir(path.join(projectDir, 'ci-cd'), { recursive: true });
  }

  /**
   * Initialize project files
   */
  async initializeProjectFiles(projectDir, project) {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Create project configuration
    const projectConfig = {
      id: project.id,
      name: project.name,
      description: project.description,
      domains: project.domains,
      createdAt: project.createdAt,
      status: project.status,
    };
    
    await fs.writeFile(
      path.join(projectDir, 'project-config.json'),
      JSON.stringify(projectConfig, null, 2)
    );
    
    // Create README
    const readme = this.generateProjectReadme(project);
    await fs.writeFile(path.join(projectDir, 'README.md'), readme);
    
    // Create ubiquitous language file
    const ubiquitousLanguage = this.generateUbiquitousLanguage(project.domains);
    await fs.writeFile(
      path.join(projectDir, 'ubiquitous-language.yaml'),
      ubiquitousLanguage
    );
  }

  /**
   * Generate project README
   */
  generateProjectReadme(project) {
    return `# ${project.name}

## Project Overview

${project.description}

## Project Details

- **Project ID**: ${project.id}
- **Created**: ${project.createdAt}
- **Status**: ${project.status}
- **Domains**: ${project.domains.join(', ')}

## Domain Structure

${project.domains.map(domain => `### ${domain}
- Implementation phases
- Tests and validation
- Documentation`).join('\n\n')}

## Getting Started

This project was created using Empacy - Multi-Agent MCP Server.

## Development

See individual domain directories for implementation details and phase planning.
`;
  }

  /**
   * Generate ubiquitous language for project domains
   */
  generateUbiquitousLanguage(domains) {
    let yaml = 'domains:\n';
    
    for (const domain of domains) {
      const shortName = domain.replace(/\s+/g, '').toUpperCase();
      yaml += `  - name: "${domain}"\n`;
      yaml += `    short-name: "${shortName}"\n`;
      yaml += `    definition: "Domain for ${domain.toLowerCase()} functionality"\n`;
      yaml += `    concepts: []\n`;
      yaml += `    acronyms: []\n\n`;
    }
    
    return yaml;
  }

  /**
   * Spawn initial agents for the project
   */
  async spawnProjectAgents(project) {
    logger.info(`Spawning initial agents for project: ${project.name}`);
    
    // Spawn CTO-Assistant
    const ctoAssistant = await this.agentManager.spawnAgent('cto-assistant', {
      projectId: project.id,
      role: 'cto-assistant',
      context: ['ubiquitous-language.yaml', 'project-config.json'],
    });
    
    // Spawn Principal Engineer
    const principalEngineer = await this.agentManager.spawnAgent('principal-engineer', {
      projectId: project.id,
      role: 'principal-engineer',
      context: ['project-config.json', 'domain-design.md'],
    });
    
    logger.info(`Initial agents spawned for project: ${project.name}`);
    return { ctoAssistant, principalEngineer };
  }

  /**
   * Generate unique project ID
   */
  generateProjectId() {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
