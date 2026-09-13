# Simulator HTTP Inventory

This file is the canonical ownership map for HTTP/network callsites in `lorcana-simulator`.

## Allowed transport files

- `src/lib/data/transport/http-client.ts`
- `src/lib/server/fetch-with-cf.ts`

## Domain callsites using the shared data layer

- `src/lib/features/simulator/post-game/notes-api.ts`
- `src/lib/features/simulator/support/feedback-api.ts`
- `src/lib/features/replay/fetch-replay.ts`

## Route-level server fetch ownership

- `src/hooks.server.ts`
- `src/routes/matchmaking/+layout.server.ts`
- `src/routes/matches/[matchId]/+page.server.ts`
- `src/routes/matches/[matchId]/games/[gameId]/+page.server.ts`
- `src/routes/sandbox/simulator/vs-ai/quick/+page.server.ts`
- `src/routes/sandbox/simulator/vs-ai/quick/play/[gameId]/+page.server.ts`

Realtime traffic is owned by the shared Socket.IO client through
`src/lib/features/gateway/gateway-client.svelte.ts`; it is not an HTTP callsite.
