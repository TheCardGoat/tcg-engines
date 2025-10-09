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
