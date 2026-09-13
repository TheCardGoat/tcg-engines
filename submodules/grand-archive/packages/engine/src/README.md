# Grand Archive Engine Source Layout

The package exposes only `runtime-api.ts` and `simulator-api.ts` from this directory. Internal
modules are grouped by responsibility:

| Directory | Responsibility |
| --- | --- |
| `game` | Grand Archive identities, objects, zones, and game-native state vocabulary |
| `kernel` | Immutable events, transactions, match programs, and committed observations |
| `commands` | Command contracts, decoding, routing, handlers, and legal-command enumeration |
| `procedures` | Ordered activation, combat, effect-resolution, decision, and turn procedures |
| `rules` | Abilities, replacement effects, continuous state, and general rule predicates |
| `projection` | Viewer-safe state, visibility, simultaneous-choice privacy, and wait states |
| `snapshot` | Snapshot serialization, validation, refusal diagnostics, and fuzz coverage |
| `automation` | Deterministic bots, match runners, fixtures, and benchmarks |
| `testing` | Public test-engine and player-facing harness APIs |
| `log` | Typed log vocabulary and viewer-specific log projection |
| `performance` | Opt-in local performance checks |

Tests live beside the subsystem whose behavior they prove. Internal imports should target the
owning module directly; avoid new catch-all barrels, which obscure dependencies and make cycles
harder to detect. Package consumers must use the exported package entrypoints rather than internal
paths.

Maintained package documentation and the implementation roadmap live in
[`../docs`](../docs/README.md).
