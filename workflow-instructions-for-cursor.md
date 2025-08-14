# Instructions for Cursor: Create workflow-example.md

Please create a comprehensive `workflow-example.md` document that perfectly documents how to set up an environment to run the central MCP server as an npm package and demonstrates the complete multi-agent workflow for creating a TODO app.

## Document Structure Requirements:

### 1. Environment Setup Section
- Show how to install Empacy via npm (not git) globally: `npm install -g empacy`
- Show how to start the Empacy MCP server as a background service
- Show configuration files needed (mcp-servers.json, settings.json) for different agent types
- Include Docker container setup as an alternative to global npm install

### 2. Agent Configuration Examples
Show configuration examples for all three agent types:

**Gemini (Google AI Studio):**
- How to configure Gemini to use the Empacy MCP server
- Example mcp-servers.json or equivalent config

**Cursor:**
- How to configure Cursor to use the Empacy MCP server
- Example settings.json configuration

**Claude CLI:**
- How to configure Claude CLI to use the Empacy MCP server
- Example configuration files

### 3. User Prompt Example
Create a very short, realistic user prompt like:
> "I need a new TODO app for managing my daily tasks. It should have basic CRUD operations, user authentication, and a clean interface. I prefer React for the frontend and Node.js for the backend."

### 4. Complete CTO Workflow
Show the entire flow step-by-step:

**CTO Initial Actions:**
- How the CTO receives the user prompt via MCP
- What MCP calls the CTO makes to spawn the CTO-Assistant
- How the CTO passes context files to the CTO-Assistant
- What the CTO-Assistant returns (ubiquitous language updates, high-level summary)

**CTO File Creation:**
- Exact MCP calls the CTO uses to save files to disk
- Show the specific MCP tools/actions for file operations
- What files get created: ubiquitous-language.yaml, vision.md, domain-design.md, milestones.md
- Distinguish between MCP actions vs. LLM inference

**CTO-Principal Engineer Interaction:**
- How the CTO spawns the Principal Engineer via MCP
- What context files the CTO passes to the Principal
- What MCP tools the Principal Engineer uses vs. what they infer
- Show the Principal's MCP response with architecture summary and PlantUML files

### 5. Domain Director Workflow
Show how the CTO:
- Generates domain definitions via MCP
- Spawns Domain Directors for each domain
- Passes relevant context to each Domain Director
- What MCP commands Domain Directors use for planning
- What they infer vs. what they call via MCP
- How they indicate completion of their plans

### 6. Project Manager Workflow
Show how the Project Manager:
- Takes over after all Domain Directors complete
- Reads all domain plans via MCP
- Schedules work and identifies dependencies
- Passes work to Senior Developers
- Manages merges and creates releases
- What MCP tools are used vs. what is inferred

### 7. MCP Tool Specifications
For each major interaction, specify:
- Exact MCP method names and parameters
- What data gets passed between agents
- What gets saved to disk vs. what stays in memory
- How context flows between different agent types

### 8. PlantUML Generation
- Show how agents generate PlantUML diagrams via MCP
- Include example PlantUML content for the TODO app
- Also ask Cursor to create PlantUML diagrams for Empacy itself (since we don't have them)

### 9. TODO Markers
Mark any features that don't exist yet as `[TODO: Feature not yet implemented]` in the workflow

## Technical Requirements:

- Use exact MCP method names and parameter structures
- Show real configuration file examples
- Include actual command-line examples
- Distinguish clearly between MCP actions and LLM inference
- Show the complete data flow from user prompt to final release
- Include error handling and edge cases
- Show how the system handles multiple concurrent agents

## Example MCP Call Format:
```json
{
  "method": "spawnAgent",
  "params": {
    "role": "CTO-Assistant",
    "context": ["ubiquitous-language.yaml", "user-prompt.txt"],
    "capabilities": ["summarize", "extract-concepts", "update-ul"]
  }
}
```

## File Structure to Show:
```
project-root/
├── ubiquitous-language.yaml
├── vision.md
├── domain-design.md
├── milestones.md
├── architecture/
│   ├── system-overview.puml
│   ├── component-diagram.puml
│   └── sequence-diagram.puml
├── domains/
│   ├── frontend/
│   │   └── domain-plan.md
│   ├── backend/
│   │   └── domain-plan.md
│   └── infrastructure/
│       └── domain-plan.md
└── project-schedule.md
```

Please create this document with enough detail that a developer could follow it step-by-step to set up and run the complete Empacy workflow. Include all the technical specifics, MCP calls, and configuration examples needed.
