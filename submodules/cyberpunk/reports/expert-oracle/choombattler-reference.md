# Exact Choombattler Expert reference — 2026-10-06

Bot Lab now runs the original Choombattler Expert worker as the
`choombattler-expert` opponent. We did not recreate its policy from similar
weights. Decisions go through the shipped `move` message handler with
`difficulty: "expert"`. A small hook exposes the worker's existing engine
functions without replacing their bodies or constants.

- Source: https://choombattler.com/assets/bot.worker-DCis42UZ.js
- Worker SHA-256: `c834449c4463db4aa01e4ceaaa3de59afd460db90f0379a723b78a995369fa40`
- Public catalog: https://api.choombattler.com/trpc/cards.list
- Catalog fixture SHA-256: `0e130e4d982f7c42bbe571ec82cc33b3e841cd8aea211d37e1c59122c9c9caf3`
- Catalog: 151 cards; all 15 authored decks joined with no scalar printed-stat mismatches.

The external worker and catalog remain in local fixtures. No third-party worker
implementation is included in this checkout. A different worker hash is rejected.

## Comparison boundary

Both players execute Choombattler's native reducer. Our unchanged Expert chooser
uses an `EngineHandle` adapter. All native legal choices and their order are
preserved. Native effective cost, power, and keywords feed our projection. Both
bots can use hidden information.

Our chooser receives native actions as opaque choice options. Its projected view
does not yet include active effects, granted rules, or pending combat details;
some turn flags are approximated. This can affect our chooser's performance.
These games test our adapted chooser, not our production engine bot. This
environment cannot promote a production strategy.

## Validation

The hooked worker and a separate, unmodified worker selected identical actions
at 12 consecutive native positions. Neither changed the supplied input state.
Adapter tests also checked complete legal-choice round trips, fork isolation,
hidden-information filtering, catalog joins, non-production descriptors, and
replay drift rejection. The reference and evaluation suites passed all 13 tests.
Cyberpunk automation checks passed 282 tests. Scoped type, lint, and formatting
checks passed, as did the frozen Bot Lab dependency install.

A wider registry test could not load the separate Gundam adapter because its
workspace lacked the `mutative` dependency. The reference adapter and evaluation
tests passed in that run; no Gundam product code was changed.

The first smoke evaluation used the RYB low-cost tempo mirror, with one game in
each seat. Choombattler won both games. Both ended through normal rules wins,
with no illegal commands, unsupported prompts, repeated states, or action caps.

| Our seat | Winner | Actions | Turns |
| --- | --- | --- | --- |
| 1 | Choombattler Expert | 79 | 10 |
| 2 | Choombattler Expert | 107 | 11 |

The two legs have separate recorded seeds. Two games are a smoke check, not a
statistical strength estimate. The full 15-deck suite has not been run.

Final reference engine revision: `fnv1a32:f88677f9`. The terminal state hashes were
`fnv1a32:bb358476` and `fnv1a32:9fb4640e`, respectively. The smoke run was repeated
after adding the replay drift guard and produced the same games.
The first leg also passed exact record replay verification with the final code.

The manifest and full report are temporary local artifacts:
`/tmp/choombattler-bot-study/reference-smoke-manifest.json` and
`/tmp/choombattler-bot-study/reference-smoke-report.json`.

See [Bot Lab reference commands](../../../agnostic-simulator/tools/bot-lab/README.md#choombattler-expert-reference)
to fetch fixtures, create a manifest, evaluate, replay, or expand to all decks.
