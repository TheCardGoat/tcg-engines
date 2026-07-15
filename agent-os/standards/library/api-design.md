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
