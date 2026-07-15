# Ranked Matchmaking — Backend Contract & Validation

**Audience:** the backend service that owns `/v1/games/lorcana/play/matchmaking/*`,
`/v1/leaderboards/*`, `/v1/match-history/*`, and the matchmaking gateway
WebSocket. This document captures the contract the simulator currently expects,
plus sample queries to validate the data is in place.

The simulator code is the source of truth for the wire shapes — see
[matchmaking-api.ts](../src/lib/features/matchmaking/api/matchmaking-api.ts),
[leaderboard-api.ts](../src/lib/features/matchmaking/api/leaderboard-api.ts),
[player-stats-api](../src/lib/features/match-history/api/player-stats-api.ts),
and [match-history/types.ts](../src/lib/features/match-history/types.ts).

## 1. Endpoints we depend on

### POST `/v1/games/lorcana/play/matchmaking/join`

**Request body** (see `MatchmakingJoinParams`):

```json
{
  "gameProfileId": "gp_123",
  "format": "infinity",
  "mode": "1",
  "matchType": "ranked",
  "preferredOpponentColors": 0,
  "excludedOpponentColors": 0,
  "colorPreferenceStrength": "preferred",
  "isMobile": false
}
```

**Backend MUST:**

1. Reject `matchType: "testing"` in production (already noted in the
   `matchType` JSDoc in `matchmaking-api.ts`).
2. **Snapshot the player's currently-selected `deckListId`** at queue-join
   time and persist it on the queue entry; carry that same `deck_list_id`
   forward to `match_participants` when the match is created. The simulator
   does NOT send `deckListId` in the join body — the server resolves it
   from the player's `gameProfileId`. The status response then echoes the
   captured `deckListId` back (see `MatchmakingStatusResponse.entry.deckListId`).
   The §5 deck-snapshot guarantee is structurally satisfied because
   `deck_lists` is immutable (see §4f) — once captured, the contents
   cannot change.
3. Validate deck legality for the chosen `format` server-side before queueing.
4. Enforce **one active ranked queue ticket per account** and **one
   in-progress ranked match per account**.
5. Reap stale queue tickets after the configured timeout (the client expects
   `expiresAt` ≈ 5 minutes).
6. Apply ranked-only anti-abuse rules:
   - Cooldown after a quick concede / dodge (recommended: ≥ 60 s before next
     ranked join).
   - Rate-limit join attempts per account (recommended: ≤ 10 / minute).

**Response** (`MatchmakingEntryResponse`):

```json
{
  "object": "matchmaking_entry",
  "status": "queued",
  "queuedAt": 1713000000000,
  "expiresAt": 1713000300000
}
```

**Errors:** if the player has an active match, return HTTP 409 with
`{ "matchId": "..." }` in the payload — the simulator surfaces this as a
"You have an active match" block screen.

### GET `/v1/games/lorcana/play/matchmaking/status`

Returns `MatchmakingStatusResponse`. The `entry.deckListId` MUST be the
snapshot captured at join time, not the player's _current_ selected deck.

### DELETE `/v1/games/lorcana/play/matchmaking/leave`

Cancel the queue ticket. Should not penalize MMR.

### POST `/v1/games/lorcana/play/matchmaking/forfeit-match`

For ranked: counts as a loss with **full MMR penalty** (the simulator's
concede confirmation copy assumes this — see
`sim.matchmaking.matchmaking.rankedConcedeWarning`).

### GET `/v1/leaderboards/lorcana/{type}`

`type ∈ { "mmr", "weekly", "win-streak", "sportsmanship" }`. Must update on
match completion (not stale snapshots). `entries[].value` is the rank metric
(MMR for `mmr`, wins for `weekly`, etc.).

### GET `/v1/match-history/players/me/stats`

Returns `PlayerStats`. Required ranked fields: `mmr`, `highestMmr`, `bracket`,
`currentWinStreak`. `mmr: null` is acceptable for accounts that have never
played ranked.

### GET `/v1/match-history/players/me/matches`

Each entry must include `mmrBefore` and `mmrAfter` for ranked matches. These
are how the simulator detects "ranked rating changed" without a separate
endpoint.

