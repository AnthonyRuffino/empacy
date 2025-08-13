import { logger } from '../utils/logger.js';

/**
 * AgentManager - Manages agent lifecycle and coordination
 * Handles agent spawning, status tracking, and communication
 */
export class AgentManager {
  constructor() {
    this.agents = new Map();
    this.agentTypes = new Map();
    this.nextAgentId = 1;
    
    this.registerAgentTypes();
    logger.info('AgentManager initialized');
  }

  /**
   * Register available agent types
   */
  registerAgentTypes() {
    this.agentTypes.set('cto', {
      name: 'CTO',
      description: 'Strategic decision maker and orchestrator',
      capabilities: ['vision', 'strategy', 'coordination'],
      requiredContext: ['ubiquitous-language.yaml', 'vision.md'],
    });

    this.agentTypes.set('cto-assistant', {
      name: 'CTO-Assistant',
      description: 'Content refinement and ubiquitous language management',
      capabilities: ['summarization', 'language-management', 'content-quality'],
      requiredContext: ['ubiquitous-language.yaml'],
    });

    this.agentTypes.set('principal-engineer', {
      name: 'Principal Engineer',
      description: 'Technical architecture and infrastructure',
      capabilities: ['architecture', 'infrastructure', 'quality-tools'],
      requiredContext: ['project-config.json', 'domain-design.md'],
    });

    this.agentTypes.set('domain-director', {
      name: 'Domain Director',
      description: 'Domain-specific planning and task breakdown',
      capabilities: ['planning', 'task-breakdown', 'context-digest'],
      requiredContext: ['project-config.json', 'ubiquitous-language.yaml'],
    });

    this.agentTypes.set('project-manager', {
      name: 'Project Manager',
      description: 'Task scheduling and dependency management',
      capabilities: ['scheduling', 'dependency-management', 'conflict-resolution'],
      requiredContext: ['project-config.json', 'domain-phases'],
    });

    logger.info(`Registered ${this.agentTypes.size} agent types`);
  }

  /**
   * Spawn a new agent with specified role and context
   */
  async spawnAgent(role, context = {}) {
    logger.info(`Spawning agent with role: ${role}`);
    
    // Validate agent type
    if (!this.agentTypes.has(role)) {
      throw new Error(`Unknown agent type: ${role}`);
    }

    const agentType = this.agentTypes.get(role);
    const agentId = this.generateAgentId();
    
    // Create agent instance
    const agent = {
      id: agentId,
      role,
      type: agentType,
      context,
      status: 'initializing',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      capabilities: agentType.capabilities,
      metadata: {},
    };

    // Validate required context
    await this.validateAgentContext(agent, agentType.requiredContext);
    
    // Initialize agent
    await this.initializeAgent(agent);
    
    // Store agent
    this.agents.set(agentId, agent);
    
    logger.info(`Agent spawned successfully: ${role} (ID: ${agentId})`);
    return agent;
  }

