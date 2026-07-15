# AI Agent Setup Guide

This document provides instructions for AI agents to set up the development environment for the TCG Engines project.

## Overview

This project requires:
- **Node.js 24.x** - JavaScript runtime (managed via fnm)
- **Bun 1.2.18+** - Primary package manager and runtime
- **fnm** - Fast Node Manager for Node.js version management

## Quick Setup

The easiest way to set up the environment is to run the automated setup script:

```bash
chmod +x setup.sh
./setup.sh
```

## Manual Setup Instructions

If you prefer to set up manually or the script doesn't work, follow these steps:

### 1. Install fnm (Fast Node Manager)

fnm is used to manage Node.js versions. Install it with:

```bash
curl -o- https://fnm.vercel.app/install | bash
```

After installation, restart your terminal or source your shell configuration:
- For bash: `source ~/.bashrc`
- For zsh: `source ~/.zshrc`

**Reference**: https://github.com/Schniz/fnm

### 2. Install Node.js 24

Use fnm to install Node.js 24:

```bash
fnm install 24
fnm use 24
```

Verify the installation:
```bash
node -v  # Should print "v24.x.x" (e.g., v24.12.0)
npm -v   # Should print "11.x.x" (e.g., 11.6.2)
```

**Reference**: https://nodejs.org/en/download

### 3. Install Bun

Bun is the primary package manager and runtime for this project:

```bash
curl -fsSL https://bun.sh/install | bash
```

After installation, restart your terminal or source your shell configuration.

Verify the installation:
```bash
bun -v  # Should print "1.2.18" or later
```

**Reference**: https://bun.com/

### 4. Install Project Dependencies

Once Bun is installed, install the project dependencies:

```bash
bun install
```

## Important Notes for AI Agents

### Package Manager

- **Always use `bun`** for package management commands:
  - `bun install` (not `npm install`)
  - `bun add <package>` (not `npm install <package>`)
  - `bun remove <package>` (not `npm uninstall <package>`)

### Running Scripts

- Use `bun run <script>` to execute package.json scripts
- Use `bunx` for running packages (equivalent to `npx`)
- Example: `bunx turbo run build`

### Node.js Version

- The project uses Node.js 24.x (specified in `.node-version`)
- fnm will automatically switch to the correct version when you enter the project directory (if configured)
- The version is also specified in `package.json` under `volta.node`

### Bun Version

- The project requires Bun 1.2.18 (specified in `package.json` as `packageManager`)
- This is enforced by the package manager field

### Script Execution

- TypeScript scripts can be run directly with Bun: `bun run script.ts`
- Scripts with shebang `#!/usr/bin/env bun` can be executed directly: `./script.ts`
- No compilation step is needed - Bun handles TypeScript natively

## Verification

After setup, verify everything is working:

```bash
# Check Node.js version
node -v  # Should be v24.x

# Check npm version (comes with Node.js)
npm -v   # Should be 11.x

# Check Bun version
bun -v   # Should be 1.2.18 or later

# Check fnm (if using automatic version switching)
fnm --version

# Install dependencies
bun install

# Run a test command
bun run check-types
```

## Troubleshooting

### fnm not found after installation

- Restart your terminal
- Or manually source: `source ~/.bashrc` or `source ~/.zshrc`
- Check that fnm is in your PATH: `echo $PATH | grep fnm`

### Node.js version incorrect

- Ensure fnm is configured in your shell
- Run `fnm use 24` to switch to Node.js 24
- Check `.node-version` file contains `24` or `24.12.0`

### Bun not found after installation

- Restart your terminal
- Or manually add to PATH: `export PATH="$HOME/.bun/bin:$PATH"`
- Verify installation: `which bun`

### Package installation issues

- Ensure you're using `bun install` (not npm/yarn/pnpm)
- Clear cache if needed: `bun pm cache rm`
- Check `package.json` has `"packageManager": "bun@1.2.18"`

## Project Structure

- Root `package.json` defines workspaces and scripts
- Each package in `packages/` has its own `package.json`
- Turborepo is used for monorepo task orchestration
- All commands should be run from the root directory

## Common Commands

```bash
# Install dependencies
bun install

# Run type checking
bun run check-types

# Run tests
bun test

# Run linting
bun run lint

# Format code
bun run format

# Run all checks (format, lint, type check, test)
bun run ci-check

# Build all packages
bun run build
```

