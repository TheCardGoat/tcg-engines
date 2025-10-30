## Test coverage best practices

- **Strategic Testing Approach**: Write tests for core component behavior, user interactions, and critical paths. Balance comprehensive coverage with development velocity.
- **Test Only Core User Flows**: Write tests exclusively for critical paths and primary user workflows. Skip writing tests for non-critical utilities and secondary workflows until if/when you're instructed to do so.
- **Defer Edge Case Testing**: Do NOT test edge cases, error states, or validation logic unless they are business-critical. These can be addressed in dedicated testing phases, not during feature development.
- **Test Behavior, Not Implementation**: Focus tests on what the code does, not how it does it, to reduce brittleness
- **Clear Test Names**: Use descriptive names that explain what's being tested and the expected outcome
- **Mock External Dependencies**: Isolate units by mocking databases, APIs, file systems, and other external services
- **Fast Execution**: Keep unit tests fast (milliseconds) so developers run them frequently during development
