# `@tcg/game-page-contract`

Cross-deployable schema for the three pages every TCG.online game ships:

| Page          | Route (inside a deployable)                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Live match    | `/matches/:matchId/games/:gameId` (`?spectate=1`)                                               |
| Replay viewer | `/replay/:gameId` (`?step=N`) — fork at `/replay/:gameId/fork?step=N&side=playerOne\|playerTwo` |
| Replay list   | `/replays`                                                                                      |
| Practice      | `/practice?deck=<base64url>&bot=<fixtureId>&ai=<strategyId>`                                    |

Each game ships as **its own deployable**. A reverse proxy maps `/lorcana/...`, `/gundam/...`, `/cyberpunk/...` to the right backend. Inside a deployable the routes do not carry a game prefix — every game's UI sees the same paths.

This package owns:

- TS types describing page-load payloads (`MatchPageData`, `MatchResolution`, `PracticeConfig`, …).
- Zod schemas for the HTTP boundary and the WebSocket envelope (`ClientMsg`, `ServerMsg`).
- The replay file format (`ReplayFile` at `version: 3`).
- The base64url deck codec used by the practice deep link.

It owns **nothing** game-specific. No engine package is allowed as a dependency. Game adapters, board components, move-id labels, deck-text validators all live in the deployable that needs them.

---

## What a deployable must provide

For each of the three pages, the deployable supplies its own implementation of these bindings (no shared interface — this is a checklist, not a runtime registry):

```ts
parseState(snapshot: GameSnapshot): MyGameState
applyPatches(state: MyGameState, patches: JsonPatch): MyGameState     // RFC 6902
validateDeckText(text: string): { ok: true; sanitized: string } | { ok: false; unknownNames: string[] }
moveLabel(moveId: MoveId, payload?: unknown, state?: MyGameState): string

components: {
  Board:           SvelteComponent<{ state: MyGameState; viewerSeat }>
  MoveLogEntry:    SvelteComponent<{ entry: GameLogEntry }>
  EndGameSummary:  SvelteComponent<{ snapshot: GameSnapshot; metadata: ReplayMetadata }>
}
```

The shared base64url codec ships in this package (`encodeDeckToUrlParam`, `decodeDeckFromUrlParam`) — every deployable must use it so deep links round-trip across games.

---

## The three pages — wiring guide

### 1. Live match

1. **Server load** `GET /v1/play/matches/:matchId/games/:gameId/context` → returns `MatchPageData`. Validate with `MatchPageDataSchema`.
2. Pick the orchestrator from `game.authority`:
   - `"server"` → connect to the gateway with `realtime.wsUrl` + `realtime.ticket`.
   - `"client"` → run the engine in the browser (devtools / local play).
3. Render the page header from `match` (participants, scores, format) and mount the deployable's `Board` with `parseState(game)`.
4. **WebSocket loop**:
   - Send `{ type: "join_game", gameId, ticket }` immediately.
   - On `game_joined` keep the snapshot and `recentHistory`.
   - On `move_accepted` / `state_update` apply `patches` via the deployable's `applyPatches`. If `lastSeenVersion + 1 !== msg.stateVersion`, send a heartbeat to trigger `state_sync`.
   - On `state_sync` discard local state and load the new `snapshot`.
   - On `move_rejected` surface the `code` to the user (stale, illegal, not-your-turn, ended).
   - User actions become `{ type: "execute_move", gameId, expectedVersion, moveId, payload }`.

`expectedVersion` is mandatory — the gateway uses it for compare-and-swap. Always send the latest version the client knows.

### 2. Replay viewer

1. **Loader** — try local IndexedDB; fall back to `GET /v1/play/replays/:gameId/data` (gzipped `ReplayFile`, validate with `ReplayFileSchema`).
2. Materialize all states up front: starting from `initialState`, repeatedly call `applyPatches(state, step.patches)`. Cache the array.
3. **Controls** — `goToStep(n)`, `nextStep`, `prevStep`, `nextTurn`, `prevTurn`, `play/pause`. Move-log entries come from `step.acceptedMove` and `step.logs`; render through the deployable's `MoveLogEntry`.
4. **Fork** — same client-side flow; the deployable creates a new local game with `initialState = states[forkStep]` and the chosen side wired to the human player.

