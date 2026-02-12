# GitHub Copilot Instructions for Lorcanito

This repository is a **Disney Lorcana TCG simulator and card database** built as a Turborepo monorepo.

## Quick Reference

- **Runtime**: Bun 1.2.14 (not Node.js)
- **Framework**: Next.js 15, React 19, TypeScript (strict mode)
- **Monorepo**: Turborepo with apps (simulator, lorcanary, nakama, server) and packages (lorcana-engine, core-engine, persistence, shared)
- **Testing**: TDD required - write tests first, use `bun test`
- **State**: MobX for client state, Drizzle ORM + Instant DB for persistence

## Core Principles

Read these standards before making changes:

1. **Code Style**: `.agent-os/standards/code-style/`
   - `clean-code.md` - Meaningful names, single responsibility, DRY
   - `code-quality.md` - File-by-file changes, no apologies, preserve existing code
   - `typescript.md` - Strict mode, no `any` types
   - `react.md` - React 19 patterns
   - `next-js.md` - Next.js 15 conventions
   - `tailwind.md` - TailwindCSS patterns

2. **Development Workflow**: `CLAUDE.md` in root
   - Test-Driven Development (TDD) is mandatory
   - Run `bun run ci-check` before committing
   - Never run dev servers, DB migrations, or SQL commands without asking user
   - Make changes file-by-file

3. **Architecture**: `CLAUDE.md` + `.agent-os/product/tech-stack.md`

## Common Commands

```bash
# Testing
bun test                    # Run all tests
bun test "test name"        # Run specific test
bun run ci-check           # All checks (format, lint, types, test)

# Type checking
bun run check-types

# Linting/Formatting
bun run lint               # oxlint linter
bun run format             # oxfmt formatter
```

## App-Specific Context

When working in specific apps, check their documentation:

- **Simulator**: `apps/simulator/` - Main Next.js web app
- **Lorcanary**: `apps/lorcanary/` - Card database Next.js app
- **Nakama**: `apps/nakama/CLAUDE.md` - Game server (Goja runtime, no Node.js APIs)
- **Lorcana Engine**: `packages/lorcana-engine/CLAUDE.md` - Game rules implementation

## Additional Resources

- **LLM Documentation**:
  - `packages/persistence/src/drizzle/llm-full.txt` - Drizzle ORM docs
  - `packages/persistence/src/instant/llm-full.txt` - Instant DB docs

- **Product Specs**: `.agent-os/apps/{app-name}/specs/` - Feature specifications
- **Mission & Roadmap**: `.agent-os/product/` - Product context

## Critical Rules

❌ **Never**:
- Use `any` types or skip type safety
- Test implementation details (test public APIs only)
- Skip TDD (always write tests first)
- Run database migrations or SQL commands
- Add apologies or summaries in responses

✅ **Always**:
- Write tests before implementation (TDD)
- Use oxlint for linting
- Preserve existing code and functionality
- Make file-by-file changes
- Ask user before running long-running commands

