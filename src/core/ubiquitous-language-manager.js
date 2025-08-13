import { logger } from '../utils/logger.js';
import yaml from 'js-yaml';

/**
 * UbiquitousLanguageManager - Manages domain terminology and concepts
 * Handles ubiquitous language updates, acronym generation, and concept tracking
 */
export class UbiquitousLanguageManager {
  constructor() {
    this.ubiquitousLanguage = new Map();
    this.conceptHistory = [];
    this.acronymRegistry = new Map();
    this.domainConcepts = new Map();
    
    logger.info('UbiquitousLanguageManager initialized');
  }

  /**
   * Update ubiquitous language with new concepts
   */
  async updateConcepts(concepts) {
    logger.info(`Updating ubiquitous language with ${concepts.length} concepts`);
    
    try {
      for (const concept of concepts) {
        await this.processConcept(concept);
      }
      
      // Generate acronyms for new concepts
      await this.generateAcronyms();
      
      // Update domain concept mappings
      await this.updateDomainConcepts();
      
      logger.info('Ubiquitous language updated successfully');
      return { success: true, conceptsProcessed: concepts.length };
    } catch (error) {
      logger.error('Failed to update ubiquitous language:', error);
      throw error;
    }
  }

  /**
   * Process a single concept
   */
  async processConcept(concept) {
    logger.info(`Processing concept: ${concept.name}`);
    
    // Validate concept structure
    this.validateConcept(concept);
    
    // Check for existing concept
    const existingConcept = this.ubiquitousLanguage.get(concept.name);
    
    if (existingConcept) {
      // Update existing concept
      await this.updateExistingConcept(existingConcept, concept);
    } else {
      // Create new concept
      await this.createNewConcept(concept);
    }
    
    // Record concept history
    this.recordConceptHistory(concept);
    
    logger.info(`Concept processed: ${concept.name}`);
  }

  /**
   * Validate concept structure
   */
  validateConcept(concept) {
    if (!concept.name || typeof concept.name !== 'string') {
      throw new Error('Concept must have a valid name');
    }
    
    if (!concept.domain || typeof concept.domain !== 'string') {
      throw new Error('Concept must have a valid domain');
    }
    
    if (!concept.definition || typeof concept.definition !== 'string') {
      throw new Error('Concept must have a valid definition');
    }
    
    // Optional fields
    if (concept.shortName && typeof concept.shortName !== 'string') {
      throw new Error('Concept shortName must be a string if provided');
    }
    
    if (concept.synonyms && !Array.isArray(concept.synonyms)) {
      throw new Error('Concept synonyms must be an array if provided');
    }
    
    if (concept.relatedConcepts && !Array.isArray(concept.relatedConcepts)) {
      throw new Error('Concept relatedConcepts must be an array if provided');
    }
  }

