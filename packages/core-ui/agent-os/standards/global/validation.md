## Validation best practices

- **Component Prop Validation**: Use TypeScript interfaces and runtime prop validation to ensure components receive valid data
- **Client-Side Validation**: Provide immediate user feedback through form validation components and input sanitization
- **Fail Early**: Validate input props and user input as early as possible in the component lifecycle
- **Specific Error Messages**: Provide clear, field-specific error messages that help users correct their input
- **Allowlists Over Blocklists**: When possible, define what is allowed rather than trying to block everything that's not
- **Type and Format Validation**: Use TypeScript for static type checking and runtime validation for dynamic data
- **Sanitize User Input**: Sanitize user input to prevent XSS attacks in rendered content
- **Input Constraint Validation**: Validate component-specific constraints (e.g., card counts, game state validity)
- **Consistent Validation**: Apply validation consistently across all component interfaces and user interactions
