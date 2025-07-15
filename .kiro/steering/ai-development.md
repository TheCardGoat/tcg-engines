# AI Development Guidelines

## Core Development Philosophy

### Test-Driven Development (TDD) - MANDATORY
- **NO PRODUCTION CODE** without a failing test first
- Follow Red-Green-Refactor cycle strictly:
  1. **Red**: Write failing test
  2. **Green**: Write minimal code to pass
  3. **Refactor**: Assess improvements, clean up if valuable
- Tests document expected behavior, not implementation details
- 100% coverage through business behavior testing

### TypeScript Strict Mode
- Full strict mode enabled (no `any`, no type assertions, no `@ts-ignore`)
- Rules apply to test code too
- Use branded types for domain safety
- Schema-first development with Zod

### Code Quality Standards
- Immutable data structures only
- Pure functions and composition over complexity
- Early returns, avoid deep nesting (max 2 levels)
- Self-documenting code - no comments except JSDoc for public APIs
- Use `logger.log` instead of `console.log`

## Specialized AI Workflows

### Lorcana Card Implementation
- **Semantic Analysis**: Extract core mechanics using [ACTION] + [CONDITION] + [TARGET] pattern
- **Similarity Matching**: Find top 3 similar cards from existing implementations
- **Confidence Scoring**: High (3+ matches), Medium (2 matches), Low (1 match + guess)
- **File Modification**: Replace `notImplemented: true` with generated abilities
- **Validation**: Run `bun run typecheck` and `bun test ${file_path}`

### Test Case Generation
- Use exact ability text as test descriptions
- Create separate `TestEngine` instances for different conditions
- Test through public API (black box testing)
- Include positive, negative, and edge cases
- Verify outcomes using `expect()` assertions on game state

### Error Resolution
- **Lint Errors**: Use Biome, target specific packages with `--filter`
- **Type Errors**: Fix within project boundaries only
- **Iterative Approach**: Fix, validate, repeat until clean

## Core Engine Development

### Architecture Principles
1. **Immutable State** - State changes create new objects
2. **Server-Authoritative** - Server holds definitive state
3. **Deterministic Logic** - Same inputs = same outputs
4. **Delta-Driven** - Games replay from initial state + actions
5. **Separation of Concerns** - Logic/rules/UI/services separated

### Required Checks
- `bun run check` must pass before task completion
- All new code must be covered by tests
- Update `IMPLEMENTATION-LOGS.md` with progress and decisions
- Follow architecture patterns in `/docs/**/*.md` files

### Development Workflow
1. Write failing test first
2. Implement minimal code to pass
3. Assess refactoring opportunities
4. Run `bun run check` - fix any issues
5. Update implementation logs
6. Commit with conventional format (`feat:`, `fix:`, `refactor:`)

## AI Assistant Prompts

### Available Specialized Prompts
- **Card Test Generation**: `.cursor/prompts/create-test-case-for-card.md`
- **Ability Implementation**: `.cursor/prompts/implement-card-abilities.md`
- **Lint Error Fixing**: `.cursor/prompts/prompt-fix-lint-errors.md`
- **Type Error Fixing**: `.cursor/prompts/prompt-fix-type-errors.md`
- **Prompt Improvement**: `.cursor/prompts/improve-prompt.mdc`

### Code Quality Rules
- Clean code guidelines always apply
- File-by-file changes with review opportunities
- No unnecessary apologies or confirmations
- Preserve existing code structures
- Provide real file links, not placeholders

## Testing Patterns

### Factory Functions
```typescript
const getMockPayment = (overrides?: Partial<Payment>): Payment => ({
  amount: 100,
  currency: "USD",
  status: "pending",
  ...overrides
});
```

### Behavior Testing
```typescript
// Test behavior through public API
it("declines payment when insufficient funds", () => {
  const payment = getMockPayment({ amount: 1000 });
  const account = getMockAccount({ balance: 500 });
  
  const result = processPayment(payment, account);
  
  expect(result.success).toBe(false);
  expect(result.error.message).toBe("Insufficient funds");
});
```

### Lorcana-Specific Testing
- Use `TestEngine` for game state setup
- Test card abilities through game actions
- Verify state changes with `expect()` assertions
- Include edge cases and invalid scenarios

## Documentation Requirements

### Implementation Logs
- Update `IMPLEMENTATION-LOGS.md` before/after each task
- Include progress, decisions, and learnings
- Share summary at task completion

### Code Documentation
- Self-documenting code preferred
- JSDoc for public APIs only
- Clear naming over explanatory comments
- Extract complex logic to well-named functions