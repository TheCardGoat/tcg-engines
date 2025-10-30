## Error handling best practices

- **User-Friendly Messages**: Provide clear, actionable error messages to users without exposing technical details
- **Fail Fast and Explicitly**: Validate component props early; fail with clear error messages rather than allowing invalid state
- **Specific Error Types**: Use specific error types rather than generic ones to enable targeted handling
- **Component Boundaries**: Handle errors at component boundaries rather than scattering try-catch blocks throughout component logic
- **Graceful Degradation**: Design components to degrade gracefully when optional features fail rather than breaking entirely
- **Error State Components**: Provide error state components and fallback UIs for better user experience
- **Event Handler Error Handling**: Properly handle errors in event handlers and async operations within components
