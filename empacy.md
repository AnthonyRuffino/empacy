# Empacy - Multi-Agent MCP Server

## Overview

Empacy is an MCP server npm module that enables multiple AI agents to be spawned in parallel by a central AI agent. The system follows a hierarchical organizational structure where the Central Agent (CTO) orchestrates work through specialized agents, each with distinct responsibilities.

## Architecture

### Agent Hierarchy

```
CTO (Central Agent)
├── CTO-Assistant
├── Principal Engineer
├── Project Manager
└── Domain Directors
    └── Senior Developers
```

## Agent Roles & Responsibilities

### 1. CTO (Central Agent)
- **Primary Role**: Strategic decision maker and orchestrator
- **Responsibilities**:
  - Receives initial user prompt and maintains full context
  - Creates high-level vision and domain design files
  - Defines milestones for each domain
  - Makes major technology stack decisions
  - Manages context distribution to direct reports
  - Spawns and coordinates all other agents

### 2. CTO-Assistant
- **Primary Role**: Content refinement and ubiquitous language management
- **Responsibilities**:
  - Summarizes user prompts (concise but meaning-preserving)
  - Corrects spelling mistakes
  - Identifies new domain objects, proper nouns, and system names
  - Maintains and updates ubiquitous-language.yaml
  - Creates acronyms for major concepts to save context space
  - Ensures no meaning is lost in summarization while avoiding redundant user input

### 3. Principal Engineer
- **Primary Role**: Technical architecture and infrastructure
- **Responsibilities**:
  - Analyzes existing codebase (if any)
  - Creates detailed codebase/architectural summaries
  - Sets up new git projects with full CI/CD pipeline
  - Implements observability, security, and quality tools
  - Provides technical analysis to CTO
  - Creates PlantUML architecture diagrams

### 4. Domain Directors
- **Primary Role**: Domain-specific planning and task breakdown
- **Responsibilities**:
  - Create detailed phase-by-phase implementation plans
  - Define major modules and units of work
  - Break down tasks with detailed step-by-step instructions
  - Create context digests for Senior developers
  - Reference needed context directly as text (preferred over file references)

### 5. Project Manager
- **Primary Role**: Task scheduling and dependency management
- **Responsibilities**:
  - Reads phases planned by Domain Directors
  - Identifies task dependencies and blocking relationships
  - Plans around potential merge conflicts
  - Schedules work across different feature branches
  - Manages project timeline and resource allocation

## Workflow

### Phase 1: Initial Assessment
1. **User Input**: CTO receives initial prompt
2. **CTO-Assistant Processing**: 
   - Summarizes and refines user input
   - Updates ubiquitous-language.yaml
   - Identifies new domain concepts
3. **CTO Analysis**: Creates vision and domain design files

### Phase 2: Technical Foundation
1. **Principal Engineer Engagement**:
   - Analyzes existing codebase (if applicable)
   - Sets up new project infrastructure (if needed)
   - Provides technical summary to CTO
2. **Context Distribution**: CTO distributes relevant context to Domain Directors

### Phase 3: Domain Planning
1. **Domain Directors**: Create detailed implementation plans
2. **Phase Documentation**: Each phase includes context digest for Senior developers
3. **Completion Notification**: Domain Directors notify CTO when planning is complete

### Phase 4: Project Management
1. **Project Manager Activation**: CTO calls Project Manager
2. **Task Scheduling**: Project Manager creates comprehensive work schedule
3. **Dependency Mapping**: Identifies blocking relationships and merge conflicts

## File Structure

### Core Files
- `ubiquitous-language.yaml` - Domain terminology and acronyms
- `vision.md` - High-level project vision
- `domain-design.md` - Domain architecture and relationships
- `milestones.md` - Abstract steps for each domain

### Domain-Specific Files
- `domains/{domain}/phases.md` - Detailed implementation phases
- `domains/{domain}/context-digest.md` - Context summaries for developers

### Technical Files
- `architecture/` - PlantUML diagrams and technical specifications
- `ci-cd/` - GitHub Actions, deployment configurations
- `quality/` - Test frameworks, code coverage, style enforcement

## Ubiquitous Language Structure

```yaml
domains:
  - name: "User Management System"
    short-name: "UMS"
    definition: "Handles user authentication, authorization, and profile management"
    
  - name: "Payment Processing Gateway"
    short-name: "PPG"
    definition: "Manages payment transactions and financial operations"
```

## Technology Requirements

### Infrastructure
- Git repository with GitHub Actions
- Docker containerization
- CI/CD pipeline with multiple environments (staging, testing, production)

### Quality Tools
- Unit and integration testing frameworks
- Code coverage (Jacoco)
- Style enforcement (Checkstyle)
- Security scanning
- SSL/TLS support

### Observability
- Logging and monitoring
- Performance metrics
- Error tracking and alerting

## MCP Server Features

### Agent Spawning
- Support for multiple AI providers (Gemini, Cursor, Claude)
- Parallel agent execution
- Context sharing and management
- File system isolation (no external file creation)

### Context Management
- Automatic context distribution
- Version control for context files
- Context digest generation
- Reference management

### Integration
- npm/Maven publishing support
- Artifact building and deployment
- Multi-environment configuration
- Quality gate enforcement

## Implementation Notes

### File Isolation
- All files created within the designated directory
- No external file system access
- Resource isolation between agents

### Context Preservation
- Full user prompt maintained in CTO context
- Meaning-preserving summarization
- Ubiquitous language evolution tracking

### Scalability
- Parallel agent execution
- Modular domain architecture
- Configurable quality gates
- Extensible technology stack

## Use Cases

### New Project Initiation
- Greenfield development with full infrastructure setup
- Technology stack selection and architecture design
- Domain modeling and ubiquitous language establishment

### Existing Project Enhancement
- Codebase analysis and architectural review
- New feature planning and implementation
- Technical debt assessment and remediation

### Multi-Domain Projects
- Complex systems with multiple business domains
- Inter-domain dependency management
- Coordinated development across teams

## Benefits

1. **Structured Development**: Clear hierarchy and responsibility separation
2. **Context Efficiency**: Ubiquitous language and acronyms reduce context overhead
3. **Quality Assurance**: Built-in quality gates and testing from project start
4. **Scalability**: Parallel agent execution for complex projects
5. **Maintainability**: Clear documentation and context preservation
6. **Flexibility**: Support for multiple AI providers and technology stacks
