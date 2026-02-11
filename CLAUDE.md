# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## AI-First Contribution Workflow

This codebase is a **Hybrid Intelligence Project**. While maintained by humans, most development is performed by AI Agents. We prioritize **Architecture & Planning** over raw code generation.

### The Golden Rule: No Code Without Logs

Before writing implementation code, you **must** create or update a Memory Bank log:

```bash
cp .ai_memory/TEMPLATE.md .ai_memory/<feature-branch>.md
```

### Workflow

1. **Plan** - Create Memory Bank log with your approach
2. **Steering PR** - For complex features, submit plan-only PR first
3. **Implement** - Follow your documented plan
4. **Gauntlet** - Pre-empt the 3-agent review

## Key Commands

```bash
# Development
bun install          # Install dependencies
bun test             # Run all tests
bun run check-types  # TypeScript check
bun run format       # Format code (Oxc formatter)
bun run lint         # Run linter

# CI Pipeline
bun run ci-check     # Run all checks
```

## Code Style Requirements

- **No `any` types** - Use `unknown` if truly unknown
- **Type-only imports** - `import type { ... }`
- **Branded types** - `CardId`, `PlayerId`, `ZoneId`
- **Immutable state** - All changes via Immer
- **TDD** - Write tests first, 95%+ coverage target

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `card-instance.ts` |
| Types | PascalCase | `CardInstance` |
| Functions | camelCase | `createCard()` |
| Constants | SCREAMING_SNAKE | `MAX_HAND_SIZE` |

### Import Order

1. Type-only imports (`import type`)
2. External packages
3. Internal packages (`@tcg/core`)
4. Relative imports

## Project Structure

```
tcg-engines/
├── .ai_memory/           # Memory Bank (development logs)
├── .claude/
│   ├── agents/           # Specialized AI agents
│   ├── commands/         # Slash command skills
│   ├── rules/            # Coding standards
│   └── skills/           # Domain-specific knowledge
├── .cursor/rules/        # Cursor AI configuration
├── agent-os/
│   ├── product/          # Mission, roadmap, philosophy
│   └── standards/        # Technical standards
└── packages/             # Source code
```

## The Gauntlet: 3-Agent Review

Your code will be reviewed by three specialized agents:

| Agent | Focus | Invoke |
|-------|-------|--------|
| **Linter** | Style, formatting, TypeScript | `gauntlet-linter` |
| **Analyst** | Game logic, rules, patterns | `gauntlet-analyst` |
| **Tech Lead** | Architecture, DRY, performance | `gauntlet-tech-lead` |

## Architecture Principles

### Game Engine vs Core Engine

**Game Engine contains:**
- Card definitions and abilities
- Game-specific move implementations
- Rule-specific validations

**Core Engine contains:**
- Move validation framework
- Zone management
- State management (Immer)
- Network synchronization

### Key Pattern

```typescript
// Use core zone operations
moveCard(state, { from: 'hand', to: 'field', cardId });

// NOT manual manipulation
state.hand.splice(index, 1);
```

## Available Skills & Agents

See `agents.md` for the complete reference of available agents and skills.

### Quick Reference

| Need | Resource |
|------|----------|
| Code style | `.claude/rules/code-style.md` |
| TCG concepts | `.claude/rules/domain-concepts.md` |
| Error handling | `.claude/rules/error-handling.md` |
| Lorcana cards | `.claude/skills/lorcana-cards/` |
| Lorcana rules | `.claude/skills/lorcana-rules/` |
| Philosophy | `agent-os/product/philosophy.md` |

## Testing

This project follows strict TDD:

1. **Write tests first** - Before implementing
2. **Red-Green-Refactor** - Failing test → Pass → Clean up
3. **95%+ coverage** - Comprehensive coverage required

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore

Example: feat(core): add zone shuffling operation
```
