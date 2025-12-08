# Jules's Consolidated Coding Standards

This document contains all the coding standards that Jules, the technical lead, adheres to.

---

# Global Standards

## Coding style best practices

- **Consistent Naming Conventions**: Establish and follow naming conventions for variables, functions, classes, and files across the codebase
- **Automated Formatting**: Maintain consistent code style (indenting, line breaks, etc.)
- **Meaningful Names**: Choose descriptive names that reveal intent; avoid abbreviations and single-letter variables except in narrow contexts
- **Small, Focused Functions**: Keep functions small and focused on a single task for better readability and testability
- **Consistent Indentation**: Use consistent indentation (spaces or tabs) and configure your editor/linter to enforce it
- **Remove Dead Code**: Delete unused code, commented-out blocks, and imports rather than leaving them as clutter
- **Backward compatability only when required:** Unless specifically instructed otherwise, assume you do not need to write additional code logic to handle backward compatability.
- **DRY Principle**: Avoid duplication by extracting common logic into reusable functions or modules

---

## Code commenting best practices

- **Self-Documenting Code**: Write code that explains itself through clear structure and naming
- **Minimal, helpful comments**: Add concise, minimal comments to explain large sections of code logic.
- **Don't comment changes or fixes**: Do not leave code comments that speak to recent or temporary changes or fixes. Comments should be evergreen informational texts that are relevant far into the future.

---

## General development conventions

- **Consistent Project Structure**: Organize files and directories in a predictable, logical structure that team members can navigate easily
- **Clear Documentation**: Maintain up-to-date README files with setup instructions, architecture overview, and contribution guidelines
- **Version Control Best Practices**: Use clear commit messages, feature branches, and meaningful pull/merge requests with descriptions
- **Environment Configuration**: Use environment variables for configuration; never commit secrets or API keys to version control
- **Dependency Management**: Keep dependencies up-to-date and minimal; document why major dependencies are used
- **Code Review Process**: Establish a consistent code review process with clear expectations for reviewers and authors
- **Testing Requirements**: Define what level of testing is required before merging (unit tests, integration tests, etc.)
- **Feature Flags**: Use feature flags for incomplete features rather than long-lived feature branches
- **Changelog Maintenance**: Keep a changelog or release notes to track significant changes and improvements

---

## Error handling best practices

- **User-Friendly Messages**: Provide clear, actionable error messages to users without exposing technical details or security information
- **Fail Fast and Explicitly**: Validate input and check preconditions early; fail with clear error messages rather than allowing invalid state
- **Specific Exception Types**: Use specific exception/error types rather than generic ones to enable targeted handling
- **Centralized Error Handling**: Handle errors at appropriate boundaries (controllers, API layers) rather than scattering try-catch blocks everywhere
- **Graceful Degradation**: Design systems to degrade gracefully when non-critical services fail rather than breaking entirely
- **Retry Strategies**: Implement exponential backoff for transient failures in external service calls
- **Clean Up Resources**: Always clean up resources (file handles, connections) in finally blocks or equivalent mechanisms

---

## Validation best practices

- **Validate on Server Side**: Always validate on the server; never trust client-side validation alone for security or data integrity
- **Client-Side for UX**: Use client-side validation to provide immediate user feedback, but duplicate checks server-side
- **Fail Early**: Validate input as early as possible and reject invalid data before processing
- **Specific Error Messages**: Provide clear, field-specific error messages that help users correct their input
- **Allowlists Over Blocklists**: When possible, define what is allowed rather than trying to block everything that's not
- **Type and Format Validation**: Check data types, formats, ranges, and required fields systematically
- **Sanitize Input**: Sanitize user input to prevent injection attacks (SQL, XSS, command injection)
- **Business Rule Validation**: Validate business rules (e.g., sufficient balance, valid dates) at the appropriate application layer
- **Consistent Validation**: Apply validation consistently across all entry points (web forms, API endpoints, background jobs)

---

# Library Standards

---
description: API design principles for stable, maintainable library interfaces
globs: **/*.ts, **/index.ts
alwaysApply: true
---

# API Design Standards

## Public API Principles
- **Explicit Exports**: Only export what's intended for public consumption via index.ts barrel files
- **Stable Surface Area**: Keep public API minimal and focused - every export is a maintenance commitment
- **Clear Boundaries**: Distinguish between public API and internal implementation details
- **Single Responsibility**: Each exported function/class should have one clear purpose
- **Consistent Naming**: Follow consistent naming patterns across entire API surface
- **No Leaky Abstractions**: Don't expose internal implementation details in public types

## API Structure
- **Barrel Exports**: Use index.ts files to define clear entry points
- **Subpath Exports**: Organize related functionality into subpaths for modular consumption
- **Namespace Organization**: Group related functions/types under clear namespaces
- **Default Exports**: Avoid default exports - prefer named exports for better tree-shaking and refactoring
- **Re-exports**: Carefully consider what internal modules to re-export publicly

## Function Design
- **Options Objects**: Prefer options objects over multiple parameters for flexibility
- **Required vs Optional**: Make common parameters required, advanced options optional
- **Return Types**: Always use explicit return types for public functions
- **Error Handling**: Use consistent error handling strategy (throw, Result type, or error callbacks)
- **Pure Functions**: Prefer pure functions without side effects when possible
- **Overloads**: Use function overloads judiciously for type-safe variations

## Breaking Changes
- **Avoid Breaking Changes**: Treat any change to public API as potentially breaking
- **Deprecation Strategy**: Deprecate before removing - provide migration path
- **Semantic Versioning**: Follow semver strictly - major version for breaking changes
- **Backwards Compatibility**: Maintain backwards compatibility within major versions
- **Feature Flags**: Use feature flags for experimental APIs
- **Documentation**: Document all breaking changes in CHANGELOG and migration guides

## Type Safety
- **Branded Types**: Use branded types for domain-specific values (UserId, Email, etc.)
- **Discriminated Unions**: Leverage discriminated unions for type-safe variants
- **Generic Constraints**: Use appropriate generic constraints for type safety
- **Type Predicates**: Provide type guards for runtime type checking
- **Immutability**: Make types readonly by default to prevent mutations
- **Avoid Any**: Never expose `any` in public API types

