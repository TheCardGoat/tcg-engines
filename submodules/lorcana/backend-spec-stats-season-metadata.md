# Backend ask — Season metadata on `/match-history/players/me/stats`

## Context

We want to show per-format MMR on `/matchmaking` after a player has completed 20 ranked placement matches **in the current season for that format**. After investigating `packages/api-core`, the good news is most of what we need already exists on `GET /v1/match-history/players/me/stats` via the `byFormat` array — per-format `mmr`, `highestMmr`, `bracket`, `gamesPlayed`, etc., all already season-scoped at the DB layer (`game_profile_format_ranks` is partitioned by `seasonId`).

We do **not** need the previously proposed `/ranked-status` endpoint. We just need two small additions to the existing `/stats` response so the client can correctly render the gate.

## Asks

### 1. Surface the active season on the response

Add a top-level `season` object to the `/match-history/players/me/stats` response:

```ts
season: {
  seasonId: string; // from rank_seasons.seasonId
  name: string; // human-readable, e.g. "Season 1"
  startsAt: string; // ISO-8601
  endsAt: string | null; // ISO-8601, null for open-ended seasons
}
```

This is the season the `byFormat` rows are scoped to (i.e. the result of `rankSeasonsRepo.getPrimaryActive(gameId, "ladder", now)`).

### 2. Surface the placement threshold

Add `placementsRequired` to each `byFormat` row:

```ts
byFormat: Array<{
  formatId: string;
  mmr: number;
  highestMmr: number | null;
  bracket: string | null;
  gamesPlayed: number;
  gamesWon: number;
  losses: number;
  currentWinStreak: number;
  currentLossStreak: number;
  placementsRequired: number; // NEW — server-side config, default 20
}>;
```

Returning this from the server (rather than hardcoding `20` on the client) lets you tune the threshold per season / per format without a client release.

`placementsCompleted` is **not** needed — the client will use `min(gamesPlayed, placementsRequired)` for display.

### 3. (Optional) Server-side MMR gate

Currently, `byFormat[].mmr` is `number` (non-nullable, defaults to 1200 at the DB layer). If you want defense-in-depth so MMR can **never** leak before placements complete, change `mmr` (and `highestMmr`, `bracket`) to return `null` when `gamesPlayed < placementsRequired` for that format.

If easier, leave the field as-is and we'll gate on the client using `gamesPlayed >= placementsRequired`. Your call — both work.

## Why this is small

- No new endpoint, no new route, no new DB columns.
- `rankSeasonsRepo.getPrimaryActive()` already exists (`db/repositories/rank-seasons.ts:40`).
- `placementsRequired` is a config constant initially, lifted into the response.
- The DB partitions `game_profile_format_ranks` by `seasonId` already, so `gamesPlayed` is already the right number.

## Client follow-up once shipped

We'll:

1. Update `PlayerStats` type in `packages/lorcana/lorcana-simulator/src/lib/features/match-history/types.ts` to include `season` and `placementsRequired`.
2. Add a `fetchPlayerStats()` call to the matchmaking route loader (`src/lib/features/matchmaking/server/load-matchmaking-data.ts`).
3. Render MMR in the lobby when `gamesPlayed >= placementsRequired`; otherwise show `"Placements: {gamesPlayed} / {placementsRequired}"`.

## Reference

- Route: `packages/api-core/src/modules/match-history/player-stats/routes.ts`
- Model to extend: `packages/api-core/src/modules/match-history/player-stats/models.ts:55`
- Season repo: `packages/api-core/src/db/repositories/rank-seasons.ts:40`
- Per-format rank repo: `packages/api-core/src/db/repositories/game-profile-format-ranks.ts`
