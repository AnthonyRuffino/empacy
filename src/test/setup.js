/**
 * Test setup file for Empacy
 * Configures test environment and global test utilities
 */

// Set test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fs operations for tests
jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  stat: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}));

// Mock path operations
jest.mock('path', () => ({
  resolve: jest.fn((...args) => args.join('/')),
  join: jest.fn((...args) => args.join('/')),
  dirname: jest.fn((path) => path.split('/').slice(0, -1).join('/')),
  basename: jest.fn((path) => path.split('/').pop()),
  extname: jest.fn((path) => {
    const ext = path.split('.').pop();
    return ext === path ? '' : `.${ext}`;
  }),
}));

// Mock os operations
jest.mock('os', () => ({
  tmpdir: jest.fn(() => '/tmp'),
  homedir: jest.fn(() => '/home/test'),
  platform: jest.fn(() => 'linux'),
  arch: jest.fn(() => 'x64'),
}));

// Global test utilities
global.createTestAgent = (role, context = {}) => ({
  id: `test_agent_${Date.now()}`,
  role,
  context,
  status: 'ready',
  createdAt: new Date().toISOString(),
  lastActivity: new Date().toISOString(),
  capabilities: ['test'],
  metadata: {},
});

global.createTestContext = (files = []) => ({
  agentId: 'test_agent',
  timestamp: new Date().toISOString(),
  contextFiles: files.map(file => ({
    file,
    path: `/test/${file}`,
    size: 100,
    lastModified: new Date(),
    content: `Test content for ${file}`,
    type: 'text',
  })),
  summary: { files: [], overview: 'Test context' },
  metadata: {
    totalFiles: files.length,
    totalSize: files.length * 100,
    fileTypes: ['text'],
  },
});

global.createTestConcept = (name, domain, definition) => ({
  name,
  domain,
  definition,
  shortName: name.split(' ').map(word => word.charAt(0)).join('').toUpperCase(),
  synonyms: [],
  relatedConcepts: [],
  metadata: {
    source: 'test',
    confidence: 'high',
    tags: [],
  },
});

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test configuration
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';
