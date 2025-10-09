---
description: Package.json configuration standards for internal monorepo library packages
globs: **/package.json
alwaysApply: true
---

# Package Configuration Standards

## Package Metadata
- **Name**: Use scoped packages (@org/package-name) for namespacing and organization
- **Version**: Keep static version for identification (e.g., "1.0.0") - no version bumping needed
- **Description**: Write clear, concise descriptions that explain what the library does
- **Private**: Set to true for internal monorepo packages (not published to npm)
- **License**: Specify a license (MIT, Apache-2.0, etc.) for internal documentation
- **Repository**: Include repository URL for reference

## Entry Points & Exports
- **Main Field**: Point to primary entry point in src/ directory (e.g., "src/index.ts")
- **Types Field**: Point to TypeScript entry point in src/ directory
- **Exports Field**: Use conditional exports for package structure:
  - Define explicit entry points for better encapsulation
  - Point exports directly to source files in src/
  - Use subpath exports for modular APIs (e.g., "./utils", "./core")
  - Example:
    ```json
    {
      "main": "src/index.ts",
      "types": "src/index.ts",
      "exports": {
        ".": {
          "types": "./src/index.ts",
          "default": "./src/index.ts"
        },
        "./utils": {
          "types": "./src/utils/index.ts",
          "default": "./src/utils/index.ts"
        }
      }
    }
    ```

## Dependencies Management
- **Dependencies**: List runtime dependencies required by the package
- **DevDependencies**: Keep build tools, test frameworks, and dev tooling separate
- **PeerDependencies**: Declare peer dependencies for:
  - Framework integrations (React, Vue, etc.)
  - Shared dependencies that should be provided by monorepo root
  - Libraries with singleton requirements
- **PeerDependenciesMeta**: Mark optional peer dependencies as optional
- **Workspace Dependencies**: Always use `workspace:*` protocol for internal packages:
  ```json
  {
    "dependencies": {
      "@tcg/shared": "workspace:*",
      "@tcg/core-engine": "workspace:*"
    }
  }
  ```

## Build Scripts
- **typecheck/check-types**: Verify TypeScript types without emitting (e.g., `tsc --noEmit`)
- **test**: Run full test suite
- **lint**: Run linter for code quality (e.g., `biome lint`)
- **format**: Format code consistently (e.g., `biome format`)
- **check**: Run all quality checks (format, lint, typecheck, test) - often orchestrated by turborepo
- **build**: Only include if package requires compilation (optional for direct source consumption)

## Configuration Best Practices
- **Private**: Always set to true for internal monorepo packages
- **SideEffects**: Declare side effects explicitly for tree-shaking optimization (false if pure)
- **Type**: Set to "module" for ESM-first packages
- **Engines**: Specify minimum Node.js version required
- **Workspaces**: Define workspaces at monorepo root, not in individual packages

## Monorepo Specific Fields
- **Workspace Protocol**: Use `workspace:*` for all internal dependencies
- **Consistent Versioning**: Keep version consistent (e.g., all packages at "1.0.0")
- **Shared Configuration**: Reference shared configs (tsconfig, biome, etc.) from root
- **No Publishing Config**: Remove publishConfig, prepack hooks, and npm-specific fields
- **Internal Only**: Mark clearly that package is for internal consumption

## Example Package.json
```json
{
  "name": "@tcg/core-engine",
  "version": "1.0.0",
  "private": true,
  "description": "Core TCG game engine for card game logic",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./lobby": {
      "types": "./src/lobby.ts",
      "default": "./src/lobby.ts"
    }
  },
  "scripts": {
    "check-types": "tsc --noEmit",
    "format": "biome format --write ./src",
    "lint": "biome lint --fix ./src",
    "test": "bun test",
    "check": "turbo format lint check-types test"
  },
  "dependencies": {
    "@tcg/shared": "workspace:*",
    "@tanstack/store": "0.7.0"
  },
  "devDependencies": {
    "@biomejs/biome": "2.0.4",
    "@types/bun": "1.2.14",
    "typescript": "5.8.3"
  },
  "peerDependencies": {
    "typescript": "5.8.3"
  }
}
```

## Fields to Avoid (Not Needed for Internal Packages)
- **publishConfig**: Not needed - packages aren't published externally
- **prepack/postpack**: Not needed - no npm publishing
- **files**: Not needed - entire package is available in monorepo
- **keywords**: Not needed - no npm discoverability concerns
- **homepage**: Optional - use if documenting package separately
- **bugs**: Optional - use issue tracker for entire monorepo
- **npmignore**: Not needed - no npm publishing

## TypeScript Configuration Reference
- **tsconfig.json**: Extend shared config from monorepo root
- **Path Mapping**: Reference packages via paths in root tsconfig
- **Project References**: Consider for large monorepos with many packages
- **Strict Mode**: Always enable strict TypeScript checking

## Dependency Version Management
- **Shared Dependencies**: Define common dependencies at monorepo root
- **Version Consistency**: Use consistent versions across all packages
- **Workspace Protocol**: Use `workspace:*` for internal package references
- **No Version Ranges**: Avoid version ranges for internal packages
- **Lock File**: Single lock file at monorepo root

## Common Configurations
- **Type Module**: Set "type": "module" for ESM packages
- **Side Effects**: Set "sideEffects": false if package is side-effect free
- **Engines**: Specify minimum Node.js version (e.g., "engines": { "node": ">=18.0.0" })
- **Package Manager**: Optionally specify package manager in root package.json

## Validation
- **Required Fields**: name, version, private, main, types, exports
- **Workspace Dependencies**: All internal dependencies use `workspace:*`
- **Entry Points**: All exports point to valid source files
- **Scripts**: Include check, test, typecheck scripts
- **Private Flag**: Always true for internal packages