  /**
   * Create new concept
   */
  async createNewConcept(concept) {
    logger.info(`Creating new concept: ${concept.name}`);
    
    const newConcept = {
      id: this.generateConceptId(),
      name: concept.name,
      shortName: concept.shortName || this.generateShortName(concept.name),
      domain: concept.domain,
      definition: concept.definition,
      synonyms: concept.synonyms || [],
      relatedConcepts: concept.relatedConcepts || [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      version: 1,
      metadata: {
        source: concept.source || 'user-input',
        confidence: concept.confidence || 'high',
        tags: concept.tags || [],
      },
    };
    
    // Store concept
    this.ubiquitousLanguage.set(concept.name, newConcept);
    
    // Add to domain concepts
    if (!this.domainConcepts.has(concept.domain)) {
      this.domainConcepts.set(concept.domain, new Set());
    }
    this.domainConcepts.get(concept.domain).add(concept.name);
    
    // Check for potential acronym
    this.checkForAcronym(newConcept);
    
    logger.info(`New concept created: ${concept.name}`);
  }

  /**
   * Update existing concept
   */
  async updateExistingConcept(existingConcept, newConcept) {
    logger.info(`Updating existing concept: ${existingConcept.name}`);
    
    // Update fields
    existingConcept.definition = newConcept.definition || existingConcept.definition;
    existingConcept.domain = newConcept.domain || existingConcept.domain;
    existingConcept.lastUpdated = new Date().toISOString();
    existingConcept.version++;
    
    // Merge synonyms
    if (newConcept.synonyms) {
      existingConcept.synonyms = [...new Set([...existingConcept.synonyms, ...newConcept.synonyms])];
    }
    
    // Merge related concepts
    if (newConcept.relatedConcepts) {
      existingConcept.relatedConcepts = [...new Set([...existingConcept.relatedConcepts, ...newConcept.relatedConcepts])];
    }
    
    // Update metadata
    if (newConcept.metadata) {
      existingConcept.metadata = { ...existingConcept.metadata, ...newConcept.metadata };
    }
    
    // Update domain mapping if domain changed
    if (newConcept.domain && newConcept.domain !== existingConcept.domain) {
      // Remove from old domain
      const oldDomain = this.domainConcepts.get(existingConcept.domain);
      if (oldDomain) {
        oldDomain.delete(existingConcept.name);
      }
      
      // Add to new domain
      if (!this.domainConcepts.has(newConcept.domain)) {
        this.domainConcepts.set(newConcept.domain, new Set());
      }
      this.domainConcepts.get(newConcept.domain).add(existingConcept.name);
    }
    
    logger.info(`Concept updated: ${existingConcept.name} (v${existingConcept.version})`);
  }

  /**
   * Generate short name for concept
   */
  generateShortName(conceptName) {
    // Simple acronym generation
    const words = conceptName.split(/\s+/);
    
    if (words.length === 1) {
      // Single word - take first 3-4 characters
      return conceptName.substring(0, Math.min(4, conceptName.length)).toUpperCase();
    } else {
      // Multiple words - take first letter of each
      return words.map(word => word.charAt(0)).join('').toUpperCase();
    }
  }

  /**
   * Check if concept could be an acronym
   */
  checkForAcronym(concept) {
    const shortName = concept.shortName;
    
    if (shortName.length >= 2 && shortName.length <= 5) {
      // Check if short name could represent the full name
      const words = concept.name.split(/\s+/);
      const potentialAcronym = words.map(word => word.charAt(0)).join('').toUpperCase();
      
      if (shortName === potentialAcronym) {
        // This is a valid acronym
        this.acronymRegistry.set(shortName, {
          conceptName: concept.name,
          domain: concept.domain,
          definition: concept.definition,
          createdAt: concept.createdAt,
        });
        
        logger.info(`Acronym registered: ${shortName} -> ${concept.name}`);
      }
    }
  }

  /**
   * Generate acronyms for concepts
   */
  async generateAcronyms() {
    logger.info('Generating acronyms for concepts');
    
    let acronymsGenerated = 0;
    
    for (const concept of this.ubiquitousLanguage.values()) {
      if (!concept.shortName || concept.shortName.length < 2) {
        // Generate short name if not present
        concept.shortName = this.generateShortName(concept.name);
        acronymsGenerated++;
      }
      
      // Check for acronym potential
      this.checkForAcronym(concept);
    }
    
    logger.info(`Generated ${acronymsGenerated} short names and acronyms`);
  }

  /**
   * Update domain concept mappings
   */
  async updateDomainConcepts() {
    logger.info('Updating domain concept mappings');
    
    // Clear existing mappings
    this.domainConcepts.clear();
    
    // Rebuild mappings
    for (const concept of this.ubiquitousLanguage.values()) {
      if (!this.domainConcepts.has(concept.domain)) {
        this.domainConcepts.set(concept.domain, new Set());
      }
      this.domainConcepts.get(concept.domain).add(concept.name);
    }
    
    logger.info(`Domain concept mappings updated for ${this.domainConcepts.size} domains`);
  }

  /**
   * Record concept history
   */
  recordConceptHistory(concept) {
    const record = {
      timestamp: new Date().toISOString(),
      conceptName: concept.name,
      action: 'concept_updated',
      changes: {
        definition: concept.definition,
        domain: concept.domain,
        shortName: concept.shortName,
      },
    };
    
    this.conceptHistory.push(record);
    
    // Keep only last 1000 records
    if (this.conceptHistory.length > 1000) {
      this.conceptHistory = this.conceptHistory.slice(-1000);
    }
  }

  /**
   * Generate concept ID
   */
  generateConceptId() {
    return `concept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get concept by name
   */
  getConcept(name) {
    return this.ubiquitousLanguage.get(name);
  }

  /**
   * Get concepts by domain
   */
  getConceptsByDomain(domain) {
    const conceptNames = this.domainConcepts.get(domain) || new Set();
    return Array.from(conceptNames).map(name => this.ubiquitousLanguage.get(name));
  }

  /**
   * Get all concepts
   */
  getAllConcepts() {
    return Array.from(this.ubiquitousLanguage.values());
  }

  /**
   * Get acronym registry
   */
  getAcronymRegistry() {
    return Array.from(this.acronymRegistry.entries()).map(([acronym, data]) => ({
      acronym,
      ...data,
    }));
  }

  /**
   * Search concepts
   */
  searchConcepts(query, options = {}) {
    const results = [];
    const searchTerm = query.toLowerCase();
    
    for (const concept of this.ubiquitousLanguage.values()) {
      let score = 0;
      
      // Name match
      if (concept.name.toLowerCase().includes(searchTerm)) {
        score += 10;
      }
      
      // Short name match
      if (concept.shortName && concept.shortName.toLowerCase().includes(searchTerm)) {
        score += 8;
      }
      
      // Definition match
      if (concept.definition.toLowerCase().includes(searchTerm)) {
        score += 5;
      }
      
      // Domain match
      if (concept.domain.toLowerCase().includes(searchTerm)) {
        score += 3;
      }
      
      // Synonyms match
      if (concept.synonyms.some(synonym => synonym.toLowerCase().includes(searchTerm))) {
        score += 4;
      }
      
      if (score > 0) {
        results.push({ concept, score });
      }
    }
    
    // Sort by score
    results.sort((a, b) => b.score - a.score);
    
    // Apply filters
    if (options.domain) {
      results = results.filter(result => result.concept.domain === options.domain);
    }
    
    if (options.limit) {
      results = results.slice(0, options.limit);
    }
    
    return results.map(result => result.concept);
  }

  /**
   * Export ubiquitous language to YAML
   */
  exportToYaml() {
    const exportData = {
      domains: Array.from(this.domainConcepts.keys()).map(domain => ({
        name: domain,
        concepts: this.getConceptsByDomain(domain).map(concept => ({
          name: concept.name,
          shortName: concept.shortName,
          definition: concept.definition,
          synonyms: concept.synonyms,
          relatedConcepts: concept.relatedConcepts,
          metadata: concept.metadata,
        })),
      })),
      acronyms: this.getAcronymRegistry(),
      metadata: {
        totalConcepts: this.ubiquitousLanguage.size,
        totalDomains: this.domainConcepts.size,
        totalAcronyms: this.acronymRegistry.size,
        lastUpdated: new Date().toISOString(),
      },
    };
    
    return yaml.dump(exportData);
  }

  /**
   * Import ubiquitous language from YAML
   */
  async importFromYaml(yamlContent) {
    logger.info('Importing ubiquitous language from YAML');
    
    try {
      const data = yaml.load(yamlContent);
      
      if (data.domains) {
        for (const domain of data.domains) {
          if (domain.concepts) {
            for (const concept of domain.concepts) {
              await this.processConcept({
                name: concept.name,
                shortName: concept.shortName,
                domain: domain.name,
                definition: concept.definition,
                synonyms: concept.synonyms || [],
                relatedConcepts: concept.relatedConcepts || [],
                metadata: concept.metadata || {},
              });
            }
          }
        }
      }
      
      logger.info('Ubiquitous language imported successfully');
      return { success: true, conceptsImported: this.ubiquitousLanguage.size };
    } catch (error) {
      logger.error('Failed to import ubiquitous language:', error);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalConcepts: this.ubiquitousLanguage.size,
      totalDomains: this.domainConcepts.size,
      totalAcronyms: this.acronymRegistry.size,
      totalHistory: this.conceptHistory.length,
      domainBreakdown: Object.fromEntries(
        Array.from(this.domainConcepts.entries()).map(([domain, concepts]) => [
          domain,
          concepts.size,
        ])
      ),
    };
  }
}
