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
