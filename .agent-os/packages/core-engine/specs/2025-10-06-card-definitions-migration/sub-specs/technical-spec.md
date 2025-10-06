# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/core-engine/specs/2025-10-06-card-definitions-migration/spec.md

> Created: 2025-10-06
> Version: 1.0.0

## Technical Requirements

### Type System Requirements

- All migrated card definition files must use explicit type annotations from lorcana-card-repository.ts
- Type checking must be validated individually per file using `tsc --noEmit <filename>`
- No type assertions (`as`), `any`, or `unknown` types are permitted
- Both card definition files and their corresponding test files must pass type checking

### Migration Pattern

- Card definitions must conform to one of: `LorcanaActionCardDefinition`, `LorcanaCharacterCardDefinition`, `LorcanaItemCardDefinition`, or `LorcanaLocationCardDefinition`
- All imports must use internal project paths starting with `~/game-engine/`
- Ability imports must be updated to reference the new ability system location
- Card definition structure must match the interfaces defined in lorcana-card-repository.ts (lines 60-150)

### Test Preservation Requirements

- Test files must not be modified in their logic or expectations
- If test imports fail, create corresponding exports in framework or test helpers
- If test types don't match, create stub type definitions to satisfy type checker
- Framework stubs only need to satisfy TypeScript, not implement actual functionality
- Test execution failures are acceptable during migration phase

### Migration Order

1. **Set 001 - Actions** (approximately 38 action card files)
2. **Set 001 - Characters** (all character card files in set 001)
3. **Set 001 - Items** (all item card files in set 001)
4. **Set 001 - Locations** (if any exist in set 001)
5. **Sets 002-009** - Repeat pattern for remaining sets

### Validation Process

For each migrated card file:

1. Update card definition to use new type from lorcana-card-repository.ts
2. Update imports to use internal project paths
3. Run `tsc --noEmit <card-definition-file>.ts` - must pass
4. Locate corresponding test file (if exists)
5. Run `tsc --noEmit <test-file>.spec.ts` or `<test-file>.test.ts` - must pass
6. If test file type checking fails, create necessary framework stubs
7. Document any new stubs created in framework

### Framework Stub Guidelines

- Create stubs in appropriate framework locations to maintain proper architecture
- Use minimal type definitions that satisfy the type checker
- Document stub locations for future implementation
- Avoid polluting production code with test-only stubs when possible
- Prefer test helper stubs for test-specific utilities

### Import Path Migration

**Old patterns to replace:**
- External imports from old engine locations
- Relative imports that span multiple directory levels
- Legacy ability system imports

**New patterns to use:**
- `~/game-engine/core-engine/` for core framework
- `~/game-engine/engines/lorcana/` for Lorcana-specific code
- Absolute imports from project root using `~` alias

### Type Safety Enforcement

- Leverage TypeScript's strict null checks
- Use discriminated unions where appropriate
- Ensure all required properties are present per interface definition
- Use optional chaining for optional properties
- Prefer type inference where types are obvious

### Performance Considerations

- Migration is file-by-file, allowing incremental progress
- Each file is independently type-checked, avoiding project-wide compilation
- No runtime behavior changes expected during migration
- Tests serve as regression suite for future framework implementation
