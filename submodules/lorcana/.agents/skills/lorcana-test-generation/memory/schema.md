# Memory Schema

Canonical schema lives in [`../../lorcana-cards/memory/schema.md`](../../lorcana-cards/memory/schema.md). Read that file for tier definitions, promotion rules, decay rules, and the memory update protocol.

## Skill-specific addenda

This skill's memory tracks test-harness drift and recurrent test-authoring mistakes. Domain-specific signals to watch:

- **harness-api-drift**: a `@tcg/lorcana-engine/testing` export changed name or signature; existing test patterns break. Append an Observation immediately and update `SKILL.md` references in the same task.
- **false-green-pattern**: a class of test that passes without exercising real behavior (metadata-only, keyword-smoke, optimistic client snapshot). Promote to a Guardrail when the same class is observed ≥ 3×.
- **matcher-misuse**: callers used a matcher with the wrong receiver type or wrong card shape. Track until a typed-helper or lint rule resolves it.

For this skill, runnable verification of a Promoted Rule is a passing example test plus a counter-example test that fails before the rule was applied. Until both exist, keep the entry as a Candidate.