Older Lorcana replays are still on `version: 2`. Each deployable handles its own legacy format; this package only describes v3 going forward.

### 3. Practice (deep link)

URL: `/practice?deck=<base64url>&bot=<fixtureId>&ai=<strategyId>`.

1. `decodeDeckFromUrlParam(url.searchParams.get("deck"))`. Null result ⇒ render a deck-error page.
2. `validateDeckText(decoded)`. Failure ⇒ deck-error with `unknownNames` listed.
3. `POST /v1/play/practice` with:
   ```ts
   { playerDeckText, bot: { fixtureId?, deckText?, strategyId? }, seed? }
   ```
   Validate the response with `PracticeCreatedResponseSchema`.
4. Hydrate a `MatchPageData`-shaped value (treat the practice match like a 1-game match with `authority: "client"` if the server is offline, otherwise `"server"`) and reuse the live-match component tree.
5. Network failure ⇒ local-only fallback: build everything client-side, set `authority: "client"`, render the same Board.

The base64url scheme is fixed: `utf-8 → base64 → +→-, /→_, strip trailing =`. Use the helpers in this package — never roll your own.

---

## HTTP surface (per deployable)

| Verb | Path                                              | Returns                                                      |
| ---- | ------------------------------------------------- | ------------------------------------------------------------ |
| GET  | `/v1/play/matches/:matchId`                       | `MatchResolution`                                            |
| GET  | `/v1/play/matches/:matchId/games/:gameId/context` | `MatchPageData`                                              |
| GET  | `/v1/play/replays/:gameId/data`                   | gzipped `ReplayFile`                                         |
| GET  | `/v1/play/replays/:gameId/meta`                   | `ReplaySummary`                                              |
| POST | `/v1/play/practice`                               | `PracticeCreatedResponse` (request: `PracticeRequestSchema`) |
| GET  | `/v1/play/practice/:gameId`                       | `PracticeConfig`                                             |
| POST | `/v1/play/practice/:gameId/ticket`                | `PracticeTicketResponse`                                     |
| GET  | `/v1/users/me/settings`                           | `UserSettings`                                               |

Request bodies do not carry `gameType` (each deployable serves one game). Response bodies and replay files carry `gameType` so a misrouted client fails loudly.

---

## WebSocket envelope

Single bidirectional WS connection per live match:

- **Client → server**: `ClientMsg` (`join_game`, `execute_move`, `leave_game`, `send_chat`, `heartbeat`, `ping`).
- **Server → client**: `ServerMsg` (`game_joined`, `move_accepted`, `state_update`, `state_sync`, `move_rejected`, `presence`, `chat`, `timeout_notice`, `game_error`, `pong`).

`patches` use RFC 6902 JSON Patch operations exactly — same shape live and in replays.

`GameLogEntry.tag` and `AnimationCue.tag` are namespaced strings (`"<gameType>:<event>"`). The page never parses them; the deployable's `MoveLogEntry` does.

### Current raw gateway contract

The deployed native WebSocket gateway uses a raw JSON envelope at
`/v1/gateway/ws?game=<slug>&ticket=<ticket>` (or `token=<jwt>` as a fallback).
Standalone simulators should import the explicit schemas from `@tcg/protocol`:

```ts
import {
  RawGatewayClientMessageSchema,
  RawGatewayServerMessageSchema,
  type RawGatewayClientMessage,
  type RawGatewayServerMessage,
} from "@tcg/protocol/gateway";
```

This raw gateway shape is the contract for separately deployed game UIs today:

- auth lives in the WebSocket URL, not inside `join_game`;
- client moves use `moveType`, `expectedVersion`, and a record `payload`;
- server updates include an authoritative `state` snapshot and may include
  `matchInfo` for best-of-N navigation;
- `game_ended` and `match_state` are redundant match-level recovery signals
  that clients must treat as authoritative for next-game / return navigation.

Keep this surface in sync with
`packages/api-core/src/modules/gateway/protocol/server-messages.ts`. Any
gateway message used by a standalone simulator should be represented in
`packages/protocol/src/gateway.ts` and covered by
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
