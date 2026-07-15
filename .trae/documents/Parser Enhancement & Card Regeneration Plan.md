I will implement the "Next Steps" by enhancing the parser's coverage and then regenerating the card definitions.

### Phase 1: Parser Enhancements (Immediate)
I will update `action-parser.ts` and `target-parser.ts` to support more complex effects, specifically targeting the top unparsed patterns identified in the previous step.
1.  **Return to Hand (Bounce)**:
    - Update `action-parser.ts` to correctly handle "Return it to its owner's hand" and "Return X to hand".
    - Pattern: `Return ... to ... hand`.
2.  **Conditional Logic (Basic)**:
    - Update `action-parser.ts` to detect "If X, do Y" patterns.
    - Implement a `CONDITIONAL` action type in `action-parser.ts` that can split the text into a condition and an action (recursively parsing the action).
    - Support "If you have X..." and "If there are X...".
3.  **Complex Targeting**:
    - Improve `target-parser.ts` to handle "active/rested" state filters more robustly ("active enemy Unit").
    - Support "Set it as active" (Stand action).

### Phase 2: Verify Coverage
I will run the coverage validation script again to measure the improvement.
- Goal: Reduce the "Custom (Fallback)" rate further below 33%.

### Phase 3: Regenerate Card Definitions
I will execute the regeneration script to apply these changes to the codebase.
- Command: `bun packages/gundam-cards/scripts/regenerate-all-from-json.ts`
- This will update all files in `packages/gundam-cards/src/cards/` with the new structured data.

### Phase 4: Verification
I will check a few key generated files (e.g., cards with "Return to hand" effects) to ensure they are correctly structured.