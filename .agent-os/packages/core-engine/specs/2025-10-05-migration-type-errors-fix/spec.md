# Spec Requirements Document

> Spec: Migration Type Errors Fix
> Created: 2025-10-05

## Overview

Fix all 238 TypeScript type errors across 101 files in the core-engine migration by strategically commenting out old framework abilities in card definitions while properly fixing normal type errors (imports, references, missing properties) to achieve zero type errors and pass CI checks.

## User Stories

### CI/CD Pipeline Restoration

As a developer working on the migration, I want the CI pipeline to pass successfully, so that I can confidently merge code and ensure the codebase maintains type safety throughout the migration process.

**Detailed Workflow:**
1. Developer runs `bun run check-types` and sees 238 errors across 101 files
2. Developer identifies errors coming from card definitions referencing old patterns vs. normal type errors
3. For card definition errors: abilities using old patterns are commented out with clear markers
4. For normal errors: imports, type references, and missing properties are properly fixed
5. Developer re-runs `bun run check-types` and sees zero errors
6. Developer runs `biome check` and all linting passes
7. CI pipeline succeeds, allowing merge to proceed

### Code Reference Preservation

As a developer migrating to the new framework, I want old framework code preserved as comments with clear markers, so that I can reference the original implementation when building the new version.

**Detailed Workflow:**
1. Developer encounters a card definition with old pattern abilities
2. Instead of deleting, the ability code is commented out with `// MIGRATION_REF:` marker
3. Comment includes brief context about what the ability did
4. When implementing the new framework version, developer can easily find and reference the old code
5. Old patterns remain visible in git history and inline for quick reference

## Spec Scope

1. **Card Definition Ability Commenting** - Comment out abilities in card definition files (*.ts, *.test.ts, *.spec.ts) that reference old framework patterns with clear `// MIGRATION_REF:` markers
2. **Type Error Resolution** - Fix normal TypeScript errors including incorrect imports, missing type annotations, undefined references, and type mismatches
3. **Import Cleanup** - Remove or update imports that reference removed/renamed modules or exports
4. **Type Annotation Fixes** - Add missing type annotations where TypeScript requires them
5. **CI Validation** - Ensure `bun run check-types` passes with zero errors and `biome check` completes successfully

## Out of Scope

- Implementing new framework replacements for commented-out abilities (future work)
- Refactoring or improving existing code structure beyond fixing type errors
- Updating test assertions or test logic (unless required for type safety)
- Performance optimizations or code quality improvements unrelated to type errors
- Migration tracking documentation (can be added later if needed)

## Expected Deliverable

1. **Zero TypeScript Type Errors** - Running `bun run check-types` in packages/engines/core-engine produces zero errors
2. **Passing Biome Checks** - Running `biome check` completes successfully with no linting errors
3. **CI Pipeline Success** - All CI checks pass including type checking and linting stages