### Gateway WebSocket (`/v1/gateway/ws`)

Server emits `match_found`, `match_ready`, `match_ready_update`,
`match_ready_expired`, `matchmaking_status`, `matchmaking_cancelled`. None
of these need ranked-specific fields, but the **internal game runner is the
sole authority on match outcome** — clients never report results.

## 2. Rating algorithm parameters — confirm on the backend

These are not visible to the client. Document and pin them before launch:

- Algorithm: Elo, Glicko-2, or TrueSkill 2?
- Initial MMR for new accounts.
- K-factor (Elo) or RD/volatility (Glicko-2).
- Draw handling (uncommon in Lorcana but possible via timeout).
- BO3 vs BO1 — does series outcome count once, or per game?
- Disconnect / abandonment treatment (e.g. abandonment ≥ X minutes = full
  loss; reconnection grace window).
- Soft / hard MMR floors and ceilings.

## 3. Seasons — `rank_seasons` (the real schema)

> Source: [`packages/api-core/src/db/schema/match-history/rank-seasons.ts`](../../../../../the-card-goat-online/packages/api-core/src/db/schema/match-history/rank-seasons.ts)
> in the backend repo.

Schema highlights that drive the queries below:

| column       | type        | notes                                                                                                                                                                                                           |
| ------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `season_id`  | `text` PK   | prefixed id                                                                                                                                                                                                     |
| `game_id`    | `text` FK   | references `games.id`. To find by name, join against `games.slug`.                                                                                                                                              |
| `category`   | `text` enum | one of `ladder`, `casual`, `tournament`, `league`. **`ladder` is the matchmaking ranked queue** (see the JSDoc on `rankCategoryEnum`).                                                                          |
| `name`       | `text`      | display name                                                                                                                                                                                                    |
| `slug`       | `text`      | unique per `(game_id, category)`                                                                                                                                                                                |
| `starts_at`  | `timestamp` | NOT NULL                                                                                                                                                                                                        |
| `ends_at`    | `timestamp` | **NULLABLE** — open-ended seasons are valid                                                                                                                                                                     |
| `is_primary` | `boolean`   | exactly one primary per `(game_id, category)` (enforced by partial unique index `rank_seasons_primary_unique_idx`). The matchmaking service uses the primary; match completions update **every** active season. |
| `priority`   | `integer`   | tiebreaker / ordering                                                                                                                                                                                           |

**There is no `status` column** — "currently active" is a function of
`starts_at <= now() AND (ends_at IS NULL OR ends_at > now())`. That is why
the original 4a query failed; the table has no `status = 'active'` filter
to apply.

The "ranked" matchType in the simulator maps to `category = 'ladder'`. Use
that throughout. `casual` matchType writes to `category = 'casual'` (hidden
MMR for match-quality only).

## 4. Sample queries — **§2 validation**

> Run these read-only against the matchmaking DB. The placeholder
> `'lorcana'` is the `games.slug` for the Lorcana game row.

### 4a. Is there a primary, currently-active Lorcana ladder season?

```sql
SELECT s.season_id, s.slug, s.name, s.starts_at, s.ends_at,
       s.is_primary, s.priority, now() AS server_now
  FROM rank_seasons s
  JOIN games g ON g.id = s.game_id
 WHERE g.slug      = 'lorcana'
   AND s.category  = 'ladder'
   AND s.is_primary = true
   AND s.starts_at <= now()
   AND (s.ends_at IS NULL OR s.ends_at > now());
```

**Expected: exactly one row.** That row is the season the matchmaking
service will route ranked queue completions to.

- 0 rows → either no primary is set, or the primary's window is closed.
  Both are launch BLOCKERS.
- ≥2 rows → impossible by the partial unique index
  `rank_seasons_primary_unique_idx`; if you somehow see it, the index is
  missing or has been dropped (also a BLOCKER).

### 4b. List every "active" Lorcana ladder season (the rating writers)

Match completions update _every_ active season for the relevant
`(game_id, category)`, not just the primary. So this is the audit of "what
ladders will move when a ranked match finishes":