  /**
   * Generate unique agent ID
   */
  generateAgentId() {
    return `agent_${this.nextAgentId++}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate agent context requirements
   */
  async validateAgentContext(agent, requiredContext) {
    logger.info(`Validating context for agent: ${agent.id}`);
    
    const missingContext = [];
    
    for (const contextFile of requiredContext) {
      if (!agent.context[contextFile] && !agent.context[contextFile.replace('.yaml', '')]) {
        missingContext.push(contextFile);
      }
    }
    
    if (missingContext.length > 0) {
      logger.warn(`Agent ${agent.id} missing required context: ${missingContext.join(', ')}`);
      // For now, we'll allow agents to spawn with missing context
      // In production, this would be more strict
    }
    
    logger.info(`Context validation complete for agent: ${agent.id}`);
  }

  /**
   * Initialize agent with role-specific setup
   */
  async initializeAgent(agent) {
    logger.info(`Initializing agent: ${agent.id} with role: ${agent.role}`);
    
    try {
      // Role-specific initialization
      switch (agent.role) {
        case 'cto':
          await this.initializeCTO(agent);
          break;
        case 'cto-assistant':
          await this.initializeCTOAssistant(agent);
          break;
        case 'principal-engineer':
          await this.initializePrincipalEngineer(agent);
          break;
        case 'domain-director':
          await this.initializeDomainDirector(agent);
          break;
        case 'project-manager':
          await this.initializeProjectManager(agent);
          break;
        default:
          logger.warn(`No specific initialization for role: ${agent.role}`);
      }
      
      agent.status = 'ready';
      agent.lastActivity = new Date().toISOString();
      
      logger.info(`Agent ${agent.id} initialized successfully`);
    } catch (error) {
      logger.error(`Failed to initialize agent ${agent.id}:`, error);
      agent.status = 'error';
      agent.metadata.error = error.message;
      throw error;
    }
  }

  /**
   * Initialize CTO agent
   */
  async initializeCTO(agent) {
    logger.info(`Initializing CTO agent: ${agent.id}`);
    
    agent.metadata.role = 'strategic';
    agent.metadata.decisionAuthority = 'full';
    agent.metadata.reportingStructure = 'top-level';
    
    // CTO has access to all project information
    agent.metadata.accessLevel = 'full';
    agent.metadata.canSpawnAgents = true;
    agent.metadata.canDistributeContext = true;
  }

  /**
   * Initialize CTO-Assistant agent
   */
  async initializeCTOAssistant(agent) {
    logger.info(`Initializing CTO-Assistant agent: ${agent.id}`);
    
    agent.metadata.role = 'support';
    agent.metadata.decisionAuthority = 'limited';
    agent.metadata.reportingStructure = 'reports-to-cto';
    
    // CTO-Assistant focuses on content and language management
    agent.metadata.accessLevel = 'content-focused';
    agent.metadata.canSpawnAgents = false;
    agent.metadata.canDistributeContext = false;
    agent.metadata.canUpdateUbiquitousLanguage = true;
  }

  /**
   * Initialize Principal Engineer agent
   */
  async initializePrincipalEngineer(agent) {
    logger.info(`Initializing Principal Engineer agent: ${agent.id}`);
    
    agent.metadata.role = 'technical';
    agent.metadata.decisionAuthority = 'technical-decisions';
    agent.metadata.reportingStructure = 'reports-to-cto';
    
    // Principal Engineer has technical authority
    agent.metadata.accessLevel = 'technical-full';
    agent.metadata.canSpawnAgents = false;
    agent.metadata.canDistributeContext = false;
    agent.metadata.canMakeTechnicalDecisions = true;
  }

  /**
   * Initialize Domain Director agent
   */
  async initializeDomainDirector(agent) {
    logger.info(`Initializing Domain Director agent: ${agent.id}`);
    
    agent.metadata.role = 'planning';
    agent.metadata.decisionAuthority = 'domain-planning';
    agent.metadata.reportingStructure = 'reports-to-cto';
    
    // Domain Director has domain-specific authority
    agent.metadata.accessLevel = 'domain-specific';
    agent.metadata.canSpawnAgents = false;
    agent.metadata.canDistributeContext = false;
    agent.metadata.canPlanDomainImplementation = true;
  }

  /**
   * Initialize Project Manager agent
   */
  async initializeProjectManager(agent) {
    logger.info(`Initializing Project Manager agent: ${agent.id}`);
    
    agent.metadata.role = 'coordination';
    agent.metadata.decisionAuthority = 'scheduling-decisions';
    agent.metadata.reportingStructure = 'reports-to-cto';
    
    // Project Manager has scheduling authority
    agent.metadata.accessLevel = 'scheduling-full';
    agent.metadata.canSpawnAgents = false;
    agent.metadata.canDistributeContext = false;
    agent.metadata.canManageSchedule = true;
  }

  /**
   * Get agent status
   */
  async getAgentStatus(agentId) {
    const agent = this.agents.get(agentId);
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    
    return {
      id: agent.id,
      role: agent.role,
      status: agent.status,
      lastActivity: agent.lastActivity,
      capabilities: agent.capabilities,
      metadata: agent.metadata,
    };
  }

  /**
   * Get all agents
   */
  getAllAgents() {
    return Array.from(this.agents.values()).map(agent => ({
      id: agent.id,
      role: agent.role,
      status: agent.status,
      lastActivity: agent.lastActivity,
    }));
  }

  /**
   * Get agents by role
   */
  getAgentsByRole(role) {
    return Array.from(this.agents.values())
      .filter(agent => agent.role === role)
      .map(agent => ({
        id: agent.id,
        role: agent.role,
        status: agent.status,
        lastActivity: agent.lastActivity,
      }));
  }

  /**
   * Update agent status
   */
  updateAgentStatus(agentId, status, metadata = {}) {
    const agent = this.agents.get(agentId);
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    
    agent.status = status;
    agent.lastActivity = new Date().toISOString();
    agent.metadata = { ...agent.metadata, ...metadata };
    
    logger.info(`Agent ${agentId} status updated to: ${status}`);
    return agent;
  }

  /**
   * Terminate agent
   */
  async terminateAgent(agentId) {
    const agent = this.agents.get(agentId);
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    
    logger.info(`Terminating agent: ${agentId}`);
    
    // Perform cleanup
    await this.cleanupAgent(agent);
    
    // Remove from registry
    this.agents.delete(agentId);
    
    logger.info(`Agent ${agentId} terminated successfully`);
    return { success: true, agentId };
  }

  /**
   * Clean up agent resources
   */
  async cleanupAgent(agent) {
    logger.info(`Cleaning up agent: ${agent.id}`);
    
    // Role-specific cleanup
    switch (agent.role) {
      case 'cto':
        // CTO cleanup - ensure other agents are handled
        const remainingAgents = this.getAllAgents().filter(a => a.id !== agent.id);
        if (remainingAgents.length > 0) {
          logger.warn(`CTO termination with ${remainingAgents.length} remaining agents`);
        }
        break;
      case 'cto-assistant':
        // Save any pending ubiquitous language updates
        break;
      case 'principal-engineer':
        // Save technical decisions and architecture
        break;
      case 'domain-director':
        // Save domain planning progress
        break;
      case 'project-manager':
        // Save scheduling information
        break;
    }
    
    agent.status = 'terminated';
    agent.lastActivity = new Date().toISOString();
  }
}