## Environment Variables

The project may use environment variables. Check for:
- `.env.local` files (gitignored)
- Environment variable documentation in package READMEs

## Additional Resources

- [Bun Documentation](https://bun.com/docs)
- [fnm Documentation](https://github.com/Schniz/fnm)
- [Node.js Documentation](https://nodejs.org/docs)
- [Project README](./README.md)

---

# AI Agent Reference

This section documents all available AI agents and skills for the TCG Engines project.

## AI-First Contribution Workflow

This project uses a multi-agent architecture where specialized agents handle different aspects of development:

- **Parallel execution** - Multiple agents can work simultaneously
- **Context preservation** - Main context stays clean while sub-agents handle tasks
- **Consistent procedures** - Skills ensure repeatable workflows

**See `CLAUDE.md` for the contribution workflow and coding standards.**

## Memory Bank System

The Memory Bank (`.ai_memory/`) is the development log system for AI contributions.

### Memory Bank Manager Agent

**Agent:** `memory-bank-manager`

Use this sub-agent to:
- Create new Memory Bank logs for features
- Update existing logs with progress
- Validate log completeness before PR

**Why sub-agent?** Keeps the main context clean while logging tasks run in parallel.

### Memory Bank Skill

**Command:** `/update-memory-bank`

Creates or updates a Memory Bank log following the standard template. Ensures all required sections are completed.

## The Gauntlet: 3-Agent Review

Your code will be reviewed by three specialized agents before merging:

| Agent | Focus | Standards |
|-------|-------|-----------|
| `gauntlet-linter` | Style, formatting, TypeScript | `.claude/rules/code-style.md` |
| `gauntlet-analyst` | Game logic, rules, patterns | `.claude/rules/domain-concepts.md` |
| `gauntlet-tech-lead` | Architecture, DRY, performance | `agent-os/product/philosophy.md` |

### Running The Gauntlet

Launch all 3 agents in parallel for comprehensive review:
```
Use Task tool with subagent_type for each:
- gauntlet-linter
- gauntlet-analyst
- gauntlet-tech-lead
```

## Development Agents

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| `code-reviewer` | General code review | After completing implementation |
| `debugger` | Investigate errors | When encountering bugs |
| `tdd-orchestrator` | TDD coordination | When starting new features |
| `test-runner` | Run and analyze tests | Before PR submission |
| `architect-review` | Architecture review | For significant changes |
| `backend-architect` | Backend design | New backend services |

## Documentation Agents

| Agent | Purpose |
|-------|---------|
| `api-documenter` | API documentation creation |
| `docs-architect` | Technical docs from codebase |
| `prompt-engineer` | Prompt engineering |

## Specialized Agents

| Agent | Purpose |
|-------|---------|
| `typescript-pro` | Advanced TypeScript |
| `sql-pro` | Database optimization |
| `graphql-architect` | GraphQL design |
| `error-detective` | Production errors |

## Agent OS Agents

Located in `.claude/agents/agent-os/`:

| Agent | Purpose |
|-------|---------|
| `spec-initializer` | Initialize spec folder |
| `spec-writer` | Create specifications |
| `spec-verifier` | Verify specs |
| `spec-researcher` | Gather requirements |
| `task-list-creator` | Strategic task lists |
| `api-engineer` | API endpoints |
| `ui-designer` | UI components |
| `database-engineer` | DB migrations |
| `testing-engineer` | Test coverage |
| `implementation-verifier` | E2E verification |

## Skills (Slash Commands)

| Command | Purpose |
|---------|---------|
| `/update-memory-bank` | Update Memory Bank log |
| `/review-pull-request` | Review PR comments |
| `/review-pr-comments` | Handle PR comments |
| `/fix-typescript` | Fix TS errors |
| `/fix-ci` | Fix CI issues |
| `/agent-os:new-spec` | New spec process |
| `/agent-os:create-spec` | Create spec |
| `/agent-os:implement-spec` | Implement spec |

## Quick Reference

### Invoke Agent
```
Use Task tool with subagent_type parameter
```

### Invoke Skill
```
Use /skill-name or Skill tool
```

### Agent Files
- General: `.claude/agents/`
- Agent OS: `.claude/agents/agent-os/`
- Skills: `.claude/commands/`

