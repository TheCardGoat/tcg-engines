# Simulator HTTP Inventory

This file is the canonical ownership map for HTTP/network callsites in `lorcana-simulator`.

## Allowed transport files

- `src/lib/data/transport/http-client.ts`
- `src/lib/server/fetch-with-cf.ts`

## Domain callsites using the shared data layer

- `src/lib/features/matchmaking/api/*.ts`
- `src/lib/features/match-history/api/player-stats-api.ts`
- `src/lib/features/simulator/post-game/notes-api.ts`
- `src/lib/features/simulator/support/feedback-api.ts`
- `src/lib/features/replay/fetch-replay.ts`
- `src/lib/features/gateway/fetch-ticket.ts`
- `src/lib/features/practice-match/practice-match-api.ts`

## Route-level server fetch ownership

- `src/hooks.server.ts`
- `src/routes/matchmaking/+layout.server.ts`
- `src/lib/features/matchmaking/server/load-matchmaking-data.ts`
- `src/routes/matches/[matchId]/+page.server.ts`
- `src/routes/matches/[matchId]/games/[gameId]/+page.server.ts`
- `src/routes/sandbox/simulator/vs-ai/quick/+page.server.ts`
- `src/routes/sandbox/simulator/vs-ai/quick/play/[gameId]/+page.server.ts`

## Deferred from this migration

- WebSocket transport (`src/lib/features/gateway/gateway-client.ts`)
