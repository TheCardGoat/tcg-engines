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
