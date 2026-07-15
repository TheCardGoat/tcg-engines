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