## API Documentation
- **JSDoc Comments**: Document all public exports with JSDoc for IDE support
- **Type Descriptions**: Describe complex types and their purpose
- **Examples**: Include usage examples in JSDoc comments
- **Parameter Documentation**: Document each parameter's purpose and constraints
- **Return Documentation**: Clearly document what functions return
- **Throws Documentation**: Document exceptions that can be thrown

## API Evolution
- **Additive Changes**: Add new features without breaking existing ones
- **Extension Points**: Design for extension through composition, not modification
- **Stable Core**: Keep core functionality stable, innovate at edges
- **Experimental APIs**: Mark experimental features clearly and separate from stable API
- **Gradual Migration**: Provide smooth migration paths for deprecated features
- **Feedback Loop**: Gather consumer feedback before stabilizing new APIs

## Design Patterns
- **Builder Pattern**: Use for complex object construction
- **Factory Pattern**: Provide factory functions for common instantiation patterns
- **Strategy Pattern**: Allow behavior customization through strategies
- **Composition**: Favor composition over inheritance in public APIs
- **Dependency Injection**: Allow consumers to inject dependencies where appropriate
- **Fluent Interfaces**: Consider fluent APIs for sequential operations

## Common Pitfalls to Avoid
- **Over-abstraction**: Don't create abstractions before they're needed
- **API Sprawl**: Avoid exponential growth of public exports
- **Premature Optimization**: Design for clarity first, optimize later
- **Hidden Dependencies**: Don't rely on implicit global state or side effects
- **Tight Coupling**: Avoid coupling consumers to implementation details
- **Inconsistent Conventions**: Maintain consistency across entire API surface

---

---
description: Build standards for internal monorepo library packages
globs: **/*.config.js, **/*.config.ts, **/tsconfig.json
alwaysApply: true
---

# Build Standards for Monorepo Libraries

## Build Strategy
- **Clean Builds**: Always clean output directory before building (rm -rf dist/)
- **Reproducible Builds**: Ensure builds are deterministic and reproducible
- **Build Verification**: Run tests and type checks before building
- **Source Directory**: Keep source in `src/`, output in `dist/` if building
- **No Build Artifacts in Git**: Never commit build artifacts to version control
- **Build or No Build**: Consider whether packages need building or can be consumed directly from source