```sql
SELECT s.season_id, s.slug, s.name, s.starts_at, s.ends_at, s.is_primary
  FROM rank_seasons s
  JOIN games g ON g.id = s.game_id
 WHERE g.slug     = 'lorcana'
   AND s.category = 'ladder'
   AND s.starts_at <= now()
   AND (s.ends_at IS NULL OR s.ends_at > now())
 ORDER BY s.is_primary DESC, s.priority DESC, s.starts_at;
```

If this returns more than one row, you're running stacked ladders (e.g.
"all-time" alongside the seasonal). Confirm with product whether that is
intentional before launch.

### 4c. Does the primary slug match what the simulator hardcodes?

```sql
SELECT s.slug
  FROM rank_seasons s
  JOIN games g ON g.id = s.game_id
 WHERE g.slug      = 'lorcana'
   AND s.category  = 'ladder'
   AND s.is_primary = true;
```

The simulator's
[season slug guard](<../src/routes/matchmaking/(shell)/season/[seasonSlug]/+page.ts>)
hardcodes `wilds-unknown`. If 4c returns a different slug, either update
the simulator's allowlist or update the row's slug.

### 4d. Sanity: starts_at < ends_at; no overlapping primary windows

```sql
-- Future-fix data integrity: any row where start is not before end?
SELECT s.season_id, s.slug
  FROM rank_seasons s
  JOIN games g ON g.id = s.game_id
 WHERE g.slug = 'lorcana'
   AND s.ends_at IS NOT NULL
   AND s.starts_at >= s.ends_at;
-- expect: 0 rows

-- Two primary ladder seasons whose windows overlap (would mean the partial
-- unique index missed something — should be impossible at rest):
SELECT a.season_id AS a_id, b.season_id AS b_id
  FROM rank_seasons a
  JOIN rank_seasons b
    ON a.game_id  = b.game_id
   AND a.category = b.category
   AND a.season_id < b.season_id
   AND a.starts_at < COALESCE(b.ends_at, 'infinity'::timestamp)
   AND b.starts_at < COALESCE(a.ends_at, 'infinity'::timestamp)
  JOIN games g ON g.id = a.game_id
 WHERE g.slug      = 'lorcana'
   AND a.category  = 'ladder'
   AND a.is_primary AND b.is_primary;
-- expect: 0 rows
```

### 4e. End-of-season transition — confirm the rollover plan

`rank_seasons` has no `status` column, so "ending" a season means setting
`ends_at` to a past timestamp (or it was already set at season creation)
and flipping `is_primary` on the **next** season row. There's no
implicit cron behaviour you can validate — instead, before launch confirm
with the backend on-call:

- [ ] When the current primary's `ends_at` arrives, who flips
      `is_primary = false` on it and `is_primary = true` on the successor?
      (Manual op, scheduled job, or migration?)
- [ ] Is there a `game_profile_ranks` snapshot/freeze step that captures
      the closing season's `(season_id, mmr, rank, normalized_rating)` for
      historical leaderboards? If not, end-of-season ranks are recoverable
      only from the rows themselves — fine, but document it.
- [ ] Is the next `wilds-unknown`-style season row already seeded with
      `is_primary = false`, ready to flip? If yes, verify with a query
      analogous to 4b filtered to `starts_at > now()`.

### 4f. Deck snapshot is enforced by the schema (§5)

The backend captures the deck at match-create time in
`match_participants.deck_list_id`, which is `NOT NULL` and references
`deck_lists` — a table whose source comment explicitly states
**"Immutable snapshot of a playable list."** A new edit creates a new
`deck_lists` row (different `deck_list_id`); the participant row's foreign
key continues to point at the captured row. So §5 is structurally
guaranteed.

To validate at runtime:

```sql
-- For a given completed ranked match, fetch the captured deck contents.
WITH target_match AS (SELECT '<MATCH_ID>'::text AS match_id)
SELECT mp.match_id, mp.seat, mp.game_profile_id,
       mp.deck_list_id, dl.list_hash, dl.cards_json
  FROM match_participants mp
  JOIN deck_lists dl ON dl.deck_list_id = mp.deck_list_id
 WHERE mp.match_id = (SELECT match_id FROM target_match);
-- The list_hash and cards_json must NOT change after this row was written,
-- regardless of subsequent edits to the player's selected deck.
```

