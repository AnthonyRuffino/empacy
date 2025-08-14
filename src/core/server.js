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

    // Handle file operations for agents
    this.mcpServer.onRequest('writeFile', async (request) => {
      const { path, content, encoding = 'utf8' } = request.params;
      logger.info(`Writing file: ${path}`);
      
      try {
        const fs = await import('fs/promises');
        await fs.writeFile(path, content, { encoding });
        return { success: true, status: 'file_written' };
      } catch (error) {
        logger.error('Failed to write file:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle PlantUML diagram generation
    this.mcpServer.onRequest('generatePlantUML', async (request) => {
      const { type, content, outputPath } = request.params;
      logger.info(`Generating PlantUML diagram: ${type}`);
      
      try {
        const diagram = await this.generatePlantUMLDiagram(type, content, outputPath);
        return { success: true, diagramPath: diagram.path, status: 'diagram_generated' };
      } catch (error) {
        logger.error('Failed to generate PlantUML diagram:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle domain phase planning
    this.mcpServer.onRequest('createDomainPhase', async (request) => {
      const { domain, phaseName, tasks, context } = request.params;
      logger.info(`Creating phase for domain: ${domain} - ${phaseName}`);
      
      try {
        const phase = await this.createDomainPhase(domain, phaseName, tasks, context);
        return { success: true, phaseId: phase.id, status: 'phase_created' };
      } catch (error) {
        logger.error('Failed to create domain phase:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle project scheduling
    this.mcpServer.onRequest('scheduleProject', async (request) => {
      const { projectId, phases, dependencies } = request.params;
      logger.info(`Scheduling project: ${projectId}`);
      
      try {
        const schedule = await this.scheduleProject(projectId, phases, dependencies);
        return { success: true, scheduleId: schedule.id, status: 'project_scheduled' };
      } catch (error) {
        logger.error('Failed to schedule project:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle work assignment
    this.mcpServer.onRequest('assignWork', async (request) => {
      const { agentId, taskId, context } = request.params;
      logger.info(`Assigning work to agent: ${agentId}`);
      
      try {
        const assignment = await this.assignWork(agentId, taskId, context);
        return { success: true, assignmentId: assignment.id, status: 'work_assigned' };
      } catch (error) {
        logger.error('Failed to assign work:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle file reading
    this.mcpServer.onRequest('readFile', async (request) => {
      const { path, encoding = 'utf8' } = request.params;
      logger.info(`Reading file: ${path}`);
      
      try {
        const fs = await import('fs/promises');
        const content = await fs.readFile(path, { encoding });
        return { success: true, content, status: 'file_read' };
      } catch (error) {
        logger.error('Failed to read file:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle project state queries
    this.mcpServer.onRequest('getProjectState', async (request) => {
      const { projectId } = request.params;
      logger.info(`Getting project state: ${projectId}`);
      
      try {
        const state = await this.getProjectState(projectId);
        return { success: true, state, status: 'project_state_retrieved' };
      } catch (error) {
        logger.error('Failed to get project state:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle domain completion notification
    this.mcpServer.onRequest('markDomainComplete', async (request) => {
      const { domain, projectId, completionData } = request.params;
      logger.info(`Marking domain complete: ${domain} in project: ${projectId}`);
      
      try {
        const result = await this.markDomainComplete(domain, projectId, completionData);
        return { success: true, status: 'domain_completed', data: result };
      } catch (error) {
        logger.error('Failed to mark domain complete:', error);
        return { success: false, error: error.message };
      }
    });

    // Handle release creation
    this.mcpServer.onRequest('createRelease', async (request) => {
      const { projectId, version, description, artifacts } = request.params;
      logger.info(`Creating release: ${version} for project: ${projectId}`);
      
      try {
        const release = await this.createRelease(projectId, version, description, artifacts);
        return { success: true, releaseId: release.id, status: 'release_created' };
      } catch (error) {
        logger.error('Failed to create release:', error);
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
      context: ['ubiquitous-language.yaml', 'project-config.json', 'domain-design.md'],
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

  /**
   * Generate PlantUML diagram
   */
  async generatePlantUMLDiagram(type, content, outputPath) {
    logger.info(`Generating PlantUML diagram of type: ${type}`);
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Create PlantUML content
    let plantUMLContent = `@startuml ${type}\n`;
    plantUMLContent += `!theme plain\n\n`;
    plantUMLContent += content;
    plantUMLContent += `\n@enduml`;
    
    // Write the PlantUML file
    await fs.writeFile(outputPath, plantUMLContent, 'utf8');
    
    logger.info(`PlantUML diagram generated: ${outputPath}`);
    return { path: outputPath, type, content: plantUMLContent };
  }

  /**
   * Create domain phase with detailed planning
   */
  async createDomainPhase(domain, phaseName, tasks, context) {
    logger.info(`Creating phase ${phaseName} for domain: ${domain}`);
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const phase = {
      id: `phase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      domain,
      name: phaseName,
      tasks,
      context,
      createdAt: new Date().toISOString(),
      status: 'planned',
    };
    
    // Create phase directory and files
    const phaseDir = `./projects/current/domains/${domain}/phases/${phaseName}`;
    await fs.mkdir(phaseDir, { recursive: true });
    
    // Write phase plan
    const phasePlan = this.generatePhasePlan(phase);
    await fs.writeFile(path.join(phaseDir, 'phase-plan.md'), phasePlan);
    
    // Write context digest
    const contextDigest = this.generateContextDigest(context);
    await fs.writeFile(path.join(phaseDir, 'context-digest.md'), contextDigest);
    
    logger.info(`Phase ${phaseName} created for domain: ${domain}`);
    return phase;
  }

  /**
   * Generate phase plan markdown
   */
  generatePhasePlan(phase) {
    return `# Phase: ${phase.name}

## Domain: ${phase.domain}

## Tasks

${phase.tasks.map((task, index) => `${index + 1}. **${task.title}**
   - Description: ${task.description}
   - Estimated effort: ${task.estimatedEffort}
   - Dependencies: ${task.dependencies.join(', ') || 'None'}
   - Acceptance criteria: ${task.acceptanceCriteria}`).join('\n\n')}

## Context

This phase requires the following context:
${phase.context.map(ctx => `- ${ctx}`).join('\n')}

## Status

- **Created**: ${phase.createdAt}
- **Current Status**: ${phase.status}
- **Phase ID**: ${phase.id}

## Notes

Add implementation notes and progress updates here.
`;
  }

  /**
   * Generate context digest for phase
   */
  generateContextDigest(context) {
    return `# Context Digest

## Required Context for Phase Implementation

${context.map(ctx => `### ${ctx.title || 'Context Item'}
${ctx.description || ctx}

${ctx.details ? `**Details:**
${ctx.details}` : ''}

${ctx.references ? `**References:**
${ctx.references.map(ref => `- ${ref}`).join('\n')}` : ''}`).join('\n\n')}

## Context Summary

This digest contains all the context information needed to implement the phase successfully. 
Refer to the original source files for the most up-to-date information.

## Last Updated

${new Date().toISOString()}
`;
  }

  /**
   * Schedule project with phases and dependencies
   */
  async scheduleProject(projectId, phases, dependencies) {
    logger.info(`Scheduling project: ${projectId}`);
    
    const schedule = {
      id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      phases,
      dependencies,
      createdAt: new Date().toISOString(),
      status: 'scheduled',
    };
    
    // Create project schedule file
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const scheduleDir = `./projects/current`;
    await fs.mkdir(scheduleDir, { recursive: true });
    
    const scheduleContent = this.generateProjectSchedule(schedule);
    await fs.writeFile(path.join(scheduleDir, 'project-schedule.md'), scheduleContent);
    
    logger.info(`Project scheduled: ${projectId}`);
    return schedule;
  }

  /**
   * Generate project schedule markdown
   */
  generateProjectSchedule(schedule) {
    return `# Project Schedule

## Project ID: ${schedule.projectId}

## Phases

${schedule.phases.map((phase, index) => `${index + 1}. **${phase.name}** (${phase.domain})
   - Duration: ${phase.duration}
   - Start: ${phase.startDate}
   - End: ${phase.endDate}
   - Dependencies: ${phase.dependencies.join(', ') || 'None'}`).join('\n\n')}

## Dependencies

${schedule.dependencies.map(dep => `- **${dep.from}** → **${dep.to}**
   - Type: ${dep.type}
   - Critical: ${dep.critical ? 'Yes' : 'No'}`).join('\n\n')}

## Timeline

${this.generateTimeline(schedule.phases)}

## Status

- **Created**: ${schedule.createdAt}
- **Current Status**: ${schedule.status}
- **Schedule ID**: ${schedule.id}

## Notes

Add scheduling notes and updates here.
`;
  }

  /**
   * Generate timeline visualization
   */
  generateTimeline(phases) {
    const timeline = phases.map(phase => {
      const start = new Date(phase.startDate);
      const end = new Date(phase.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      return `${phase.name}: ${'█'.repeat(Math.min(duration, 20))} (${duration} days)`;
    });
    
    return timeline.join('\n');
  }

  /**
   * Assign work to an agent
   */
  async assignWork(agentId, taskId, context) {
    logger.info(`Assigning work to agent: ${agentId}`);
    
    const assignment = {
      id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      taskId,
      context,
      assignedAt: new Date().toISOString(),
      status: 'assigned',
    };
    
    // Create assignment file
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const assignmentDir = `./projects/current/assignments`;
    await fs.mkdir(assignmentDir, { recursive: true });
    
    const assignmentContent = this.generateWorkAssignment(assignment);
    await fs.writeFile(path.join(assignmentDir, `${assignment.id}.md`), assignmentContent);
    
    logger.info(`Work assigned to agent: ${agentId}`);
    return assignment;
  }

  /**
   * Generate work assignment markdown
   */
  generateWorkAssignment(assignment) {
    return `# Work Assignment

## Assignment ID: ${assignment.id}

## Assigned To

- **Agent ID**: ${assignment.agentId}
- **Task ID**: ${assignment.taskId}
- **Assigned**: ${assignment.assignedAt}

## Context

${assignment.context.map(ctx => `- ${ctx}`).join('\n')}

## Status

- **Current Status**: ${assignment.status}
- **Progress**: 0%

## Notes

Add progress notes and updates here.

## Completion Criteria

[To be defined based on task requirements]
`;
  }
}


  /**
   * Get project state and status
   */
  async getProjectState(projectId) {
    logger.info(`Getting project state: ${projectId}`);
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    try {
      // Try to read project config
      const projectConfigPath = `./projects/${projectId}/project-config.json`;
      const projectConfig = JSON.parse(await fs.readFile(projectConfigPath, 'utf8'));
      
      // Get domain statuses
      const domains = [];
      for (const domain of projectConfig.domains) {
        const domainDir = `./projects/${projectId}/domains/${domain}`;
        try {
          const domainFiles = await fs.readdir(domainDir);
          const hasPhases = domainFiles.includes('phases');
          const hasImplementation = domainFiles.includes('implementation');
          
          domains.push({
            name: domain,
            hasPhases: hasPhases,
            hasImplementation: hasImplementation,
            status: hasImplementation ? 'implemented' : hasPhases ? 'planned' : 'pending'
          });
        } catch (error) {
          domains.push({
            name: domain,
            hasPhases: false,
            hasImplementation: false,
            status: 'pending'
          });
        }
      }
      
      // Check for project schedule
      let schedule = null;
      try {
        const schedulePath = `./projects/${projectId}/project-schedule.md`;
        const scheduleContent = await fs.readFile(schedulePath, 'utf8');
        schedule = { exists: true, path: schedulePath };
      } catch (error) {
        schedule = { exists: false };
      }
      
      return {
        projectId,
        config: projectConfig,
        domains,
        schedule,
        overallStatus: this.calculateOverallStatus(domains),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Failed to get project state: ${error.message}`);
      throw new Error(`Project not found or invalid: ${projectId}`);
    }
  }

  /**
   * Calculate overall project status
   */
  calculateOverallStatus(domains) {
    if (domains.length === 0) return 'pending';
    
    const statuses = domains.map(d => d.status);
    if (statuses.every(s => s === 'implemented')) return 'completed';
    if (statuses.some(s => s === 'implemented')) return 'in-progress';
    if (statuses.every(s => s === 'planned')) return 'planned';
    return 'pending';
  }

  /**
   * Mark domain as complete
   */
  async markDomainComplete(domain, projectId, completionData) {
    logger.info(`Marking domain complete: ${domain} in project: ${projectId}`);
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Create completion report
    const completionReport = {
      domain,
      projectId,
      completedAt: new Date().toISOString(),
      completionData,
      artifacts: completionData.artifacts || [],
      notes: completionData.notes || '',
      qualityMetrics: completionData.qualityMetrics || {}
    };
    
    // Write completion report
    const reportPath = `./projects/${projectId}/domains/${domain}/completion-report.md`;
    const reportContent = this.generateCompletionReport(completionReport);
    await fs.writeFile(reportPath, reportContent, 'utf8');
    
    // Update domain status
    const statusPath = `./projects/${projectId}/domains/${domain}/status.json`;
    const status = {
      domain,
      projectId,
      status: 'completed',
      completedAt: completionReport.completedAt,
      lastUpdated: new Date().toISOString()
    };
    await fs.writeFile(statusPath, JSON.stringify(status, null, 2));
    
    logger.info(`Domain ${domain} marked complete in project: ${projectId}`);
    return completionReport;
  }

  /**
   * Generate completion report
   */
  generateCompletionReport(report) {
    return `# Domain Completion Report

## Domain: ${report.domain}

## Project ID: ${report.projectId}

## Completion Details

- **Completed At**: ${report.completedAt}
- **Status**: Completed

## Artifacts Delivered

${report.artifacts.map(artifact => `- **${artifact.name}**
  - Type: ${artifact.type}
  - Path: ${artifact.path}
  - Description: ${artifact.description}`).join('\n\n')}

## Quality Metrics

${Object.entries(report.qualityMetrics).map(([metric, value]) => `- **${metric}**: ${value}`).join('\n')}

## Notes

${report.notes}

## Next Steps

This domain has been completed successfully. The Project Manager should review the artifacts and proceed with the next phase or project completion.
`;
  }

  /**
   * Create project release
   */
  async createRelease(projectId, version, description, artifacts) {
    logger.info(`Creating release: ${version} for project: ${projectId}`);
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const release = {
      id: `release_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      version,
      description,
      artifacts,
      createdAt: new Date().toISOString(),
      status: 'created'
    };
    
    // Create release directory
    const releaseDir = `./projects/${projectId}/releases/${version}`;
    await fs.mkdir(releaseDir, { recursive: true });
    
    // Write release notes
    const releaseNotes = this.generateReleaseNotes(release);
    await fs.writeFile(path.join(releaseDir, 'release-notes.md'), releaseNotes);
    
    // Write release manifest
    const manifest = this.generateReleaseManifest(release);
    await fs.writeFile(path.join(releaseDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    
    logger.info(`Release ${version} created for project: ${projectId}`);
    return release;
  }

  /**
   * Generate release notes
   */
  generateReleaseNotes(release) {
    return `# Release Notes - ${release.version}

## Project ID: ${release.projectId}

## Release Information

- **Version**: ${release.version}
- **Created**: ${release.createdAt}
- **Status**: ${release.status}

## Description

${release.description}

## Artifacts Included

${release.artifacts.map(artifact => `- **${artifact.name}**
  - Type: ${artifact.type}
  - Path: ${artifact.path}
  - Version: ${artifact.version || 'N/A'}`).join('\n\n')}

## Changes in This Release

[To be filled in by development team]

## Known Issues

[To be filled in by QA team]

## Installation Instructions

[To be filled in by DevOps team]

## Rollback Plan

[To be filled in by DevOps team]
`;
  }

  /**
   * Generate release manifest
   */
  generateReleaseManifest(release) {
    return {
      releaseId: release.id,
      projectId: release.projectId,
      version: release.version,
      description: release.description,
      createdAt: release.createdAt,
      status: release.status,
      artifacts: release.artifacts.map(artifact => ({
        name: artifact.name,
        type: artifact.type,
        path: artifact.path,
        version: artifact.version,
        checksum: artifact.checksum || null
      })),
      metadata: {
        generatedBy: 'Empacy MCP Server',
        generatorVersion: '1.0.0',
        timestamp: new Date().toISOString()
      }
    };
  }
}
