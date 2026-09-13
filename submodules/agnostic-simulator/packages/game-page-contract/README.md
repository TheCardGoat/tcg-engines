# `@tcg/game-page-contract`

Cross-deployable contracts for live matches, replay playback, practice, and their realtime envelope. The package stays game-agnostic: adapters, board renderers, move labels, and deck validation remain game-owned.

## Canonical live-match flow

1. The live route's server loader fetches `GET /v1/games/:gameSlug/play/matches/:matchId/games/:gameId/session` once. The root loader owns authentication and settings, not another match fetch.
2. Validate with `MatchSessionSchema` and render its explicit `preparation`, `starting`, `playing`, `finished`, or `cancelled` phase on both the server and the first client render.
3. Trust the server-selected viewer, permissions, projected `game.view`, viewer-safe resources, and scoped realtime access. Query parameters never select the actor or role.
4. Send `{ type: "join_game", gameId, ticket }`. The ticket binds match, game, viewer, role, and expiry.
5. Apply only viewer-projected updates. On a version gap, replace local state with the projected `state_sync` response.

The shared session owner subscribes to lifecycle invalidations before its post-authentication recovery read. It refreshes on newer `match_session_changed` revisions, match metadata changes, reconnect, visibility restoration, and preparation commands. HTTP recovery is single-flight and cannot regress the lifecycle revision or game version. Failed recovery preserves the current screen with a retry notice. A response-paced recovery read runs in the shared session owner during preparation and startup, with request timeouts and backoff after failures; it stops when the game starts or the match ends. Game pages do not own polling loops.

Lifecycle revisions are incremented atomically with Redis match transitions, independently of gameplay versions. Preparation GETs are pure projections. Lifecycle writes atomically maintain a per-game Redis due-work index. Recovery workers claim bounded batches with expiring leases; revision-checked acknowledgments preserve racing commands and successful cancellation removes pending work. A one-time, locked backfill seeds matches created before the index existed; recurring recovery never scans all active matches. Browser presence is not required to advance or cancel expired preparation.

Spectator identity is an opaque, Redis-backed browser cookie, forwarded through the server loader to the document response. It remains stable across session refreshes but grants no match permissions. Match authorization is checked on every request. Snapshot and callback changes do not rejoin the game; only connection scope changes do. Unchanged `match_state` join acknowledgments do not trigger HTTP recovery, and routes without realtime credentials discard the previous scoped socket.

Responses and SSR documents are private and non-cacheable. Preparation contains only the seated viewer's pool; spectators receive a neutral waiting phase. Authorized viewers join a dedicated session-notification room containing only match IDs and revisions, never game state or player chat. Participant display names, supporter tiers and match-start ratings come from the persisted roster; ratings and tiers are match snapshots, not live billing authority.

`liveGameFromSession` is a renderer projection for existing live-game components, not a second data fetch or lifecycle owner. The older `context` endpoint remains for separate existing consumers and must not be combined with a preparation request to select a screen.

Server-authoritative clients render projected views and submit opaque actions; they do not deserialize authoritative engine snapshots. Riftbound is the explicit client-authoritative exception and is restricted to its two trusted players.

## Canonical replay flow

1. Fetch `GET /v1/games/:gameSlug/play/replays/:gameId`.
2. Let normal HTTP compression handle transport and validate the JSON as `ReplayPlaybackV1`.
3. Use the shared replay controller for RFC 6902 patch application, checkpoints, seeking, playback speed, and cursor state.
4. Supply only the game renderer and optional animation interpretation.

Browsers support only `ReplayFileV3`. V2 artifacts are read and migrated server-side. Raw runtime artifacts are available only through the API-key-protected internal runtime API; there is no public raw replay endpoint.

## Practice

Practice keeps its dedicated request/response contracts and may reuse the live component tree through its compatibility adapter. The shared base64url codec (`encodeDeckToUrlParam`, `decodeDeckFromUrlParam`) remains canonical for practice deep links.

## Deck documents

New deck writes use `DeckDocumentV2`. See [DeckDocument V2](./DECK_DOCUMENT_V2.md)
for the field semantics, format model, migration policy, supported-game rules,
and before/after examples.

## HTTP surface

| Verb | Path                                                              | Returns                   |
| ---- | ----------------------------------------------------------------- | ------------------------- |
| GET  | `/v1/games/:gameSlug/play/matches/:matchId`                       | `MatchResolution`         |
| GET  | `/v1/games/:gameSlug/play/matches/:matchId/games/:gameId/session` | `MatchSession`            |
| GET  | `/v1/games/:gameSlug/play/matches/:matchId/games/:gameId/context` | `LiveMatchBootstrapV1`    |
| GET  | `/v1/games/:gameSlug/play/replays/:gameId`                        | `ReplayPlaybackV1`        |
| POST | `/v1/games/:gameSlug/play/practice`                               | `PracticeCreatedResponse` |

---

## Realtime envelope

Single bidirectional Socket.IO connection per live match:

- **Client → server**: `ClientMsg` (`join_game`, `execute_move`, `leave_game`, `send_chat`, `heartbeat`, `ping`).
- **Server → client**: `ServerMsg` (`game_joined`, `move_accepted`, `state_update`, `state_sync`, `move_rejected`, `presence`, `chat`, `timeout_notice`, `game_error`, `pong`).

`patches` use RFC 6902 JSON Patch operations exactly — same shape live and in replays.

`GameLogEntry.tag` remains a namespaced string (`"<gameType>:<event>"`). Animation updates use the canonical `AnimationPlanV2` contract and never expose engine-native animation tags.

### Gateway event contract

The shared Socket.IO gateway client connects to the game-slug namespace and
passes the bootstrap ticket (or reconnect token) in the Socket.IO auth payload.
Standalone simulators should import the explicit event-envelope schemas from
`@tcg/protocol`:

```ts
import {
  RawGatewayClientMessageSchema,
  RawGatewayServerMessageSchema,
  type RawGatewayClientMessage,
  type RawGatewayServerMessage,
} from "@tcg/protocol/gateway";
```

Despite their retained `RawGateway*` names, these schemas describe Socket.IO
event payloads, not frames from the removed raw-WebSocket transport. They are
the contract for separately deployed game UIs today:

- auth lives in the Socket.IO handshake payload, not inside `join_game`;
- Socket.IO carries the event name separately; clients add the `type`
  discriminant before validating an event payload;
- client moves use `moveType`, `expectedVersion`, and a record `payload`;
- server updates include an authoritative `state` snapshot and may include
  `matchInfo` for best-of-N navigation;
- `game_ended` and `match_state` are redundant match-level recovery signals
  that clients must treat as authoritative for next-game / return navigation.

Keep this surface in sync with the Socket.IO ingress and event maps in
`@tcg/protocol`. Any gateway event used by a standalone simulator should be
represented in `packages/protocol/src/gateway.ts` and covered by
`packages/protocol/src/gateway.test.ts`.

---

## Versioning

- `protocolVersion` in `RealtimeAccess` lets clients refuse stale gateways before subscribing.
- `ReplayFile.version` is a literal — bumps require an explicit migration story.
- Schema changes are breaking; bump the package version in lockstep with the gateway.

---

## Testing the contract

```bash
bun test                    # round-trips every ClientMsg / ServerMsg / ReplayFile
bun run check-types
bun run check:isolation     # verifies zero engine deps
```

Adding a new game = creating a deployable that satisfies the bindings checklist above. The simulator pages do not change.
