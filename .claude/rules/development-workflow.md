# Development Workflow

## Package Manager

**Always use Bun** for all package management:

```bash
# Install dependencies
bun install

# Add a package
bun add <package>

# Add a dev dependency
bun add -d <package>

# Remove a package
bun remove <package>
```

## Common Commands

### Development
```bash
# Run tests for all packages
bun test

# Run tests for specific package
bun test packages/core

# Type checking
bun run check-types

# Linting
bun run lint

# Formatting
bun run format
```

### CI Pipeline
```bash
# Run all checks (format, lint, type-check, test)
bun run ci-check
```

### Building
```bash
# Build all packages
bun run build
```

## Test-Driven Development (TDD)

This project follows strict TDD practices:

1. **Write tests first** - Before implementing any feature
2. **Red → Green → Refactor** cycle
3. **95%+ coverage target** - Comprehensive test coverage required
4. **Test behavior, not implementation** - Focus on observable outcomes

### TDD Workflow
1. Write a failing test that describes the expected behavior
2. Write the minimum code to make the test pass
3. Refactor while keeping tests green
4. Repeat

## Git Workflow

### Conventional Commits

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code restructuring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(core): add zone shuffling operation
fix(lorcana): correct damage calculation for resist
test(cards): add tests for keyword abilities
```

### Pre-commit Hooks

Lefthook runs automatically on commit:
- Biome formatting check
- Biome lint check
- Type checking

### Branch Strategy
- `main` - Production-ready code
- Feature branches for new work
- PRs require passing CI checks

## Directory Navigation

Always use absolute paths or run commands from project root:

```bash
# Good - from project root
bun test packages/core

# Good - with absolute path
bun test /path/to/tcg-engines/packages/core

# Avoid - changing directories
cd packages/core && bun test
```

## CI Requirements

Before merging any PR:
1. ✅ `bun run format` - Code is formatted
2. ✅ `bun run lint` - No lint errors
3. ✅ `bun run check-types` - TypeScript compiles
4. ✅ `bun test` - All tests pass

## Reference

- Setup guide: `agents.md`
- Development process: `agent-os/product/development-process.md`