There is no need for a separate immutability test — it falls out of the
referential integrity (no UPDATE statement in the codebase mutates
`deck_lists.cards_json` once written; new lists become new rows).

### 4g. Live API smoke (no DB access needed)

```bash
# Replace HOST and a valid session cookie.
curl -sf -H "Cookie: ${SESSION_COOKIE}" \
  "${HOST}/v1/leaderboards/lorcana/mmr?limit=10" | jq '.entries | length'
# expect: > 0 once any ranked matches are played.

curl -sf -H "Cookie: ${SESSION_COOKIE}" \
  "${HOST}/v1/match-history/players/me/stats" | jq '{mmr, highestMmr, bracket}'
# expect: object with mmr ∈ [number|null]; the keys must exist.

# Try a ranked queue join end-to-end against staging:
curl -sf -X POST -H "Content-Type: application/json" \
     -H "Cookie: ${SESSION_COOKIE}" \
     -d '{"gameProfileId":"gp_test","format":"infinity","mode":"1","matchType":"ranked"}' \
     "${HOST}/v1/games/lorcana/play/matchmaking/join" | jq
# expect: { "object": "matchmaking_entry", "status": "queued", ... }

# Read it back — confirms the matchmaking service captured the player's
# selected deck and pinned the matchType:
curl -sf -H "Cookie: ${SESSION_COOKIE}" \
  "${HOST}/v1/games/lorcana/play/matchmaking/status" | jq '.entry'
# expect: entry.matchType == "ranked", entry.deckListId points at a
# deck_lists row. Editing the deck on the player after this point must NOT
# change entry.deckListId in the next status response.
```

## 5. Anti-abuse — confirm before launch

- Concede rate cap per account per hour.
- Disconnect-loss rule (recommended: ≥ 90 s offline = full loss with MMR
  penalty; ≤ 90 s = reconnection allowed without penalty).
- Region-aware queue (or single global queue) — pin which.
- IP / device-fingerprint dedup for new accounts to limit smurfing.

## 6. Frontend integration points already in place

- The simulator passes `matchType: "ranked"` once
  [PUBLIC_RANKED_ENABLED](../src/lib/config/feature-flags.ts) is true.
- The Ranked tab disables itself if the flag is off; a
  `ranked_disabled` block is reported via `queue_join_blocked` analytics if
  someone bypasses the UI.
- Analytics events `queue_join`, `queue_leave`, `queue_match_found`,
  `queue_timeout`, `queue_match_ready_expired`, and `match_forfeit` all
  carry `matchType` for funnel slicing.
- MMR badge renders from `playerStats.mmr` (the value backend computes).

## 7. Sign-off checklist

A human must check each of these on staging before flipping the prod flag:

- [ ] `joinMatchmakingQueue` with `matchType: "ranked"` returns `queued` and
      a status read-back shows the captured `deckListId`.
- [ ] Mutating the player's selected deck after queue join does **not** change
      `entry.deckListId` in the status response.
- [ ] Completing a ranked match populates `mmrBefore` / `mmrAfter` in match
      history within 30 s of game end.
- [ ] `/v1/leaderboards/lorcana/mmr` reflects the change for the affected
      players within 60 s.
- [ ] Conceding a ranked match decreases the loser's MMR.
- [ ] Reconnect within the disconnect grace window is not penalised; abandon
      beyond the window is treated as a loss.
- [ ] §4a returns exactly one row (the primary, currently-active Lorcana
      ladder season).
- [ ] §4b returns at most that one row, OR product has confirmed stacked
      ladders are intentional.
- [ ] §4c slug matches the simulator's hardcoded `wilds-unknown` (or the
      simulator's allowlist has been updated to match).
- [ ] §4e end-of-season rollover ownership is documented.
- [ ] `matchType: "testing"` is rejected in production.
