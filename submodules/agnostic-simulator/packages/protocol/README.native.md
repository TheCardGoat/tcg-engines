# Native v1 (development slice)

`src/native.ts` is the transport-neutral runtime contract. Export portable JSON Schema with
`bun run scripts/export-native-schema.ts` from this package. `fixtures/native` contains the
generated schemas and message examples. The server validates every input and output.
JSON Schema validates shape; clients must additionally enforce the runtime cross-field rules:
join specifies exactly one of `gameId`/`fixtureIds`, and outer version/correlation guards
must equal the nested submission guards. The server enforces these even if a client does not.

## Fields and direction

All messages are strict objects with `v: 1` and a `type` discriminant. Unknown fields,
versions, message kinds, binary frames and malformed JSON are rejected. IDs are opaque
strings; never construct action/request IDs. Counters are nonnegative safe integers.

| Direction/type                   | Fields and meaning                                                                                                                                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client `hello`                   | `credential`: local secret, binds an existing fixed seat. Never logged in transcripts.                                                                                                                     |
| Server `welcome`                 | `sessionId`: reconnect identity (not a credential); `role`: server-owned seat; `fixtures`: allowed `{id,name}` entries; `supportedInputs`: supported interaction input kinds; `heartbeatMs`: ping cadence. |
| Client `join_game`               | Either `fixtureIds: [firstSeat, secondSeat]` to create the one practice game, or `gameId` to join it. `lastSequence` optionally reports the last applied snapshot; v1 always returns a full sync.          |
| Client `submit_interaction`      | `gameId`, `expectedVersion`, `correlationId`, nested **protocol 2** `submission`. Preserve its `requestId`, `actionId`, `stateVersion`, `values` and `correlationId`. No actor ID or raw command.          |
| Server `action_result`           | `gameId`, original `correlationId`, `accepted`, `stateVersion`, `code`. Accepted means engine execution succeeded. A retry returns the exact original result, whose version may precede the current state. |
| Server `state_sync`              | `gameId`, `matchId`, `stateVersion`, per-viewer `sequence`, game-owned `state`, protocol-2 `interaction`, and authorized `display`.                                                                        |
| Server `state_update`            | Same complete snapshot plus `previousVersion` and optional `animation` (`AnimationPlanV2`). No patches.                                                                                                    |
| Client `request_game_state_sync` | `gameId`. Returns complete current snapshot; use after a sequence gap, stale response or reconnect.                                                                                                        |
| Both `ping`/`pong`               | Opaque `nonce`; echo unchanged. The local host responds to client pings.                                                                                                                                   |
| Server `error`                   | Stable `code`. A transport/session error, not a committed action.                                                                                                                                          |

`display.catalog` reuses `PresentationCatalogReference`: catalog revision is distinct from
transport, state and interaction versions. `display.cards[definitionId]` contains only
`name` and `rulesText`. `display.objects[objectId]` contains `definitionId`, optional
`printingId` and optional pinned `imageUrl`, exclusively for currently authorized objects.
Absence means concealed/unavailable, not permission to look up an old binding.

`state` is JSON owned by each adapter; this contract deliberately does not import rules.
The GA DTO's `schemaVersion: 1` includes turn, player zones/counts, public compact stack
items and opportunity/pregame holder; prompts are supplied through `interaction`.
Clients apply snapshots immediately and animate a separate presentation model. A sync
never replays old animations. Unknown optional animations fall back to the snapshot.
Unsupported required input kinds disable the action and report incompatibility.

## Ownership mapping

This adds an opt-in boundary; deployed gateway consumers are unchanged. Lorcana,
Cyberpunk, Gundam and One Piece all map their existing protocol-2 interactions, opaque
match/game identifiers, player sessions and viewer snapshots to this shape. Zones, costs,
card naming and rules stay in adapters. The fixed pair of starter IDs is a development
practice bootstrap, not a shared deck-construction model or a multiplayer lobby.
Only the Grand Archive local host implements this boundary in this task.

See `tools/native-client-dev-server/README.md` for limits, errors, lifecycle and the
complete two-viewer state fixtures consumed by the next Godot task.
