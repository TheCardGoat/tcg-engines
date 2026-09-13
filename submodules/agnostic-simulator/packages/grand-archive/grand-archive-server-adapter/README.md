# Grand Archive server boundary

This package is the only Grand Archive rules-aware boundary used by the shared
game server. The platform supplies an expected state version, persists the
adapter snapshot with compare-and-swap, and projects state and logs for each
viewer before sending them to a client.

## Raw command dispatch

`dispatch(move, actorId, payload, context)` uses `payload.expectedStateVersion`
for the current match version and `payload.objectIncarnations` for object guards.
All remaining fields are the engine command payload (without `move`). Decision
answers retain their own `stateVersion`, which identifies the pending decision
and can be older than the current match version. Never flatten the match version
onto the decision's `stateVersion`.

## Retry semantics

- Every command is admitted against its exact engine `stateVersion`. A command
  based on an older or newer version is rejected without publishing candidate
  events or costs.
- Interaction `correlationId` values are recorded only after an accepted engine
  transition. Reusing an accepted id is rejected as `duplicate_interaction`,
  including after snapshot restore. A retry without a correlation id is still
  rejected by its stale expected version after the original command commits.
- Redis persistence uses the same expected version as engine admission. A CAS
  loser is discarded and the cached engine is invalidated by the shared
  runtime cache.

## Persistence and replay

The authoritative snapshot is the engine-owned closed snapshot DTO. It retains
pending decisions, replacement continuations and pre-commit state, combat,
Effects Stack resolution, trigger queues, RNG, and committed event history.
Adapter metadata adds only the initial replay snapshot, accepted command
journal, event-type checks, and retry ledger.

`GrandArchiveReplayV1` is server-authoritative and may contain private command
answers. It must never be returned directly to a browser. Use the focused
viewer projection instead:

```sh
pnpm inspect-replay -- replay.json --viewer PLAYER_ID --command 12
```

The command prints only that viewer's projected state and log through the
selected accepted-command count. Full replay verification rejects catalog,
state-version, event-stream, final-snapshot, or public-log fingerprint drift.
