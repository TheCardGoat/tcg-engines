---
description: Helper instruction for finding code standards and style guides
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Finding Code Standards and Style Guides

## Overview

This helper instruction provides specific paths and search strategies for locating code standards within the Agent OS structure.

## Code Standards Directory Structure

```
.agent-os/
├── standards/
│   ├── best-practices.md          # Core development principles
│   ├── code-style.md              # General formatting rules
│   ├── tech-stack.md              # Technology defaults
│   └── code-style/                # Language-specific guides
│       ├── clean-code.md          # Clean code guidelines
│       ├── code-quality.md        # Quality guidelines
│       ├── typescript.md          # TypeScript standards
│       ├── javascript-style.md   # JavaScript standards
│       ├── react.md               # React patterns
│       ├── next-js.md            # Next.js patterns
│       ├── html-style.md         # HTML formatting
│       ├── css-style.md          # CSS/Tailwind rules
│       └── tailwind.md           # Tailwind specifics
```

## Search Strategies

### Direct File Reading (Preferred)

Instead of searching with patterns, directly read specific files:

```
READ: .agent-os/standards/code-style/clean-code.md
READ: .agent-os/standards/code-style/typescript.md
```

### Avoid Broad Searches

DO NOT use these patterns as they find too many irrelevant files:
- `**/*style*.md` (finds node_modules files)
- `**/*.eslintrc*` (finds 96+ config files)
- `**/tsconfig*.json` (finds 98+ config files)

### Targeted Searches

If you must search, use targeted paths:
- `.agent-os/standards/**/*.md` (only Agent OS standards)
- `.agent-os/standards/code-style/*.md` (only style guides)

## Language-Specific Guide Mapping

### TypeScript/JavaScript Files (.ts, .tsx, .js, .jsx)
1. `.agent-os/standards/code-style/clean-code.md`
2. `.agent-os/standards/code-style/code-quality.md`
3. `.agent-os/standards/code-style/typescript.md`
4. `.agent-os/standards/code-style/javascript-style.md`

### React Components (.tsx, .jsx)
1. `.agent-os/standards/code-style/react.md`
2. `.agent-os/standards/code-style/typescript.md` (for .tsx)

### Next.js Pages/API Routes
1. `.agent-os/standards/code-style/next-js.md`
2. `.agent-os/standards/code-style/react.md`

### Service Classes
1. `.agent-os/standards/best-practices.md` (DRY, file structure)
2. `.agent-os/standards/code-style/typescript.md`
3. Memory: "Use abstract classes with static methods when possible" [[memory:7428304]]

### Test Files (.test.ts, .test.tsx)
1. `.agent-os/standards/code-style/clean-code.md` (testing section)
2. `.agent-os/standards/best-practices.md` (TDD approach)
3. `.agent-os/standards/code-style/typescript.md`

### HTML/CSS Files
1. `.agent-os/standards/code-style/html-style.md`
2. `.agent-os/standards/code-style/css-style.md`
3. `.agent-os/standards/code-style/tailwind.md` (if using Tailwind)

## Configuration Files to Ignore

These are project configuration files, not style guides:
- `biome.json` - Formatter config (12 files in project)
- `.eslintrc*` - Linter config (96+ files, mostly in node_modules)
- `tsconfig.json` - TypeScript config (98+ files)

Read these ONLY if you need to understand project-specific settings.

## Recommended Reading Order

1. **Always First:**
   - `.agent-os/standards/code-style/clean-code.md`
   - `.agent-os/standards/code-style/code-quality.md`

2. **Language-Specific:**
   - Read based on file extensions being worked on

3. **Feature-Specific:**
   - `.agent-os/standards/best-practices.md` for patterns

4. **Project-Specific:**
   - Check memories for project conventions
   - Example: Elysia.js patterns [[memory:7428304]]

## Example Context-Fetcher Request

```
"Please read the following code style files directly:
1. .agent-os/standards/code-style/clean-code.md
2. .agent-os/standards/code-style/code-quality.md
3. .agent-os/standards/code-style/typescript.md (for TypeScript files)
4. .agent-os/standards/code-style/react.md (for React components)

Do not search for style files, read them directly from the paths above."
```
