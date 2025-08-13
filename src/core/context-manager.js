import { logger } from '../utils/logger.js';

/**
 * ContextManager - Manages context distribution and sharing between agents
 * Handles context validation, versioning, and access control
 */
export class ContextManager {
  constructor() {
    this.contexts = new Map();
    this.contextVersions = new Map();
    this.accessLog = [];
    
    logger.info('ContextManager initialized');
  }

  /**
   * Distribute context to a specific agent
   */
  async distributeContext(agentId, contextFiles) {
    logger.info(`Distributing context to agent: ${agentId}`);
    
    try {
      // Validate context files
      const validatedContext = await this.validateContextFiles(contextFiles);
      
      // Create context package for the agent
      const contextPackage = await this.createContextPackage(agentId, validatedContext);
      
      // Store context distribution record
      this.recordContextDistribution(agentId, contextFiles);
      
      logger.info(`Context distributed successfully to agent: ${agentId}`);
      return contextPackage;
    } catch (error) {
      logger.error(`Failed to distribute context to agent ${agentId}:`, error);
      throw error;
    }
  }

  /**
   * Validate context files exist and are accessible
   */
  async validateContextFiles(contextFiles) {
    logger.info(`Validating ${contextFiles.length} context files`);
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const validatedContext = [];
    
    for (const contextFile of contextFiles) {
      try {
        // Check if file exists
        const filePath = path.resolve(contextFile);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
          // Read file content
          const content = await fs.readFile(filePath, 'utf8');
          
          validatedContext.push({
            file: contextFile,
            path: filePath,
            size: stats.size,
            lastModified: stats.mtime,
            content,
            type: this.detectContentType(contextFile, content),
          });
          
          logger.info(`Context file validated: ${contextFile}`);
        } else {
          logger.warn(`Context file is not a regular file: ${contextFile}`);
        }
      } catch (error) {
        logger.warn(`Context file validation failed: ${contextFile}`, error.message);
        // Continue with other files
      }
    }
    
    logger.info(`Context validation complete: ${validatedContext.length}/${contextFiles.length} files valid`);
    return validatedContext;
  }

  /**
   * Detect content type based on file extension and content
   */
  detectContentType(filename, content) {
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
      return 'yaml';
    } else if (filename.endsWith('.json')) {
      return 'json';
    } else if (filename.endsWith('.md')) {
      return 'markdown';
    } else if (filename.endsWith('.txt')) {
      return 'text';
    } else {
      // Try to detect from content
      if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
        return 'json';
      } else if (content.includes('---') && content.includes(':')) {
        return 'yaml';
      } else if (content.includes('#')) {
        return 'markdown';
      } else {
        return 'text';
      }
    }
  }

  /**
   * Create context package for an agent
   */
  async createContextPackage(agentId, validatedContext) {
    logger.info(`Creating context package for agent: ${agentId}`);
    
    const contextPackage = {
      agentId,
      timestamp: new Date().toISOString(),
      contextFiles: validatedContext,
      summary: this.generateContextSummary(validatedContext),
      metadata: {
        totalFiles: validatedContext.length,
        totalSize: validatedContext.reduce((sum, file) => sum + file.size, 0),
        fileTypes: [...new Set(validatedContext.map(file => file.type))],
      },
    };
    
    // Store context package
    this.contexts.set(agentId, contextPackage);
    
    // Update version tracking
    this.updateContextVersion(agentId, contextPackage);
    
    logger.info(`Context package created for agent: ${agentId}`);
    return contextPackage;
  }

  /**
   * Generate summary of context files
   */
  generateContextSummary(validatedContext) {
    const summary = {
      files: validatedContext.map(file => ({
        name: file.file,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      })),
      overview: `Context package contains ${validatedContext.length} files with ${this.formatBytes(validatedContext.reduce((sum, file) => sum + file.size, 0))} total content`,
    };
    
    return summary;
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Update context version tracking
   */
  updateContextVersion(agentId, contextPackage) {
    const currentVersion = this.contextVersions.get(agentId) || 0;
    const newVersion = currentVersion + 1;
    
    this.contextVersions.set(agentId, newVersion);
    
    logger.info(`Context version updated for agent ${agentId}: v${newVersion}`);
  }

  /**
   * Record context distribution for audit purposes
   */
  recordContextDistribution(agentId, contextFiles) {
    const record = {
      timestamp: new Date().toISOString(),
      agentId,
      contextFiles,
      action: 'context_distributed',
    };
    
    this.accessLog.push(record);
    
    // Keep only last 1000 records
    if (this.accessLog.length > 1000) {
      this.accessLog = this.accessLog.slice(-1000);
    }
    
    logger.info(`Context distribution recorded for agent: ${agentId}`);
  }

  /**
   * Get context for a specific agent
   */
  getContext(agentId) {
    const context = this.contexts.get(agentId);
    
    if (!context) {
      throw new Error(`No context found for agent: ${agentId}`);
    }
    
    return context;
  }

  /**
   * Get context version for an agent
   */
  getContextVersion(agentId) {
    return this.contextVersions.get(agentId) || 0;
  }

  /**
   * Update context for an agent
   */
  async updateContext(agentId, newContextFiles) {
    logger.info(`Updating context for agent: ${agentId}`);
    
    // Validate new context files
    const validatedContext = await this.validateContextFiles(newContextFiles);
    
    // Create new context package
    const contextPackage = await this.createContextPackage(agentId, validatedContext);
    
    logger.info(`Context updated for agent: ${agentId}`);
    return contextPackage;
  }

  /**
   * Get context access log
   */
  getAccessLog(agentId = null, limit = 100) {
    let log = this.accessLog;
    
    if (agentId) {
      log = log.filter(record => record.agentId === agentId);
    }
    
    return log.slice(-limit);
  }

  /**
   * Clean up old context data
   */
  cleanupOldContext(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    logger.info('Cleaning up old context data');
    
    const cutoff = new Date(Date.now() - maxAge);
    let cleanedCount = 0;
    
    for (const [agentId, context] of this.contexts.entries()) {
      const contextAge = new Date(context.timestamp);
      
      if (contextAge < cutoff) {
        this.contexts.delete(agentId);
        this.contextVersions.delete(agentId);
        cleanedCount++;
      }
    }
    
    logger.info(`Cleaned up ${cleanedCount} old context entries`);
    return cleanedCount;
  }

  /**
   * Get context statistics
   */
  getContextStats() {
    const stats = {
      totalAgents: this.contexts.size,
      totalContextFiles: 0,
      totalContextSize: 0,
      fileTypeDistribution: {},
      recentActivity: this.accessLog.slice(-10),
    };
    
    for (const context of this.contexts.values()) {
      stats.totalContextFiles += context.contextFiles.length;
      stats.totalContextSize += context.metadata.totalSize;
      
      for (const fileType of context.metadata.fileTypes) {
        stats.fileTypeDistribution[fileType] = (stats.fileTypeDistribution[fileType] || 0) + 1;
      }
    }
    
    return stats;
  }
}
