# Lorcana Card Prompts

Use these as reusable request templates when invoking the skill.

## Implement From Printed Text

```text
Implement the Lorcana card from its printed text in `packages/lorcana/lorcana-cards`.

Card: <set>/<type>/<number>-<slug>
Printed text:
<paste exact card text here>

Requirements:
0. If the engine doesn't support yet that card, now it's the best time to ensure the engine supports it.
1. Resolve the exact card file, related test file, same-card reprints, and any available legacy implementation first.
2. Determine the card type and current migration state:
   - inspect `missingImplementation`
   - inspect `missingTests`
   - inspect whether the test file is active, placeholder-only, keyword-smoke-only, or commented legacy content
3. Inspect current engine and type support before deciding the card is blocked.
   - search `packages/lorcana/lorcana-engine/src/runtime-moves/resolution/action-effects`
   - search `packages/lorcana/lorcana-engine/src/runtime-moves/moves/abilities/activate-ability.ts`
   - search `packages/lorcana/lorcana-engine/src/triggered-abilities/index.ts`
   - search `packages/lorcana/lorcana-engine/src/rules/derived-state.ts` and `packages/lorcana/lorcana-engine/src/projection`
   - search `packages/lorcana/lorcana-types/src`
4. Use the safest current references for this card type.
   - Prefer same-card and same-type live examples
   - Prefer actions and locations as syntax references when they are the only mature examples
5. Implement the card from printed text, not from stale generated structure.
6. If the gap is bounded, extend `packages/lorcana/lorcana-engine` and `packages/lorcana/lorcana-types` in the same task so the card can be modeled correctly.
7. Keep the implementation honest:
   - only leave `missingImplementation: true` after you can cite the exact unsupported engine surface
   - only leave `missingTests: true` if real behavior coverage is still impossible after that investigation
   - tests that only assert missing flags or empty abilities do not count
8. Add or update an executable Bun test for the real behavior.
   - if the card remains blocked, add or identify a minimal engine/simulator repro instead of a metadata-only card test
9. Verify with:
   - `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/<SET>/<TYPE>/<NUMBER>-<slug>.test.ts"`
   - targeted `bun test` commands in `packages/lorcana/lorcana-engine` when you touched or investigated shared engine behavior
   - `bun run --cwd packages/lorcana/lorcana-cards check-types`
10. In the final report, summarize:
   - what was implemented
   - whether the card is fully implemented or still blocked
   - what test coverage is now real
   - which engine files and tests were inspected
   - exact verification results
```
