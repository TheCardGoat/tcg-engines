# Design Docs

Long-lived design decisions and invariants. Unlike `exec-plans/`, docs here
describe enduring properties of the system, not a unit of work.

## Contents

- [`core-beliefs.md`](core-beliefs.md) — engine invariants that all changes must respect.
- [`card-fixtures.md`](card-fixtures.md) — the approved-fixtures pattern for card behavioral tests (Phase 4 of the harness).

## When to add a doc here

- A non-obvious design choice that future readers would otherwise re-litigate.
- An invariant the codebase relies on that isn't expressible as a type or test.
- A "we tried this and it didn't work, here's why" record.

Keep each doc focused on one decision/topic. Cross-link liberally. Update or delete docs as decisions evolve — stale design docs are worse than missing ones.
