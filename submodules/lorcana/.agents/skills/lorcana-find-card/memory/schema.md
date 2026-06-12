# Memory Schema

Canonical schema lives in [`../../lorcana-cards/memory/schema.md`](../../lorcana-cards/memory/schema.md) and is shared across all Lorcana skills. Read that file for tier definitions, promotion rules, decay rules, and the memory update protocol.

## Skill-specific addenda

This skill's memory tracks lookup quality. Domain-specific signals to watch:

- **wrong-top-k**: the right card was not in the returned `similarCards` list — record the query, expected card id, and which weight class would need to change.
- **scoring-version-mismatch**: a downstream skill or test pinned to `scoringVersion: "v<X>"` but the CLI emitted v<Y>. Treat as a high-priority observation; bump and document.
- **filter-gap**: the caller wanted a filter (e.g. `requireActiveTest`) that the CLI doesn't yet support natively. File as a Candidate; promote when 3+ callers want the same filter.
- **slug-normalization-drift**: legacy vs current apostrophe forms (already a Candidate in `lorcana-cards/memory/bank.md` — cross-reference, do not duplicate).

Promote a Candidate to a Promoted Rule only when its `verification` is a runnable command — for this skill, that usually means a small repro query against `similarity.ts` with an expected hit/miss list.
