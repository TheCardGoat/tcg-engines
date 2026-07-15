# Memory Schema

Canonical schema lives in [`../../lorcana-cards/memory/schema.md`](../../lorcana-cards/memory/schema.md). Read that file for tier definitions, promotion rules, decay rules, and the memory update protocol.

## Skill-specific addenda

This skill's memory tracks rule-grounding decisions and CR-interpretation drift. Domain-specific signals to watch:

- **citation-miss**: a Mode B handoff cited a CR section that did not actually support the claim. Treat as urgent — append an Observation immediately and re-ground.
- **interpretation-drift**: an interpretation that previously seemed sound is contradicted by a new CR version, set release note, or runtime test. Demote any Promoted Rule that depended on it.
- **cr-version-bump**: when the indexed comprehensive rules update, archive any Promoted Rule whose `last_checked` predates the new version and re-verify before re-promoting.
- **rule-vs-runtime-mismatch**: rules say X, engine does Y. Record on both sides — append an Observation here citing the CR, and an Observation in `lorcana-cards` citing the engine code. Resolution lives in `lorcana-cards` (engine extension is a card-driven concern).

A Promoted Rule's `verification` for this skill should include both:

1. The CR citation (e.g. `CR 6.5.7.1`).
2. A runnable test or section-spec under `packages/lorcana/lorcana-engine/src/__tests__/section-XX-YY.test.ts` that codifies the rule.

Rules without runnable verification stay as Candidates indefinitely.