## Source Consumption (Recommended)
- **Direct Source Import**: Configure monorepo to import directly from `src/` directories
- **No Build Step**: Eliminate build step for faster development iteration
- **TypeScript Path Mapping**: Use TypeScript path aliases to reference packages
- **Example tsconfig.json**:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@tcg/core-engine": ["../../packages/engines/core-engine/src"],
        "@tcg/core-engine/*": ["../../packages/engines/core-engine/src/*"]
      }
    }
  }
  ```
- **Shared TypeScript Config**: Extend shared tsconfig from root for consistency

## TypeScript Configuration
- **Strict Mode**: Build with strict: true for maximum type safety
- **No Emit**: Use noEmit: true since building may not be necessary
- **Type Checking Only**: Use `tsc --noEmit` for type verification
- **Project References**: Consider TypeScript project references for large monorepos
- **Shared Config**: Extend shared tsconfig.json for consistency
- **Declaration Maps**: Enable declarationMap for IDE navigation

## Module Format
- **ESM Format**: Use ESM (ECMAScript Modules) as standard format
- **Type Field**: Set "type": "module" in package.json if using ESM
- **Consistent Format**: Use same module format across all monorepo packages
- **Import Extensions**: Be consistent with .js extensions in imports
- **Module Resolution**: Use "moduleResolution": "bundler" or "node16"

## Package.json Configuration
- **Main Entry Point**: Point to source directory if using direct imports
- **Exports Field**: Define exports pointing to source files
- **Types Field**: Point to source .ts files or generated .d.ts files
- **Example**:
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

## Build Scripts (If Building)
- **Build Script**: `tsc` or bundler command
- **Type Check**: `tsc --noEmit` for type checking
- **Watch Mode**: Support watch mode for development
- **Clean**: Script to clean build output
- **Check**: Combined script for format, lint, typecheck, test

## Monorepo Build Configuration
- **Shared Build Config**: Extend shared tsconfig for consistency
- **Workspace Dependencies**: Handle workspace:* protocol correctly
- **Build Order**: Respect dependency order if building
- **Parallel Builds**: Build independent packages in parallel using turborepo
- **Incremental Builds**: Only rebuild changed packages
- **Build Cache**: Share build cache across packages with turborepo

## Development Workflow
- **Fast Iteration**: Direct source imports enable instant feedback
- **Hot Reload**: Source changes reflect immediately without rebuild
- **Type Checking**: Run type checking separately from execution
- **Watch Mode**: Use tsc --watch for continuous type checking
- **Test Driven**: Run tests directly against source code

## Build Validation
- **Type Checking**: Verify types check across entire monorepo
- **Cross-Package Testing**: Run tests for all dependent packages
- **Import Validation**: Ensure imports resolve correctly
- **Circular Dependencies**: Detect and prevent circular dependencies
- **Build Success**: Verify monorepo builds successfully

## TypeScript Compilation (Optional)
- **When to Build**:
  - If consumers can't handle TypeScript directly
  - For optimized production builds
  - If using advanced TypeScript features not supported by runtime
- **TSC for Declarations**: Generate .d.ts files if needed
- **No Bundling**: Don't bundle - preserve module structure
- **Preserve Imports**: Keep imports external, don't bundle dependencies
- **Source Maps**: Generate source maps for debugging

## Performance Optimization
- **TypeScript Cache**: Enable incremental compilation
- **Build Cache**: Use turborepo for build caching
- **Skip Unnecessary Builds**: Only build what changed
- **Parallel Processing**: Run type checks and tests in parallel
- **Fast Tools**: Use fast tools (bun, swc, etc.) when possible

## CI/CD Integration
- **Automated Checks**: Run type checking and tests on every commit
- **Monorepo-Wide Validation**: Verify entire monorepo passes checks
- **Cache Dependencies**: Cache node_modules and build cache
- **Fail Fast**: Fail immediately on errors
- **Parallel Jobs**: Run independent checks in parallel

## File Organization
- **Source in src/**: All source code in src/ directory
- **Tests Co-Located**: Keep tests near source code
- **No Dist in Git**: Never commit dist/ or build output
- **Clear Structure**: Maintain clear, logical directory structure
- **Index Files**: Use index.ts for clean exports

## Common Configurations
- **Shared tsconfig.json**: Extend from root config
- **Shared Biome Config**: Extend from root biome.json
- **Shared ESLint**: Extend from root ESLint config if using
- **Shared Test Config**: Extend shared test configuration
- **Package Scripts**: Consistent scripts across packages

## Import Structure
- **Barrel Exports**: Use index.ts for clean package exports
- **Subpath Exports**: Define subpaths in package.json exports field
- **Type Exports**: Export types explicitly with `export type`
- **Clean API**: Only export what's intended for consumption
- **Internal Modules**: Mark internal modules clearly (e.g., _internal)

## Build Tools
- **TypeScript Compiler**: Use tsc for type checking
- **Turborepo**: Use for monorepo build orchestration
- **Bun**: Consider bun for fast TypeScript execution
- **Biome**: Use for formatting and linting
- **Test Runner**: Use bun test

## Platform Considerations
- **Node.js Version**: Specify minimum Node.js version in engines field
- **Runtime Environment**: Consider where code will execute
- **Module System**: Use ESM consistently
- **TypeScript Version**: Use recent TypeScript version across monorepo
- **Shared Dependencies**: Share dependency versions using workspace root

## Validation Checklist
- [ ] TypeScript types check without errors
- [ ] All tests pass across monorepo
- [ ] No circular dependencies
- [ ] Imports resolve correctly
- [ ] Shared configs properly extended
- [ ] Build cache working (if using turborepo)
- [ ] CI/CD validates entire monorepo
- [ ] Development workflow is fast (no unnecessary builds)

## Common Pitfalls
- **Unnecessary Building**: Don't build if direct source imports work
- **Slow Builds**: Optimize build process with caching
- **Wrong Entry Points**: Ensure package.json points to correct files
- **Missing Type Checks**: Always type check across packages
- **Ignoring Dependencies**: Respect dependency order in builds
- **Circular Dependencies**: Detect and eliminate circular deps
- **Inconsistent Config**: Keep configuration consistent across packages

---

---
description: Documentation standards for library packages
globs: **/README.md, **/*.md, **/*.ts
alwaysApply: true
---

# Documentation Standards

## README.md Structure
- **Title and Description**: Clear, concise description of what the library does
- **Badges**: Status badges (build, coverage, version, downloads, license)
- **Installation**: Clear installation instructions with package manager examples
- **Quick Start**: Minimal example showing basic usage
- **Features**: Bullet list of key features and capabilities
- **API Documentation**: Link to detailed API docs or include inline
- **Examples**: Multiple examples showing common use cases
- **Configuration**: Document configuration options if applicable
- **Contributing**: Link to CONTRIBUTING.md for contribution guidelines
- **License**: Specify license clearly

## Code Documentation
- **JSDoc Comments**: Document all public exports with JSDoc
- **Type Descriptions**: Describe complex types and their purpose
- **Parameter Documentation**: Document each parameter with @param tags
- **Return Documentation**: Document return values with @returns tags
- **Examples in Code**: Include @example tags with usage examples
- **Links**: Use @see tags to link related functionality
- **Deprecation**: Mark deprecated APIs with @deprecated tag and migration path

## API Documentation
- **Reference Documentation**: Complete API reference for all public exports
- **Type Documentation**: Full type information for TypeScript consumers
- **Method Signatures**: Clear function/method signatures with descriptions
- **Property Documentation**: Document all public properties and fields
- **Usage Examples**: Show real-world usage for each API
- **Edge Cases**: Document edge cases and limitations
- **Default Values**: Clearly state default values for optional parameters

## Usage Examples
- **Quick Start**: Minimal example for immediate value
- **Common Use Cases**: Examples for typical scenarios
- **Advanced Usage**: Examples showing advanced features
- **Integration Examples**: Show integration with popular frameworks/tools
- **Complete Examples**: Full working examples in examples/ directory
- **Code Comments**: Comment examples to explain what's happening
- **Runnable Examples**: Ensure examples actually work and are tested

## Guide Documentation
- **Getting Started**: Step-by-step guide for new users
- **Core Concepts**: Explain fundamental concepts and architecture
- **Recipes**: Common patterns and solutions
- **Best Practices**: Recommended approaches and patterns
- **Migration Guides**: Guide for upgrading between major versions
- **Troubleshooting**: Common issues and solutions
- **FAQ**: Frequently asked questions and answers

## Type Documentation
- **Type Exports**: Document all exported types clearly
- **Generic Parameters**: Explain generic type parameters and constraints
- **Type Examples**: Show type usage examples in JSDoc
- **Complex Types**: Break down complex types with explanations
- **Type Aliases**: Document why type aliases exist and when to use them
- **Utility Types**: Document custom utility types provided

## Configuration Documentation
- **Options Reference**: Complete reference for all configuration options
- **Default Configuration**: Document default values clearly
- **Configuration Examples**: Show common configuration patterns
- **Environment Variables**: Document any environment variables
- **Runtime Configuration**: Explain runtime configuration options
- **Validation**: Document configuration validation rules

## Integration Documentation
- **Framework Integration**: Document integration with popular frameworks (React, Vue, etc.)
- **Build Tool Setup**: Document bundler/build tool configuration
- **TypeScript Setup**: Document TypeScript configuration requirements
- **Compatibility**: Document compatibility with other libraries
- **Peer Dependencies**: Explain peer dependency requirements
- **Migration from Alternatives**: Guide from competing libraries

## Change Documentation
- **CHANGELOG.md**: Maintain comprehensive changelog
- **Breaking Changes**: Clearly document all breaking changes
- **Migration Guides**: Provide step-by-step migration instructions
- **Deprecation Notices**: Document deprecated features with alternatives
- **Release Notes**: Write clear release notes for each version
- **Upgrade Paths**: Document supported upgrade paths

## Error Documentation
- **Error Messages**: Document possible error messages
- **Error Handling**: Show how to handle errors properly
- **Error Types**: Document custom error types and when they're thrown
- **Troubleshooting**: Common errors and solutions
- **Debug Mode**: Document debugging features if available
- **Support Channels**: Where to get help with errors

## Performance Documentation
- **Performance Characteristics**: Document time/space complexity where relevant
- **Optimization Tips**: Best practices for performance
- **Benchmarks**: Include benchmark results if relevant
- **Bundle Size**: Document package size and impact
- **Tree-Shaking**: Explain tree-shaking support
- **Lazy Loading**: Document lazy loading capabilities

## Contributing Documentation
- **CONTRIBUTING.md**: Detailed contribution guidelines
- **Development Setup**: How to set up development environment
- **Code Style**: Code style requirements and linting setup
- **Testing**: How to run tests and add new tests
- **Pull Request Process**: PR requirements and review process
- **Release Process**: How releases are managed (for maintainers)
- **Code of Conduct**: Community guidelines and expectations

## Documentation Quality
- **Accuracy**: Keep documentation in sync with code
- **Completeness**: Document all public APIs comprehensively
- **Clarity**: Write clear, concise documentation
- **Examples**: Include examples for every major feature
- **Grammar**: Use proper grammar and spelling
- **Consistency**: Maintain consistent style and terminology
- **Up-to-Date**: Update docs with every release

## Documentation Tools
- **TypeDoc**: Consider TypeDoc for generating API documentation
- **Docusaurus**: Use for comprehensive documentation sites
- **JSDoc**: Use for inline code documentation
- **Markdown**: Use markdown for all documentation files
- **Code Playground**: Consider interactive code playgrounds
- **Search**: Implement search for large documentation sites

## Inline Comments
- **Public APIs Only**: Only JSDoc for public exports - avoid inline comments
- **Self-Documenting Code**: Prefer clear naming over comments
- **Complex Logic**: Comment only when logic is unavoidably complex
- **Why Over What**: Explain why, not what (code shows what)
- **TODO Comments**: Avoid in published code - use issue tracker
- **License Headers**: Include license headers if required

## Documentation Testing
- **Code Examples**: Test that all code examples work
- **Link Checking**: Verify all links work
- **Spelling**: Run spell checker on documentation
- **Type Checking**: Ensure TypeScript examples type-check
- **Build Docs**: Verify documentation builds without errors
- **Regular Review**: Review and update docs regularly

## Accessibility
- **Clear Language**: Use clear, simple language
- **Code Block Labels**: Label code blocks with language
- **Alt Text**: Include alt text for images
- **Semantic Structure**: Use proper heading hierarchy
- **Skip Links**: Consider skip navigation links
- **Screen Reader Friendly**: Test with screen readers if possible

## Internationalization
- **English First**: Primary documentation in English
- **Translation Support**: Consider i18n for wider adoption
- **Community Translations**: Allow community translations
- **Localization**: Localize examples and content appropriately
- **Language Switcher**: Implement language selection if multi-lingual

## Common Pitfalls
- **Outdated Examples**: Keep examples updated with API changes
- **Missing Edge Cases**: Document limitations and edge cases
- **Assumed Knowledge**: Don't assume prior knowledge
- **Over-Documentation**: Focus on what users need, not implementation details
- **Poor Examples**: Ensure examples are practical and realistic
- **Broken Links**: Regularly check for broken links
- **Inconsistent Terminology**: Use consistent terms throughout

---

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

---

---
description: Performance and optimization standards for library packages
globs: **/*.ts, **/package.json
alwaysApply: true
---

# Performance and Optimization Standards

## Bundle Size
- **Minimize Package Size**: Keep published package as small as possible
- **Exclude Development Files**: Never include dev files, tests, or configs in package
- **Analyze Bundle Size**: Use tools like bundlephobia to track size
- **Size Budgets**: Set and enforce bundle size budgets
- **Size Reporting**: Report bundle size in documentation and CI/CD
- **Compare Alternatives**: Benchmark against similar libraries

## Tree-Shaking
- **ESM Format**: Publish ESM format for optimal tree-shaking
- **Side Effects**: Set sideEffects: false if library has no side effects
- **Pure Annotations**: Use /*#__PURE__*/ annotations for functions with no side effects
- **No Default Exports**: Prefer named exports for better tree-shaking
- **Modular Structure**: Keep modules small and focused
- **Test Tree-Shaking**: Verify unused code is eliminated by bundlers

## Code Splitting
- **Subpath Exports**: Enable code splitting through subpath exports
- **Modular Entry Points**: Provide multiple entry points for different features
- **Lazy Loading Support**: Design APIs to support lazy loading
- **Dynamic Imports**: Support dynamic imports where appropriate
- **Feature Modules**: Split features into separate importable modules
- **Core vs Extensions**: Separate core from optional extensions

## Runtime Performance
- **Algorithmic Efficiency**: Use optimal algorithms and data structures
- **Avoid Premature Optimization**: Profile before optimizing
- **Fast Defaults**: Make default configuration performant
- **Lazy Initialization**: Defer expensive initialization until needed
- **Memoization**: Cache expensive computation results appropriately
- **Avoid Repeated Work**: Don't recalculate what can be cached

## Memory Management
- **Avoid Memory Leaks**: Clean up resources, event listeners, subscriptions
- **WeakMap/WeakSet**: Use weak references where appropriate
- **Release Resources**: Provide cleanup/dispose methods for stateful objects
- **Avoid Large Closures**: Minimize closure size and scope
- **Pool Objects**: Consider object pooling for frequently created objects
- **Monitor Memory**: Test for memory leaks with long-running scenarios

## Dependency Management
- **Minimize Dependencies**: Only include necessary dependencies
- **Evaluate Dependency Size**: Consider size of dependencies
- **Tree-Shakeable Dependencies**: Prefer dependencies that tree-shake well
- **Zero Dependencies**: Consider zero-dependency approach when feasible
- **Shared Dependencies**: Use peer dependencies for commonly shared packages
- **Dependency Audits**: Regularly audit and update dependencies

## Load Time Performance
- **Fast Initialization**: Minimize work during module initialization
- **Defer Side Effects**: Avoid side effects at module load time
- **Lazy Load Heavy Features**: Load expensive features on demand
- **Async Initialization**: Support async initialization patterns
- **Progressive Enhancement**: Load features progressively as needed
- **Preload Critical Resources**: Preload critical resources if applicable

## Build Optimization
- **Minification**: Generally let consumers handle minification
- **Dead Code Elimination**: Remove unreachable code during build
- **Constant Folding**: Fold constants at build time when possible
- **Inline Small Functions**: Consider inlining small, frequently used functions
- **Optimize Imports**: Structure imports for optimal tree-shaking
- **Build Performance**: Keep build times reasonable

## Type System Performance
- **Simple Types**: Avoid overly complex type computations
- **Recursive Type Limits**: Be mindful of recursive type depth
- **Type Compilation**: Ensure reasonable TypeScript compilation times
- **Type Caching**: Structure types to enable TypeScript caching
- **Conditional Type Complexity**: Limit conditional type complexity
- **Generic Constraints**: Use appropriate constraints to help inference

## API Performance
- **Efficient API Design**: Design APIs that enable efficient use
- **Batch Operations**: Provide batch APIs for bulk operations
- **Streaming Support**: Support streaming for large data sets
- **Pagination**: Support pagination for large result sets
- **Incremental Processing**: Enable incremental processing where applicable
- **Abort Support**: Support operation cancellation/abort

## Benchmarking
- **Performance Tests**: Include performance tests in test suite
- **Benchmark Suite**: Create benchmark suite for critical operations
- **Baseline Benchmarks**: Establish baseline performance metrics
- **Regression Detection**: Detect performance regressions in CI/CD
- **Comparative Benchmarks**: Compare against alternative implementations
- **Real-World Scenarios**: Benchmark realistic use cases

## Browser Performance
- **Main Thread**: Minimize main thread blocking
- **Web Workers**: Consider Web Worker support for heavy operations
- **RequestIdleCallback**: Use idle callbacks for non-critical work
- **Passive Event Listeners**: Use passive listeners where appropriate
- **Layout Thrashing**: Avoid layout thrashing in DOM operations
- **Paint Performance**: Minimize repaints and reflows

## Network Performance
- **CDN Delivery**: Consider CDN distribution for browser libraries
- **Compression**: Ensure gzip/brotli compression is effective
- **HTTP/2**: Optimize for HTTP/2 delivery
- **Resource Hints**: Support preload/prefetch hints
- **Caching Headers**: Recommend appropriate caching strategies
- **Incremental Loading**: Support incremental loading patterns

## Monitoring and Profiling
- **Performance Markers**: Use Performance API markers for profiling
- **Metrics Collection**: Collect key performance metrics
- **Profiling Support**: Make library easy to profile
- **Debug Mode**: Provide debug mode without performance overhead in production
- **Telemetry**: Consider optional performance telemetry
- **Performance Budget**: Set and track performance budgets

## Optimization Strategies
- **Lazy Evaluation**: Defer computation until results are needed
- **Caching**: Cache expensive computations and results
- **Batching**: Batch operations to reduce overhead
- **Debouncing/Throttling**: Provide utilities for rate limiting
- **Virtualization**: Support virtual lists/trees for large data sets
- **Incremental Updates**: Support incremental rather than full updates

## Documentation Performance
- **Document Performance**: Document performance characteristics
- **Big-O Notation**: Include time/space complexity where relevant
- **Performance Tips**: Provide performance best practices
- **Optimization Guide**: Guide consumers on optimization
- **Known Limitations**: Document known performance limitations
- **Benchmarks**: Share benchmark results and methodology

## Common Performance Pitfalls
- **Premature Optimization**: Don't optimize without profiling
- **Over-Engineering**: Keep it simple first, optimize later
- **Micro-Optimizations**: Focus on algorithmic improvements first
- **Unnecessary Dependencies**: Don't add dependencies without evaluation
- **Blocking Operations**: Avoid synchronous blocking operations
- **Memory Leaks**: Always clean up resources properly
- **Bundle Bloat**: Regularly audit and reduce bundle size

## Performance Testing
- **Load Testing**: Test with large data sets
- **Stress Testing**: Test under high load conditions
- **Memory Testing**: Test for memory leaks and growth
- **CPU Profiling**: Profile CPU usage for hot paths
- **Bundle Analysis**: Analyze bundle size and composition
- **Comparative Testing**: Compare against alternatives

## Platform Considerations
- **Node.js Performance**: Optimize for Node.js event loop
- **Browser Performance**: Optimize for browser rendering pipeline
- **Mobile Performance**: Consider mobile device constraints
- **Low-End Devices**: Test on low-end devices
- **Network Conditions**: Test on slow networks
- **Resource Constraints**: Handle limited memory/CPU gracefully

## Optimization Checklist
- [ ] Bundle size is minimal and documented
- [ ] Tree-shaking works correctly
- [ ] No memory leaks in long-running usage
- [ ] Fast initialization and load time
- [ ] Efficient algorithms and data structures
- [ ] Minimal and carefully chosen dependencies
- [ ] Performance tests in test suite
- [ ] Performance characteristics documented
- [ ] Benchmarks available for critical operations
- [ ] Performance regressions detected in CI/CD

## Advanced Optimizations
- **WASM Integration**: Consider WebAssembly for CPU-intensive operations
- **Worker Threads**: Use worker threads for parallel processing
- **Streaming APIs**: Implement streaming for large data processing
- **Incremental Computation**: Support incremental updates
- **Code Generation**: Generate optimized code at build time
- **JIT Optimization**: Structure code for JIT optimization

## Performance Culture
- **Profile Before Optimizing**: Always measure before optimizing
- **Performance Reviews**: Include performance in code reviews
- **Performance Metrics**: Track key performance indicators
- **Performance Goals**: Set clear performance objectives
- **Continuous Monitoring**: Monitor performance over time
- **User Experience**: Optimize for perceived performance

---

---
description: Testing standards for library packages from consumer perspective
globs: **/*.test.ts, **/*.spec.ts
alwaysApply: true
---

# Library Testing Standards

## Testing Philosophy
- **Test Behavior Not Implementation**: Focus on what the library does, not how it does it
- **Consumer Perspective**: Test from the consumer's point of view using public API only
- **Black Box Testing**: Treat library as a black box - test inputs and outputs
- **TDD Approach**: Write tests first to define expected behavior
- **Comprehensive Coverage**: Aim for 100% coverage through behavior tests, not line-by-line tests
- **Test Real Behavior**: Test actual use cases, not artificial scenarios

## Test Structure
- **Arrange-Act-Assert**: Follow AAA pattern for clarity
- **One Concept Per Test**: Test one behavior per test case
- **Descriptive Names**: Test names should describe behavior being tested
- **Test Organization**: Group related tests using describe blocks
- **Test Independence**: Each test should be independent and isolated
- **Setup and Teardown**: Use beforeEach/afterEach for test setup/cleanup

## Public API Testing
- **Import as Consumers Do**: Import library exactly as consumers would
- **Test Exported API**: Only test publicly exported functions/classes
- **No Internal Access**: Never import internal modules in tests
- **Test Entry Points**: Test main entry point and all subpath exports
- **Type Testing**: Verify TypeScript types work as expected
- **Export Validation**: Ensure all advertised exports exist and work

## Unit Testing
- **Pure Function Testing**: Test pure functions with various inputs
- **Edge Cases**: Test boundary conditions, empty inputs, null/undefined
- **Error Conditions**: Test error handling and exception scenarios
- **Type Constraints**: Test that TypeScript types enforce constraints
- **Return Values**: Verify correct return values for all scenarios
- **Side Effects**: Test observable side effects if any exist

## Integration Testing
- **Module Integration**: Test how exported modules work together
- **Real Dependencies**: Use real dependencies, avoid mocking when possible
- **Common Workflows**: Test complete workflows consumers will use
- **Framework Integration**: Test integration with target frameworks (React, Vue, etc.)
- **Build Output Testing**: Test against built output, not source
- **Cross-Module Testing**: Test interactions between subpath exports

## Consumer Scenario Testing
- **Real Use Cases**: Test actual scenarios consumers will encounter
- **Quick Start Example**: Test that quick start example works
- **Documentation Examples**: Ensure all documentation examples work
- **Common Patterns**: Test recommended patterns and best practices
- **Migration Scenarios**: Test migration paths from older versions
- **Framework Compatibility**: Test compatibility with target frameworks

## Type Testing
- **Type Assertions**: Use type assertions to test complex types
- **Generic Testing**: Test generic types with various type parameters
- **Type Inference**: Verify type inference works correctly
- **Type Narrowing**: Test type guards and narrowing functions
- **Utility Type Testing**: Test custom utility types
- **Compile-Time Verification**: Ensure invalid usage causes compile errors

## Error Handling Testing
- **Exception Testing**: Test that appropriate errors are thrown
- **Error Messages**: Verify error messages are helpful
- **Error Types**: Test custom error types are correctly thrown
- **Validation Testing**: Test input validation and error cases
- **Edge Case Errors**: Test error handling for edge cases
- **Recovery Testing**: Test error recovery mechanisms

## Mock Strategy
- **Minimize Mocking**: Avoid mocking internal implementation
- **Mock External Services**: Mock external APIs, databases, file systems
- **Test Doubles**: Use test doubles for expensive operations only
- **Real Objects Preferred**: Use real objects whenever practical
- **Mock Frameworks**: Use mocking only for external dependencies
- **Stub External Deps**: Stub peer dependencies if needed for isolation

## Test Data Patterns
- **Factory Functions**: Use factory functions for test data:
  ```typescript
  const createTestUser = (overrides?: Partial<User>): User => ({
    id: "test-id",
    name: "Test User",
    ...overrides
  });
  ```
- **Complete Objects**: Always create complete, valid objects
- **Partial Overrides**: Allow overriding specific properties
- **Reusable Fixtures**: Create reusable test data fixtures
- **Realistic Data**: Use realistic test data that resembles production
- **Edge Case Data**: Create specific data for edge case testing

## Performance Testing
- **Bundle Size**: Test that bundle size stays within limits
- **Memory Leaks**: Test for memory leaks in long-running scenarios
- **Large Data Sets**: Test performance with large data sets
- **Benchmark Tests**: Create benchmarks for critical operations
- **Regression Testing**: Detect performance regressions
- **Async Operations**: Test async operation performance

## Compatibility Testing
- **Node Version Matrix**: Test across supported Node.js versions
- **Browser Testing**: Test in target browsers if applicable
- **Framework Versions**: Test with different framework versions
- **TypeScript Versions**: Test with supported TypeScript versions
- **Module Systems**: Test both ESM and CommonJS if supporting both
- **Platform Testing**: Test on different platforms (Windows, Linux, macOS)

## Test Coverage
- **Behavior Coverage**: 100% behavior coverage, not just line coverage
- **Branch Coverage**: Ensure all code paths are tested
- **Edge Cases**: Cover all edge cases and boundaries
- **Error Paths**: Cover all error handling paths
- **Type Coverage**: Ensure types are exercised comprehensively
- **Coverage Tools**: Use coverage tools to identify untested code

## Test Organization
- **Co-Located Tests**: Keep tests near source code
- **Mirror Structure**: Mirror source structure in test structure
- **Test File Naming**: Use .test.ts or .spec.ts extensions
- **Grouped Tests**: Group related tests in describe blocks
- **Test Utilities**: Create test utilities in __tests__/utils/
- **Fixtures**: Store test fixtures in __tests__/fixtures/

## Regression Testing
- **Bug Tests**: Write tests for every bug fix
- **Version Testing**: Test backwards compatibility
- **Snapshot Testing**: Use snapshots for complex outputs (judiciously)
- **Visual Regression**: Test visual output if applicable
- **API Stability**: Test that public API remains stable
- **Breaking Change Detection**: Detect unintended breaking changes

## Continuous Testing
- **Watch Mode**: Support watch mode for rapid development
- **Fast Tests**: Keep tests fast (< 100ms per test ideal)
- **Parallel Execution**: Run tests in parallel when possible
- **CI Integration**: Run tests on every commit via CI/CD
- **Pre-Commit Hooks**: Run tests before commits
- **Coverage Thresholds**: Enforce minimum coverage thresholds

## Test Documentation
- **Test as Documentation**: Tests should document expected behavior
- **Clear Test Names**: Use descriptive test names that explain behavior
- **Arrange Comments**: Comment complex test setup if needed
- **Expected Behavior**: Make expected behavior obvious in assertions
- **Test Coverage Reports**: Generate and review coverage reports
- **Test Plan**: Document testing strategy and approach

## Test Maintenance
- **Refactor Tests**: Keep tests clean and maintainable
- **Remove Dead Tests**: Delete obsolete or redundant tests
- **Update Tests**: Update tests with API changes
- **Test Stability**: Ensure tests are not flaky
- **Test Performance**: Keep test suite execution time reasonable
- **Test Dependencies**: Minimize test dependencies

## Common Testing Pitfalls
- **Testing Implementation**: Don't test internal implementation details
- **Over-Mocking**: Avoid excessive mocking - use real objects
- **Brittle Tests**: Tests shouldn't break on refactoring
- **Unclear Tests**: Test names should clearly describe behavior
- **Slow Tests**: Keep tests fast for rapid feedback
- **Flaky Tests**: Eliminate non-deterministic test behavior
- **Missing Edge Cases**: Don't forget boundary conditions
- **Incomplete Coverage**: Achieve 100% behavior coverage

## Library-Specific Testing
- **Tree-Shaking**: Test that tree-shaking works correctly
- **Side Effects**: Verify sideEffects field is accurate
- **Export Testing**: Test all exports are accessible
- **Type Export Testing**: Verify type exports work correctly
- **Subpath Testing**: Test all subpath exports independently
- **Peer Dependency Testing**: Test with different peer dependency versions
- **Bundle Testing**: Test that package bundles correctly in consumer projects

## Test Environment
- **Test Runner**: Use modern test runner (Bun Test)
- **Assertion Library**: Use clear assertion syntax
- **Test Isolation**: Ensure proper test isolation
- **TypeScript Support**: Full TypeScript support in tests
- **Mock Timers**: Use mock timers for time-dependent tests
- **Test Reporters**: Use appropriate test reporters for CI/CD

---

---
description: TypeScript type system standards for library packages
globs: **/*.ts, **/*.d.ts, **/tsconfig.json
alwaysApply: true
---

# TypeScript Type Standards for Libraries

## Type Declaration Strategy
- **Include Declarations**: Always ship .d.ts files with library packages
- **Declaration Maps**: Generate declarationMap for better IDE navigation to source
- **Source Maps**: Include source maps for debugging consumer applications
- **Types Entry Point**: Specify "types" field in package.json pointing to main .d.ts file
- **Export Declarations**: Ensure all public exports have corresponding type declarations

## TypeScript Configuration
- **Strict Mode**: Enable strict: true for maximum type safety
- **Target**: Use modern target (ES2020+) and let consumers transpile if needed
- **Module System**: Use ESNext for modules, let bundlers handle compatibility
- **Declaration**: Always set declaration: true and declarationMap: true
- **Skip Lib Check**: Set skipLibCheck: true to avoid issues with external type definitions
- **No Emit**: Consider noEmit: true for libraries using separate build tools

## Type Exports
- **Explicit Type Exports**: Export types explicitly, don't rely on type inference alone
- **Type-Only Exports**: Use `export type` for type-only exports to optimize bundles
- **Avoid Re-exporting Implementation**: Don't export internal types through public API
- **Namespace Types**: Group related types under namespaces when appropriate
- **Barrel Type Exports**: Export types through index.ts barrel files for clean imports

## Type Design Patterns
- **Branded Types**: Use branded types for domain-specific primitives:
  ```typescript
  type UserId = string & { readonly brand: unique symbol };
  ```
- **Discriminated Unions**: Leverage tagged unions for type-safe variants:
  ```typescript
  type Result<T, E> =
    | { success: true; data: T }
    | { success: false; error: E };
  ```
- **Utility Types**: Use TypeScript utility types (Pick, Omit, Partial, Required, etc.)
- **Generic Constraints**: Apply appropriate generic constraints for type safety
- **Template Literal Types**: Use for string literal patterns when appropriate

## Type Safety Best Practices
- **Avoid Any**: Never expose `any` in public API types - use `unknown` if needed
- **No Type Assertions**: Minimize type assertions (as) in public API
- **Readonly by Default**: Make properties readonly unless mutation is intended
- **Const Assertions**: Use `as const` for literal types and immutable objects
- **Non-Nullable Types**: Leverage strictNullChecks for null safety
- **Index Signatures**: Use index signatures cautiously - prefer mapped types

## Advanced Type Features
- **Conditional Types**: Use for complex type transformations
- **Mapped Types**: Create derived types through mapping
- **Template Literals**: Leverage for string manipulation at type level
- **Recursive Types**: Use carefully for tree-like structures
- **Tuple Types**: Use for fixed-length arrays with different types
- **Type Predicates**: Provide type guards for runtime type narrowing

## Type Documentation
- **JSDoc for Types**: Document complex types with JSDoc comments
- **Type Parameter Documentation**: Explain generic type parameters
- **Example Usage**: Show type usage examples in comments
- **Constraints Documentation**: Document generic constraints and why they exist
- **Utility Type Exports**: Export useful utility types consumers might need

## Peer Dependency Types
- **Framework Types**: Include framework types in peerDependencies (e.g., @types/react)
- **Optional Types**: Use peerDependenciesMeta to mark optional type dependencies
- **Version Compatibility**: Specify compatible type definition versions
- **Bundled Types**: Consider bundling minimal type definitions for better DX

## Common Type Issues
- **Circular Dependencies**: Avoid circular type references that cause issues
- **Type Bloat**: Keep type definitions lean - avoid unnecessary complexity
- **Breaking Type Changes**: Treat type changes as breaking changes
- **Type Inference**: Don't over-rely on inference for public API types
- **Declaration Merging**: Use carefully - can cause confusion
- **Module Augmentation**: Document clearly when augmenting external modules

## Type Testing
- **Type-Level Tests**: Test complex types with type assertions
- **Compile-Time Checks**: Ensure types compile correctly with consumer patterns
- **IDE Support**: Verify type hints work correctly in IDEs
- **Type Compatibility**: Test type compatibility across versions
- **Generic Type Tests**: Test generic types with various type parameters

## Library-Specific Type Patterns
- **Options Objects**: Define comprehensive option types with sensible defaults
- **Plugin Interfaces**: Define clear interfaces for extension points
- **Event Types**: Type events and handlers precisely
- **State Types**: Model state transitions with discriminated unions
- **Builder Patterns**: Type fluent builder interfaces correctly
- **Factory Functions**: Return properly typed instances from factories

## Type Versioning
- **Stable Type Exports**: Keep public types stable across minor versions
- **Type Evolution**: Add optional properties, never make required optional
- **Deprecation**: Mark deprecated types with @deprecated JSDoc tag
- **Type Aliases**: Use type aliases to maintain backwards compatibility
- **Major Version Changes**: Reserve breaking type changes for major versions

## Performance Considerations
- **Type Complexity**: Keep types simple enough for reasonable compile times
- **Recursive Type Limits**: Be mindful of recursive type depth
- **Inferred Types**: Don't force TypeScript to infer overly complex types
- **Type-Only Imports**: Use `import type` to avoid runtime overhead
- **Declaration File Size**: Keep .d.ts files reasonably sized

---

---
description: Internal versioning and API stability standards for monorepo library packages
globs: **/package.json, **/CHANGELOG.md
alwaysApply: true
---

# Internal Versioning Standards

## Monorepo Context
- **Internal Consumption Only**: Packages are consumed only within the monorepo
- **Workspace Protocol**: Use `workspace:*` for all internal dependencies
- **No External Publishing**: Packages are not published to npm registry
- **Version Field**: Keep version field for package identification (e.g., "1.0.0")
- **Static Versioning**: Version changes are not required for internal changes

## Breaking Changes
- **What Constitutes Breaking**:
  - Removing public exports or functions
  - Changing function signatures or return types
  - Modifying behavior that other packages depend on
  - Removing or renaming public properties/methods
  - Changing peer dependency requirements
- **Communicate Changes**: Document breaking changes in package's CHANGELOG or documentation
- **Coordinate Updates**: Update all consuming packages in same commit/PR when breaking
- **Deprecation Optional**: Deprecation is optional for internal packages but recommended for major refactors
- **Batch Breaking Changes**: Group related breaking changes to minimize disruption

## Workspace Dependencies
- **Always Use workspace:***: Reference internal packages with `workspace:*` protocol
- **No Version Constraints**: Don't specify version ranges for internal packages
- **Automatic Resolution**: Monorepo tools automatically resolve to local packages
- **Example**:
  ```json
  {
    "dependencies": {
      "@tcg/shared": "workspace:*",
      "@tcg/core-engine": "workspace:*"
    }
  }
  ```

## Change Documentation
- **CHANGELOG.md (Optional)**: Maintain changelog for significant changes if helpful
- **Git History**: Primary source of truth for change history
- **PR Descriptions**: Document changes clearly in pull request descriptions
- **Breaking Change Notes**: Highlight breaking changes in commit messages and PRs
- **Migration Notes**: Provide migration guidance when refactoring public APIs

## API Stability
- **Stable APIs**: Clearly mark which APIs are stable vs experimental
- **Internal-Only Exports**: Mark internal exports clearly (e.g., `_internal` prefix)
- **Public API Surface**: Define and minimize public API surface
- **Backward Compatibility**: Maintain compatibility when practical, but not required
- **Rapid Iteration**: Internal packages can iterate quickly without version constraints

## Change Communication
- **Team Communication**: Communicate breaking changes to team via PR/Slack
- **Documentation Updates**: Update docs when changing public APIs
- **Type Safety**: Leverage TypeScript to catch breaking changes at compile time
- **Test Coverage**: Comprehensive tests help identify breaking changes
- **Monorepo-Wide Testing**: Run all tests to verify no breakage across packages

## Deprecation Strategy (Optional)
- **Mark as Deprecated**: Use `@deprecated` JSDoc tag for functions/exports
- **Provide Alternatives**: Document replacement APIs in deprecation notice
- **Console Warnings**: Optionally log warnings for deprecated API usage
- **Removal Timeline**: No strict timeline required - remove when ready
- **Coordinated Removal**: Remove after migrating all internal consumers

## Package Identification
- **Version Field**: Keep package.json version field for identification
- **Consistent Versioning**: Use consistent version across all packages (e.g., all "1.0.0")
- **No Version Bumps**: Version bumps not required for changes
- **Git Commits**: Use git history for tracking changes over time

## Development Workflow
- **Pre-Change Checklist**:
  - Search for all usages of API being changed
  - Identify all consuming packages
  - Plan updates to consuming packages
  - Update tests across affected packages
- **Make Changes**: Update package and all consumers in same PR
- **Verify Changes**: Run monorepo-wide tests and type checks
- **Document Changes**: Document breaking changes in PR description

## Type Changes
- **Breaking Type Changes**: Treat type signature changes as breaking
- **Type-Only Changes**: Changes to types affect consumers immediately
- **TypeScript Errors**: Use compiler errors to identify all affected code
- **Type Deprecation**: Use `@deprecated` tag on types being phased out
- **Type Migration**: Update all consumers when changing public types

## Common Patterns
- **Feature Flags**: Use feature flags for experimental APIs
- **Parallel APIs**: Keep old API while introducing new one temporarily
- **Adapter Pattern**: Provide adapters for migrating between major refactors
- **Incremental Migration**: Migrate consumers incrementally when possible
- **All-at-Once Changes**: Prefer updating everything in single PR for breaking changes

## Testing Coordination
- **Cross-Package Tests**: Ensure tests cover interactions between packages
- **Integration Tests**: Test package APIs as consumers would use them
- **Type Testing**: Verify types compile correctly in consuming packages
- **Build Verification**: Verify entire monorepo builds after changes
- **CI/CD Validation**: Let CI/CD catch breakages across packages

## Communication Best Practices
- **Clear PR Titles**: Mark PRs with breaking changes clearly
- **Migration Examples**: Show before/after examples in PR descriptions
- **Impact Assessment**: Document which packages are affected
- **Team Review**: Get review from maintainers of affected packages
- **Documentation Updates**: Update docs alongside code changes

## Common Pitfalls
- **Forgetting Consumers**: Always check for usages before changing APIs
- **Silent Breaking Changes**: Communicate all breaking changes clearly
- **Incomplete Migrations**: Update ALL consumers, don't leave any behind
- **Missing Type Updates**: Update type definitions alongside implementation
- **Poor Documentation**: Document the "why" behind major changes
- **Skipping Tests**: Always run full test suite after breaking changes
