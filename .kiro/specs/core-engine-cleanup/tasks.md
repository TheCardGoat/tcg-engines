# Implementation Plan

- [ ] 1. Create centralized type definitions system
  - Create `core-types.ts` file with canonical type definitions
  - Include PlayerID, InstanceId, PublicId, ZoneId types
  - Add backward compatibility aliases for PlayerId and CardInstanceID
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Analyze and map current type usage across codebase
  - Use static analysis to identify all type definition locations
  - Create mapping of which files use which types
  - Document current import patterns and dependencies
  - _Requirements: 1.1, 1.2_

- [ ] 3. Update files to use centralized type definitions
  - Replace local PlayerID/PlayerId definitions with imports from core-types
  - Replace local InstanceId definitions with centralized imports
  - Update import statements to use type-only imports where appropriate
  - _Requirements: 1.2, 1.3, 1.4, 2.5_

- [ ] 4. Remove unused imports across all core-engine files
  - Use TypeScript compiler API to identify unused imports
  - Remove unused import statements systematically
  - Clean up import organization and grouping
  - _Requirements: 2.1, 2.4_

- [ ] 5. Remove unused exports and simplify re-export chains
  - Identify exports that are not imported anywhere
  - Remove unused export statements
  - Simplify complex re-export patterns in index files
  - _Requirements: 2.2, 2.4_

- [ ] 6. Eliminate circular dependencies
  - Map circular import chains using dependency analysis
  - Refactor circular dependencies by extracting shared types/interfaces
  - Update import statements to break circular references
  - _Requirements: 2.3_

- [ ] 7. Consolidate duplicate utility functions
  - Identify similar utility functions across different files
  - Create shared utility functions for common operations
  - Update callers to use consolidated utilities
  - _Requirements: 3.1, 3.4_

- [ ] 8. Extract shared validation logic
  - Identify duplicate validation patterns in context.ts and other files
  - Create reusable validation functions in utils/validation.ts
  - Update existing validation code to use shared functions
  - _Requirements: 3.2, 3.4_

- [ ] 9. Standardize error handling patterns
  - Review error creation and handling across files
  - Ensure consistent error types and message formatting
  - Update error handling to use consolidated error utilities
  - _Requirements: 3.3, 5.2, 5.3_

- [ ] 10. Create context factory utilities
  - Extract context creation patterns into shared factory functions
  - Create standardized context creation utilities in utils/context-factory.ts
  - Update context creation code to use factory functions
  - _Requirements: 3.4, 3.5_

- [ ] 11. Clean up card abstraction patterns
  - Document clear separation between CoreCardInstance and GameCard patterns
  - Consolidate duplicate card filtering logic
  - Ensure consistent interfaces for card operations
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 12. Remove unused error classes
  - Identify error classes that are not referenced in the codebase
  - Remove unused error types or mark them as @internal for future use
  - Update error type unions to exclude removed errors
  - _Requirements: 5.1, 5.5_

- [ ] 13. Consolidate overlapping error types
  - Identify error classes with similar purposes or overlapping functionality
  - Merge similar error types while preserving error information
  - Update error handling code to use consolidated error types
  - _Requirements: 5.1, 5.4_

- [ ] 14. Standardize error message formatting
  - Review error messages for consistency in format and information
  - Create standard templates for common error message patterns
  - Update error classes to use consistent message formatting
  - _Requirements: 5.2, 5.3_

- [ ] 15. Consolidate test utility functions
  - Identify duplicate test setup and utility functions
  - Create shared test helpers in __tests__/test-utils/
  - Update test files to use consolidated test utilities
  - _Requirements: 6.1, 6.4_

- [ ] 16. Standardize mock object creation
  - Create factory functions for commonly used mock objects
  - Standardize test engine configuration patterns
  - Update tests to use consistent mock creation patterns
  - _Requirements: 6.2, 6.3_

- [ ] 17. Remove unused test helper functions
  - Identify test helper functions that are not used
  - Remove unused test utilities and mock functions
  - Clean up test file imports and exports
  - _Requirements: 6.5_

- [ ] 18. Update public API exports
  - Review index.ts files for unused or unnecessary exports
  - Ensure all public APIs are properly exported
  - Maintain backward compatibility for existing public exports
  - _Requirements: 7.1, 7.3, 7.4_

- [ ] 19. Add backward compatibility type aliases
  - Create type aliases for any consolidated or renamed types
  - Add deprecation warnings for old type names
  - Document migration paths for deprecated types
  - _Requirements: 7.2, 7.5_

- [ ] 20. Run comprehensive test suite validation
  - Execute full test suite to ensure no functionality is broken
  - Run TypeScript type checking to catch any type errors
  - Validate that all public APIs continue to work as expected
  - _Requirements: 7.1, 7.4_

- [ ] 21. Update documentation and add cleanup summary
  - Document the consolidated type system and recommended patterns
  - Add clear guidance on card abstraction pattern selection
  - Create summary of changes made and migration guidance
  - _Requirements: 4.5, 7.5_