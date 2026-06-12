# Resource Card Anomalies

Resource cards are gameplay-trivial — they should all share an identical
canonical shape (`level: 0`, `cost: 0`, `traits: ["-"]`, `rarity: "common"`,
empty `effects`, empty `keywordEffects`, plus the reminder string
`"(Rest a Resource when paying a cost.)<br>"` in `effect`).

The metadata-only scaffolding at
`packages/cards/src/cards/*/resource/*.test.ts` asserts this shape for every
resource card. Anomalies found during scaffolding are recorded here so a
later data-quality pass (sibling workstream B) can reconcile them. The
tests themselves do not assert the anomaly away — they simply tolerate
missing optional fields so the suite stays green while the canonical shape
is re-established.

## Missing reminder text

The following resource definitions are missing the canonical reminder
string `"(Rest a Resource when paying a cost.)<br>"` on the `effect`
field. Every other resource has it:

- `packages/cards/src/cards/gd01/resource/009-resource.ts` (`R-009`)

## Non-empty effects / keywordEffects

None found at scaffolding time. All 23 audited resource cards have empty
`effects` and `keywordEffects` arrays, consistent with resource cards
being inert.

## Audit scope

Files audited (23 total):

- `packages/cards/src/cards/beta/resource/001-resource.ts`
- `packages/cards/src/cards/gd01/resource/00{2..9}-resource.ts` (8 files)
- `packages/cards/src/cards/gd02/resource/0{10..19}-resource.ts` (10 files)
- `packages/cards/src/cards/st01/resource/001-resource.ts`
- `packages/cards/src/cards/st02/resource/001-resource.ts`
- `packages/cards/src/cards/st03/resource/001-resource.ts`
- `packages/cards/src/cards/st04/resource/001-resource.ts`

The task brief mentioned `st05` and `st06` resource directories; these do
not exist in the repo at audit time — `st05/` and `st06/` contain only
`base/`, `command/`, `pilot/`, `unit/` subdirectories. Nothing to
scaffold there.
