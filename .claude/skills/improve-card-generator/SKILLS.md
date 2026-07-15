---
name: improve-card-generator
description: Incrementally improves the Lorcana card generator by fixing parsing errors and adding support for new abilities. Use this skill when the user wants to "improve generator", "fix parsing errors", or "add support for X mechanic".
---

# Improve Card Generator Skill

## Overview

This skill guides you through the process of reducing the number of missing/unparseable cards in `packages/lorcana-cards`. You will identify failing cards, debug the parser, implement fixes, and verify the results.

## Prerequisites

- Working directory: `packages/lorcana-cards` or monorepo root.
- Access to `packages/lorcana-cards/src/parser/`.

## Workflow

### 1. Diagnose Missing Cards

First, identify which cards are currently failing to generate.

**Command:**
```bash
bun packages/lorcana-cards/scripts/list-missing-cards.ts
```

**Action:**
1.  Run the command.
2.  Analyze the output. Look for:
    *   **Common Error Messages**: "Syntax Error: Expected check-for-turn-action..."
    *   **Specific Mechanics**: "Exert chosen character...", "Move X damage..."
    *   **Clusters**: Multiple cards failing with the same error.

### 2. Select a Target

Choose **ONE** specific issue to focus on. Do not try to fix everything at once.

**Criteria for selection:**
- **High Impact**: Fixes multiple cards (e.g., a common effect pattern).
- **Specific Mechanic**: Implementing a missing keyword or ability type.
- **User Request**: specific card requested by the user.

**State your goal:**
> "I will fix the parsing error for 'move damage' effects, which affects 5 cards."

### 3. Debug the Parser

Isolate the failing text and understand *why* it fails.

**Create a reproduction script:**
Create or use `packages/lorcana-cards/scripts/debug-parser.ts` with the failing text.

```typescript
// packages/lorcana-cards/scripts/debug-parser.ts
import { parseAbilityText } from "../src/parser";

const text = "Your failing ability text here";
console.log("Parsing:", text);
const result = parseAbilityText(text);

if (result.success) {
  console.log("Success:", JSON.stringify(result.data, null, 2));
} else {
  console.error("Error:", result.error);
}
```

**Isolate the issue:**
1.  Run the debug script: `bun packages/lorcana-cards/scripts/debug-parser.ts`
2.  Trace the error in the parser code (`packages/lorcana-cards/src/parser/`).
    *   `effect-parser.ts`: Main effect logic.
    *   `condition-parser.ts`: `while`, `if` conditions.
    *   `cost-parser.ts`: Costs like check-cost, exertion.
3.  Identify if it's a **Lexing Error** (unknown token) or a **Parsing Error** (unexpected sequence).

### 4. Implement the Fix

Modify the parser code to support the new pattern.

**Strategies:**
- **New Keyword**: Add to `keyword-parser.ts` and `generators/parser-validator.ts`.
- **New Effect**: Add a new pattern to `effect-parser.ts`.
- **Refinement**: Adjust existing Regex or logic to be more flexible.

**Critical Rule**:
- **Do not break existing cards.**
- If changing a shared parser, run `bun test` in `packages/lorcana-cards` to ensure no regressions.

### 5. Verify

1.  **Run Debug Script**: Ensure your specific case now passes.
2.  **Run Missing List**: Run `list-missing-cards.ts` again. Confirm the count has decreased and your target cards are no longer listed.
3.  **Generate**: Run `generate-cards.ts` to fully generate the files (optional, can be done in batch later).

### 6. Repeat

Once the fix is verified, return to Step 1 or Step 2 to tackle the next issue.
