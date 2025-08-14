/**
 * Language CLI - Command-line interface for ubiquitous language management
 * Provides concept management and search functionality
 */

import { logger } from './utils/logger.js';
import { UbiquitousLanguageManager } from './core/ubiquitous-language-manager.js';

/**
 * Add a new concept to ubiquitous language
 */
export async function addConcept(concept) {
  try {
    logger.info(`Adding concept: ${concept.name}`);
    
    const languageManager = new UbiquitousLanguageManager();
    const result = await languageManager.addConcept(concept);
    
    logger.info(`Concept ${concept.name} added successfully`);
    return result;
  } catch (error) {
    logger.error(`Failed to add concept ${concept.name}:`, error);
    throw error;
  }
}

/**
 * Search concepts in ubiquitous language
 */
export async function searchConcepts(query, options = {}) {
  try {
    logger.info(`Searching concepts for: ${query}`);
    
    const languageManager = new UbiquitousLanguageManager();
    const results = await languageManager.searchConcepts(query, options);
    
    logger.info(`Found ${results.length} concepts for query: ${query}`);
    return results;
  } catch (error) {
    logger.error(`Failed to search concepts:`, error);
    throw error;
  }
}

/**
 * Export ubiquitous language to YAML
 */
export async function exportLanguage() {
  try {
    logger.info('Exporting ubiquitous language...');
    
    const languageManager = new UbiquitousLanguageManager();
    const yaml = await languageManager.exportToYaml();
    
    logger.info('Ubiquitous language exported successfully');
    return yaml;
  } catch (error) {
    logger.error('Failed to export ubiquitous language:', error);
    throw error;
  }
}
