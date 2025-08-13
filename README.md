# Empacy - Multi-Agent MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-%3E%3D9.0.0-orange.svg)](https://www.npmjs.com/)

**Empacy** is a revolutionary MCP server that enables multiple AI agents to collaborate on complex development projects through a hierarchical organizational structure. By implementing specialized roles and intelligent context management, Empacy transforms how AI agents work together to deliver high-quality software solutions.

## 🎯 **Key Features**

- **Multi-Agent Collaboration**: Spawn and coordinate multiple AI agents in parallel
- **Hierarchical Organization**: Clear role separation with CTO, Principal Engineer, Domain Directors, and more
- **Context Efficiency**: Ubiquitous language system with acronyms to reduce context overhead
- **Quality-First Development**: Built-in quality gates, testing, and CI/CD from project inception
- **File Isolation**: Secure, isolated workspaces for each project
- **MCP Protocol Support**: Standard Model Context Protocol for AI agent communication

## 🏗️ **Architecture**

```
CTO (Central Agent)
├── CTO-Assistant (Content & Language Management)
├── Principal Engineer (Technical Architecture)
├── Project Manager (Task Coordination)
└── Domain Directors (Implementation Planning)
    └── Senior Developers (Task Execution)
```

## 🚀 **Quick Start**

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnthonyRuffino/empacy.git
   cd empacy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup development environment**
   ```bash
   npm run setup:dev
   ```

4. **Start the MCP server**
   ```bash
   # Start with stdio transport (for MCP clients)
   npm run start -- --stdio
   
   # Start with HTTP transport (for web clients)
   npm run start -- --port 3000
   ```

### CLI Usage

Empacy provides a comprehensive command-line interface:

```bash
# Start the server
./scripts/empacy start --stdio

# Spawn a new agent
./scripts/empacy agent spawn cto-assistant --context "vision.md,ubiquitous-language.yaml"

# Create a new project
./scripts/empacy project create "My Project" --description "A sample project" --domains "Frontend,Backend,Database"

# Manage ubiquitous language
./scripts/empacy language add "User Management" "Authentication" "Handles user authentication and authorization"
./scripts/empacy language search "user"

# Check system health
./scripts/empacy health
```

## 📚 **Core Concepts**

### **Agent Roles**

- **CTO**: Strategic decision maker and orchestrator
- **CTO-Assistant**: Content refinement and ubiquitous language management
- **Principal Engineer**: Technical architecture and infrastructure
- **Domain Director**: Domain-specific planning and task breakdown
- **Project Manager**: Task scheduling and dependency management

### **Ubiquitous Language**

Empacy maintains a centralized terminology system that evolves with your project:

```yaml
domains:
  - name: "User Management System"
    short-name: "UMS"
    definition: "Handles user authentication, authorization, and profile management"
    
  - name: "Payment Processing Gateway"
    short-name: "PPG"
    definition: "Manages payment transactions and financial operations"
```

### **Context Management**

Intelligent context distribution ensures agents have relevant information without overhead:

- **Context Validation**: Automatic file validation and content analysis
- **Version Tracking**: Context versioning and change history
- **Access Control**: Role-based context access permissions

## 🛠️ **Development**

### **Project Structure**

```
empacy/
├── src/
│   ├── core/           # Core server and management classes
│   ├── agents/         # Agent implementations
│   ├── utils/          # Utility functions and helpers
│   └── test/           # Test files and setup
├── scripts/            # CLI and utility scripts
├── ci-cd/              # CI/CD pipeline configurations
├── quality/            # Quality tool configurations
├── architecture/       # Architecture diagrams and specs
└── templates/          # Project templates
```

### **Available Scripts**

```bash
# Development
npm run dev              # Start development server with watch
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Docker
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
npm run docker:test      # Run tests in Docker

# Setup
npm run setup:dev        # Setup development environment
npm run setup:ci         # Setup CI environment
```

### **Testing**

Empacy includes comprehensive testing with Jest:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- src/core/server.test.js
```

### **Code Quality**

Quality gates are enforced through:

- **ESLint**: Code linting and style enforcement
- **Prettier**: Automatic code formatting
- **Jest**: Comprehensive testing framework
- **Husky**: Git hooks for pre-commit validation
- **Coverage Thresholds**: Minimum 80% code coverage required

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Logging
LOG_LEVEL=info          # Set log level (error, warn, info, debug)

# Server
PORT=3000               # HTTP server port
HOST=localhost          # HTTP server host

# Development
NODE_ENV=development    # Environment mode
```

### **Configuration Files**

- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier formatting rules
- `jest.config.js` - Jest testing configuration
- `.npmrc` - NPM configuration

## 🐳 **Docker Support**

Empacy includes full Docker support:

```bash
# Build image
docker build -t empacy .

# Run container
docker run -p 3000:3000 empacy

# Run tests in container
docker run --rm empacy npm test

# Development with volume mounting
docker run -v $(pwd):/app -p 3000:3000 empacy npm run dev
```

## 📊 **Monitoring & Observability**

### **Logging**

Structured logging with Winston:

- **Console Output**: Colored, formatted logs for development
- **File Logs**: Persistent logs in `logs/` directory
- **Log Levels**: Configurable log levels (error, warn, info, debug)
- **Structured Format**: JSON logging for production

### **Health Checks**

Built-in health monitoring:

```bash
# Check system health
./scripts/empacy health

# Health endpoint (HTTP mode)
curl http://localhost:3000/health
```

## 🔒 **Security Features**

- **File Isolation**: Projects operate in isolated directories
- **Context Access Control**: Role-based context permissions
- **Input Validation**: Comprehensive input sanitization
- **Secure Defaults**: Security-first configuration

## 🚀 **Deployment**

### **Production Deployment**

1. **Build production image**
   ```bash
   docker build -t empacy:latest .
   ```

2. **Run with production settings**
   ```bash
   docker run -d \
     --name empacy \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e LOG_LEVEL=info \
     empacy:latest
   ```

### **CI/CD Integration**

Empacy includes GitHub Actions workflows:

- **Automated Testing**: Run tests on every commit
- **Quality Gates**: Enforce code quality standards
- **Docker Builds**: Automated container builds
- **Deployment**: Automated deployment to staging/production

## 📈 **Performance & Scalability**

- **Parallel Agent Execution**: Multiple agents work simultaneously
- **Context Optimization**: Efficient context sharing and caching
- **Resource Management**: Intelligent resource allocation
- **Horizontal Scaling**: Support for multiple server instances

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### **Code Standards**

- Follow ESLint and Prettier configurations
- Maintain 80%+ test coverage
- Write clear, documented code
- Follow conventional commit messages

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **MCP Protocol**: Model Context Protocol for AI agent communication
- **Node.js Community**: Excellent ecosystem and tooling
- **Open Source Contributors**: All who contribute to make this project better

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/AnthonyRuffino/empacy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AnthonyRuffino/empacy/discussions)
- **Documentation**: [Wiki](https://github.com/AnthonyRuffino/empacy/wiki)

## 🔮 **Roadmap**

- [ ] Advanced conflict resolution algorithms
- [ ] Machine learning for context optimization
- [ ] Integration with more AI providers
- [ ] Advanced project templates
- [ ] Enterprise features and scaling

---

**Empacy** - Transforming AI agent collaboration for the future of software development.
