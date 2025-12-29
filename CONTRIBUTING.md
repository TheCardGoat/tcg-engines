# AI-First Contribution Guidelines

## Philosophy

This codebase is a **Hybrid Intelligence Project**. While maintained by humans, the majority of development is performed by AI Agents. Our goal is to make contributions simple, safe, and organized by leveraging pre-configured AI workflows.

**The Golden Rule:** We prioritize **Architecture & Planning** over raw code generation.

### Core Principles

1. **Plan Before Code** - Every feature starts with a documented plan
2. **Early Feedback** - Get maintainer input before implementation
3. **Use Existing Tools** - Don't reinvent when Skills/Agents exist
4. **Quality Through Review** - The Gauntlet ensures consistent standards

## Project Structure

The project provides a suite of **Skills**, **Memory**, and **Sub-Agents** to assist contributors:

```
tcg-engines/
├── .ai_memory/           # Development logs (Memory Bank)
├── .claude/
│   ├── agents/           # Specialized AI agents
│   ├── commands/         # Slash commands
│   ├── rules/            # Coding standards
│   └── skills/           # Domain-specific skills
├── agent-os/
│   ├── product/          # Mission, roadmap, philosophy
│   └── standards/        # Technical standards
└── packages/             # Source code
```

### Before Writing Custom Code

Check if a solution already exists:

| Need | Check |
|------|-------|
| Code style guidance | `.claude/rules/code-style.md` |
| Game domain concepts | `.claude/rules/domain-concepts.md` |
| Error handling patterns | `.claude/rules/error-handling.md` |
| Lorcana card patterns | `.claude/skills/lorcana-cards/` |
| Lorcana game rules | `.claude/skills/lorcana-rules/` |
| Existing agent capabilities | `.claude/agents/` |

## The Contribution Workflow

### Phase 1: Plan & Memory Bank

Before writing any implementation code:

1. **Create Memory Bank Log**
   ```bash
   cp .ai_memory/TEMPLATE.md .ai_memory/<your-branch-name>.md
   ```

2. **Fill In Required Sections**
   - Context (date, branch, related issues)
   - Problem Statement (what needs to be solved)
   - Research & Analysis (codebase exploration notes)
   - Proposed Solution (approach, files to modify, alternatives)

3. **Document Decisions**
   - Why this approach over alternatives?
   - What patterns from the codebase are you following?
   - What are the risks and mitigations?

### Phase 2: The "Steering" PR

**This step is crucial for complex features.**

1. Open a Pull Request containing **only** the Memory Bank file
2. Title format: `[Plan] <feature-name>`
3. Request maintainer review

**Why?** This allows maintainers to:
- Course-correct before code is written
- Identify potential issues early
- Suggest better approaches
- Save everyone time

### Phase 3: Implementation

Once your plan is approved (or you have high confidence for smaller changes):

1. Follow the decisions documented in your Memory Bank
2. Update the Implementation Log as you work
3. Run checks before committing:
   ```bash
   bun run format
   bun run check-types
   bun test
   ```

### Phase 4: The Gauntlet

Your PR will be reviewed by three specialized AI agents. **Pre-empt their feedback** to ensure a smooth merge.

## The Gauntlet: 3-Agent Review

| Agent | Focus | Standards |
|-------|-------|-----------|
| **Linter** | Style, formatting, TypeScript | `.claude/rules/code-style.md` |
| **Analyst** | Game logic, rules, patterns | `.claude/rules/domain-concepts.md` |
| **Tech Lead** | Architecture, DRY, performance | `agent-os/product/philosophy.md` |

### Agent 1: The Linter

Validates:
- No `any` types (use `unknown` if needed)
- Proper import ordering
- Naming conventions (kebab-case files, PascalCase types)
- Biome formatting compliance
- No unused variables/imports

**Invoke:** Use the `gauntlet-linter` agent

### Agent 2: The Business Analyst

Validates:
- Game rules correctly implemented
- Owner vs Controller used correctly
- Zone transitions follow TCG rules
- Ability timing and triggers correct
- Calculations accurate

**Invoke:** Use the `gauntlet-analyst` agent

### Agent 3: The Tech Lead

Validates:
- Code in correct layer (core vs game engine)
- No unnecessary duplication (DRY)
- Immutable state updates via Immer
- Performant implementations
- Proper separation of concerns

**Invoke:** Use the `gauntlet-tech-lead` agent

## Quick Reference

### Commands

```bash
# Development
bun install          # Install dependencies
bun test             # Run all tests
bun run check-types  # TypeScript check
bun run format       # Format code
bun run lint         # Run linter

# CI Pipeline
bun run ci-check     # Run all checks
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore

Examples:
feat(core): add zone shuffling operation
fix(lorcana): correct damage calculation for resist
test(cards): add tests for keyword abilities
```

### Test-Driven Development

This project follows strict TDD:

1. **Write tests first** - Before implementing any feature
2. **Red-Green-Refactor** - Failing test → Make it pass → Clean up
3. **95%+ coverage** - Comprehensive test coverage required

## Resources

| Resource | Description |
|----------|-------------|
| [Development Process](agent-os/product/development-process.md) | How we build features |
| [Design Philosophy](agent-os/product/philosophy.md) | Why we make certain decisions |
| [Mission Statement](agent-os/product/mission.md) | Project goals and vision |
| [Roadmap](agent-os/product/roadmap.md) | Development phases |
| [Code Style](/.claude/rules/code-style.md) | Coding standards |
| [Domain Concepts](/.claude/rules/domain-concepts.md) | TCG terminology |

## Getting Help

- **Questions about workflow:** Check this document and `.ai_memory/README.md`
- **Questions about code style:** Check `.claude/rules/code-style.md`
- **Questions about game rules:** Check `.claude/skills/lorcana-rules/`
- **Questions about patterns:** Check `.claude/skills/lorcana-cards/PATTERNS.md`

## Summary

```
1. Create Memory Bank log (.ai_memory/<branch>.md)
2. Document plan and decisions
3. Open Steering PR (plan only) for complex features
4. Get maintainer feedback
5. Implement following your documented plan
6. Run The Gauntlet (3 agent reviews)
7. Submit final PR
```

**Remember:** Planning is not overhead - it's how we build quality software efficiently.
