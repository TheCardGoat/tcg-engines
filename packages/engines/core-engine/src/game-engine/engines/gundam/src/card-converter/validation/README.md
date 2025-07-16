# Validation System Component

This component provides comprehensive validation and error handling to ensure conversion quality and type system compliance.

## Purpose

- Validate converted cards against enhanced type system
- Check game rule compliance and consistency
- Validate TypeScript compilation of generated files
- Provide error recovery and suggestion mechanisms

## Key Interfaces

- `ValidationSystem` - Main interface for validation functionality
- `ValidationRule` - Base interface for individual validation rules
- `CardValidator` - Validates individual cards against rules
- `SetValidator` - Validates consistency across card sets
- `TypeScriptValidator` - Validates generated file compilation

## Validation Rules

- `RequiredFieldValidator` - Ensures all required fields are present
- `TypeConsistencyValidator` - Validates field types and constraints
- `GameRuleValidator` - Checks compliance with game rules
- `AbilityValidator` - Validates ability structure and completeness

## Error Handling

- `ErrorHandler` - Categorizes and suggests fixes for errors
- `ErrorRecoveryStrategy` - Attempts automatic error recovery
- Field-level, ability-level, and card-level recovery strategies

## Usage

```typescript
const validationSystem = new ValidationSystem(config);
const result = await validationSystem.validateCard(card);
// Result contains validation status and any errors/warnings
```

## Features

- Comprehensive rule-based validation
- Error categorization by severity and type
- Automatic error recovery where possible
- TypeScript compilation validation
- Cross-reference validation (link requirements, etc.)
- Detailed validation reporting with metrics