---
title: "Development Guidelines for AI Agents"
type: "guidelines"
updated: "2025-06-25"
version: "1.0.0"
audience: "llm"
related_files: ["IMPLEMENTATION-LOGS.md", "ARCHITECTURE.md"]
status: "current"
---

## Must Follow Rules
- For every task, you must ask for confirmation before starting. Ask clarifications before starting.
- You can't take a task as finished if `bun run check` fails, all checks must pass and you can't skip any of them.
- You can't commit unless `bun run check` passes, and you can't skip any of the checks. Additionaly, any new codee must be covered by tests, which explains the expected behavior. Test expected behavior, not implementation details.
- Update IMPLEMENTATION-LOGS.md before/after each task with progress, decisions, and learnings
- Follow architecture/design patterns in /docs/**/*.md files
- Use test-driven development (TDD) - tests are specifications
- Avoid mocking/stubbing - use real objects
- Run `bun run check` after each task - fix issues before proceeding
- Use documentation from engines/** folder first (LLM-RULES.md, RULES.md, GLOSSARY.md)
- Follow core engine tenets
- DO not use console.log, Use logger.log instead of console.log. All all respective methods (warn, error, etc..)
- use IMPLEMENTATION-LOGS.md for task progress, decisions, and learnings. Share a summary of your progress at the end of each task.

## Core Architecture

Modular TCG engine with three main components:

1. **Lobby Engine** (`/src/lobby-engine/`) - Game lobbies, connections, event-driven with LightweightEventBus
2. **Game Engine** (`/src/game-engine/`) - Core rules, mutable state, phase/turn-based,  architecture

### State & Architecture
- mutable state with delta synchronization
- Server-authoritative with client optimistic updates
- Action flow: Client → Optimistic → Server → Validate → Broadcast deltas

### Documentation
- **RULES.md**: Complete reference with examples
- **LLM-RULES.md**: Concise structure for rule engine
- **Glossary.md**: Term definitions

## Core Tenets

1. **Mutable State** - State changes are directly mutated
2. **Replayable & Delta-Driven** - Games replay from initial state + actions
3. **Server-Authoritative** - Server holds definitive state
4. **Deterministic Logic** - Same inputs = same outputs
5. **Agnostic Core** - Engine unaware of specific game rules
6. **Clear APIs** - Well-defined action/query interfaces
7. **Separation of Concerns** - Logic/rules/UI/services separated
8. **Comprehensive Logging** - Structured, configurable telemetry
9. **Localized Communication** - Player text ready for i18n

# Development Guidelines

## Core Philosophy

**TEST-DRIVEN DEVELOPMENT IS NON-NEGOTIABLE.** Every line of production code must be written in response to a failing test.

**Key Principles:**
- Write tests first (TDD)
- Test behavior, not implementation
- No `any` types or type assertions
- Immutable data only
- Small, pure functions
- TypeScript strict mode
- Use real schemas/types in tests

**Tools:** TypeScript (strict), Bun test

## Testing Principles

### Behavior-Driven Testing
- Test behavior through public API (black box)
- No 1:1 test-to-implementation mapping
- 100% coverage via business behavior, not implementation details
- Tests document expected behavior

### Tools
- bun test
- TypeScript strict mode for test code too

### Test Data Pattern

Use factory functions with optional overrides:

```typescript
const getMockPayment = (overrides?: Partial<Payment>): Payment => ({
  amount: 100,
  currency: "USD",
  status: "pending",
  ...overrides
});
```

Principles: Complete objects with defaults, `Partial<T>` overrides, compose for complex objects

## TypeScript Guidelines

### Strict Mode
- Full strict mode enabled (no `any`, no type assertions, no `@ts-ignore`)
- Rules apply to test code too

### Type Definitions
- Prefer `type` over `interface`
- Leverage utility types (`Pick`, `Omit`, `Partial`, `Required`)
- Create branded types for domain safety:
```typescript
type UserId = string & { readonly brand: unique symbol };
```
- Schema-first with Zod/Standard Schema compliant libraries

### Schema-First Development

Define schemas first, derive types:

```typescript
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  tier: z.enum(["standard", "premium"]),
});

type User = z.infer<typeof UserSchema>;
```

**CRITICAL**: Tests must import real schemas from shared locations, never redefine them. This ensures type safety, consistency, and prevents drift.

## Code Style

### Functional Programming
- No data mutation - immutable structures
- Pure functions, composition over complexity
- Array methods (`map`, `filter`, `reduce`) over loops
- Avoid heavy FP abstractions unless clear benefit
- Use Result types for complex error handling

### Structure & Naming
- Early returns, avoid deep nesting (max 2 levels)
- Small, focused functions
- Functions: `camelCase` verbs
- Types: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.ts`

### Self-Documenting Code
No comments - use clear naming and structure. Extract complex logic to well-named functions.

```typescript
// Avoid
if (payment.amount > 100 && payment.card.type === "credit") {
  // Apply 3D secure for credit cards over £100
}

// Good
const requires3DSecure = (payment: Payment): boolean => 
  payment.amount > SECURE_PAYMENT_THRESHOLD && payment.card.type === "credit";
```

**Exception**: JSDoc for public APIs is acceptable.

### Options Objects
Default to options objects for function parameters. Only use positional for single-parameter functions or well-established patterns.

```typescript
// Good
type CreatePaymentOptions = {
  amount: number;
  currency: string;
  cardId: string;
};

const createPayment = (options: CreatePaymentOptions) => {
  // Clear, self-documenting
};

// Acceptable
const double = (n: number) => n * 2;
const users = items.map(item => item.user);
```

## Development Workflow

### TDD Process - MANDATORY

**Red-Green-Refactor:**
1. **Red**: Write failing test first - NO PRODUCTION CODE without failing test
2. **Green**: Write MINIMUM code to pass
3. **Refactor**: Assess improvements, clean up if valuable

**Violations to Avoid:**
- Production code without failing test
- Multiple tests before making first pass
- More code than needed for current test
- Skipping refactor assessment
- Adding untested functionality

#### TDD Example

```typescript
// 1. Red - Failing test
it("calculates total with shipping", () => {
  const order = { items: [{ price: 30 }], shipping: 5.99 };
  expect(processOrder(order).total).toBe(35.99);
});

// 2. Green - Minimal implementation
const processOrder = (order: Order) => ({
  ...order,
  total: order.items[0].price + order.shipping
});

// 3. Red - Next test
it("applies free shipping over £50", () => {
  const order = { items: [{ price: 60 }], shipping: 5.99 };
  expect(processOrder(order).total).toBe(60);
});

// 4. Green - Add conditional
// 5. Refactor - Extract helpers if beneficial
```

### Refactoring - Critical Third Step

Assess refactoring after every green - but only refactor if it adds clear value.

#### When to Refactor
- Names could be clearer
- Structure could be simpler
- True duplication of knowledge (not just similar code)
- Patterns emerge across features

**Remember**: Not all code needs refactoring. Don't change for change's sake.

#### Refactoring Guidelines

1. **Commit before refactoring** - safe rollback point
2. **Abstract by semantic meaning, not structure** - duplicate code is cheaper than wrong abstraction
3. **Questions before abstracting:**
    - Same concept or just similar structure?
    - Would business rule changes affect both?
    - Based on what code IS or what it MEANS?

**Key**: Easier to create abstraction later than undo wrong one.

### Understanding DRY

DRY = Don't repeat **knowledge**, you can repeat similar-looking code.

```typescript
// NOT DRY violation - different business knowledge
const validateUserAge = (age: number) => age >= 18 && age <= 100;
const validateRating = (rating: number) => rating >= 1 && rating <= 5;
// Different domains that may evolve independently

// IS DRY violation - same knowledge duplicated
const FREE_SHIPPING_THRESHOLD = 50; // Extract shared business rule
const calculateShippingCost = (total: number) => 
  total > FREE_SHIPPING_THRESHOLD ? 0 : 5.99;
```

### Refactoring Rules

1. **Never break external APIs** - only change internals
2. **Verify after refactoring:**
    - All tests pass without modification
    - Linting and type checking pass
    - Commit refactoring separately

```bash
bun run check
git commit -m "refactor: extract helpers"
```

#### Refactoring Checklist
- [ ] Actually improves code
- [ ] Tests pass without modification
- [ ] Static analysis passes
- [ ] No new public APIs
- [ ] More readable
- [ ] Removed knowledge duplication (not code similarity)
- [ ] No speculative abstractions
- [ ] Committed separately

### Commit & PR Standards

**Commits:** Complete working changes, conventional format (`feat:`, `fix:`, `refactor:`), include tests with features

**PRs:** All tests/linting pass, small increments, single focus, describe behavior changes


### Expectations
1. **ALWAYS FOLLOW TDD** - No production code without failing test
2. Think deeply, understand full context
3. Always Ask clarifying questions
4. Think from first principles
5. Assess refactoring after every green
6. Keep docs current
7. Ensure checks are passing

### Code Changes
- Start with failing test - no exceptions
- Assess refactoring after green
- Verify tests/analysis pass, then commit
- Respect existing patterns
- Small, incremental changes
- Meet TypeScript strict requirements

### Communication
- Explain trade-offs and design decisions
- Flag deviations with justification
- Ask for clarification when unsure
- Always ask for clarification on prompts, this ensures you are not missing any information and that you are not making incorrect assumptions.

## Example Patterns

### Error Handling
```typescript
// Result type pattern
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Or early returns with exceptions
const processPayment = (payment: Payment) => {
  if (!isValidPayment(payment)) {
    throw new PaymentError("Invalid payment");
  }
  return executePayment(payment);
};
```

### Testing Behavior
```typescript
// Good - test behavior through public API
describe("PaymentProcessor", () => {
  it("declines payment when insufficient funds", () => {
    const payment = getMockPayment({ amount: 1000 });
    const account = getMockAccount({ balance: 500 });
    
    const result = processPayment(payment, account);
    
    expect(result.success).toBe(false);
    expect(result.error.message).toBe("Insufficient funds");
  });
});

// Avoid - testing implementation details
```
