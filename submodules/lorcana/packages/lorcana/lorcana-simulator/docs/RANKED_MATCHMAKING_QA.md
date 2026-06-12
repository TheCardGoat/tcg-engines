# Ranked Matchmaking — QA Test Plan

**Audience:** human QA validating Ranked end-to-end on staging before the
production flag flip.

**Setup:**

- Two test accounts (Account A, Account B) on staging, both with at least
  one valid Infinity-format deck.
- Set `PUBLIC_RANKED_ENABLED=true` for the staging deploy (or use the
  `lorcana-simulator-ranked-on` launch config locally).
- Browser dev tools open to watch console + network tab.
- Access to: match history page, leaderboard widget, server logs, MMR
  database (or admin endpoint that exposes per-account MMR).

---

## Group 1 — Feature flag gating

### TC-1.1 — Flag OFF: Ranked tab is disabled

1. Set `PUBLIC_RANKED_ENABLED=false`, reload `/matchmaking`.
2. **Expect:** the Ranked tab shows a "Soon" badge and is `aria-disabled`.
   Hover shows the "coming soon" tooltip. Clicking the tab does nothing.

### TC-1.2 — Flag ON: Ranked tab is selectable

1. Set `PUBLIC_RANKED_ENABLED=true`, reload `/matchmaking`.
2. **Expect:** the Ranked tab is enabled, no "Soon" badge, no tooltip.
   Clicking it sets `aria-selected="true"` on the Ranked tab and `false`
   on Casual.

### TC-1.3 — Persistent pref does not leak past flag-off

1. With flag ON, select Ranked. Refresh.
2. Confirm Ranked stays selected after refresh.
3. Set flag OFF, hard reload.
4. **Expect:** Casual is selected (the persisted "ranked" pref must be
   coerced back to "casual"). Local storage key
   `tcg.matchmaking.prefs.matchType` may still read "ranked" — that's OK as
   long as the UI does not act on it while flag is off.

### TC-1.4 — Defensive toast on illegal join

_Hard to reproduce via UI; use dev console._

1. With flag OFF, run in console:
   ```js
   document.querySelector('[role="tab"][aria-selected="true"]'); // identify casual
   // Force selectedMatchType to "ranked" via the controller — only possible
   // if you can reach the controller; otherwise skip this case.
   ```
2. Click "Join queue".
3. **Expect:** queue does NOT post to `/matchmaking/join`. An error toast /
   inline error reads "Ranked matchmaking is currently unavailable…".
   `queue_join_blocked` analytics event fires with `reason: "ranked_disabled"`.

---

## Group 2 — Queue → Match flow (flag ON)

### TC-2.1 — Two accounts queue Ranked simultaneously

1. Both A and B click Ranked → Infinity → BO1 → Join.
2. **Expect:**
   - Both clients show `searching` state with elapsed timer counting up.
   - Within ≤ matchmaking pairing window (typically ≤ 60 s in staging),
     both receive `match_ready`. Both click Accept.
   - Both transition to `match_found`, then redirect to
     `/matches/[matchId]/games/[gameId]`.
3. Network tab on Account A: `POST /v1/games/lorcana/play/matchmaking/join`
   request body contains `"matchType":"ranked"`. Response is
   `{ "object": "matchmaking_entry", "status": "queued" }`.

### TC-2.2 — Status read-back captures deck snapshot (§5)

1. After A queues Ranked but before match starts, in dev tools:
   ```bash
   GET /v1/games/lorcana/play/matchmaking/status
   ```
   Note the `entry.deckListId`.
2. While still queued, A edits the selected deck (add or remove a card).
3. Re-call `GET /v1/games/lorcana/play/matchmaking/status`.
4. **Expect:** `entry.deckListId` is **unchanged**. The match that A is
   eventually paired into uses the snapshotted deck list, not the edited
   version.

### TC-2.3 — Cancel queue

1. A queues Ranked. Before match found, click Leave Queue.
2. **Expect:** queue resets to idle. `queue_leave` analytics event fires with
   `matchType: "ranked"`.

### TC-2.4 — Decline acceptance

1. A and B queue Ranked, are paired, A Accepts, B Declines (or lets timer
   expire).
2. **Expect:**
   - A returns to idle with error "Your opponent declined the match."
     (or "Match acceptance timed out…" if timeout).
   - `queue_match_ready_expired` analytics fires with
     `reason: "declined" | "timeout"` and `matchType: "ranked"`.
   - Neither account loses MMR.

### TC-2.5 — Queue timeout

1. A queues Ranked alone (no opponent likely to be paired).
2. Wait until the queue ticket expires (default ~5 min).
3. **Expect:** A returns to idle with timeout message.
   `queue_timeout` analytics fires with `wait_seconds` and
   `matchType: "ranked"`.

---

## Group 3 — Match outcome & MMR

### TC-3.1 — Win/loss updates MMR

1. A and B complete a Ranked BO1 to a natural conclusion (winner reaches
   20 lore).
2. Within 30 s of the game ending, navigate both accounts to match history.
3. **Expect:**
   - Both see the new match listed with `matchType: "ranked"`.
   - `mmrBefore` is the rating before this match; `mmrAfter` is the rating
     after. Winner's `mmrAfter > mmrBefore`; loser's is lower.
   - The MMR badge on the matchmaking lobby reflects `mmrAfter` after a
     refresh (and ideally without — see `useMatchmakingLobbyController`).
   - Leaderboard widget reflects the change for affected accounts.

### TC-3.2 — Concede counts as a full loss

1. A and B start a Ranked match. A immediately concedes turn 1.
2. **Expect:**
   - A loses MMR commensurate with a normal loss (no "early concede"
     reduction — confirm with backend rules).
   - B gains MMR commensurate with a win.
   - The match shows in history with `matchType: "ranked"`.
   - `match_forfeit` analytics fires with
     `source: "matchmaking_page"` and `matchType: "ranked"`.
   - Concede confirmation dialog showed
     "Conceding a Ranked match counts as a loss and reduces your MMR."
     before A confirmed.

### TC-3.3 — Disconnect within grace window is not penalised

1. A and B start a Ranked match. A force-closes the tab (or kills network)
   for ≤ disconnect-grace window (e.g. 60 s).
2. A reopens the match URL.
3. **Expect:** A reconnects, no MMR penalty, match continues.

### TC-3.4 — Disconnect beyond grace window is a loss

1. Same as TC-3.3 but A stays offline > grace window.
2. **Expect:** match resolves as A's loss. MMR reflects the loss.

### TC-3.5 — BO3 rating handling

_If BO3 is shipping in the launch._

1. A and B play a Ranked BO3 to a 2-game decision.
2. **Expect:** MMR updates **once** per BO3 series, not per game. Confirm
   with backend rating spec which behaviour is expected.

---

## Group 4 — Anti-abuse

### TC-4.1 — Quick concede cooldown

1. A concedes a Ranked match immediately (turn 1).
2. A immediately tries to queue Ranked again.
3. **Expect:** queue join is rejected with a cooldown message (or queue
   start is delayed). Cooldown duration matches backend config.

### TC-4.2 — One ticket per account

1. A queues Ranked. In a second tab on the same account, try to queue
   Ranked again.
2. **Expect:** second tab shows the existing queue state (already queued)
   rather than creating a duplicate ticket.

### TC-4.3 — Active match blocks new queue

1. A is in an active Ranked match. In a second tab on A, try to queue.
2. **Expect:** queue join is rejected with HTTP 409. UI shows "You have an
   active match" with a Rejoin button.

### TC-4.4 — Deck legality enforced server-side

1. Edit A's selected deck to be illegal for the chosen format (e.g. wrong
   card count).
2. Try to queue Ranked.
3. **Expect:** server-side rejection (the client may also block, but the
   server must too). UI surfaces the deck validation error.

### TC-4.5 — `matchType: "testing"` rejected in production

1. On a production deployment, manually craft a join request with
   `matchType: "testing"` (use Postman / curl).
2. **Expect:** HTTP 400 / 403.

---

## Group 5 — Seasons & leaderboard

### TC-5.1 — Active season displays

1. Visit `/matchmaking/season/wilds-unknown` (or whatever slug §2 SQL
   returned).
2. **Expect:** the season page renders with the live start/end dates and
   prize information matching the DB row.

### TC-5.2 — Leaderboard reflects ranked play

1. After a few completed ranked matches, refresh `/matchmaking`.
2. **Expect:** the leaderboard widget shows entries. Top entries' `value`
   ≥ accounts that have played fewer / lost more matches.

### TC-5.3 — Player's own rank highlighted

1. Account A appears in the leaderboard (or has `playerRank` populated).
2. **Expect:** A's row is highlighted, `playerRank` matches the row's
   `rank` field.

---

## Group 6 — Flag flip / kill switch

### TC-6.1 — Flip flag off mid-session

1. A is on `/matchmaking` with flag ON, Ranked tab selected (idle, not
   queued).
2. Server-side, set `PUBLIC_RANKED_ENABLED=false` and redeploy / refresh
   the served env.
3. A reloads.
4. **Expect:** Ranked tab returns to disabled state with "Soon" badge.
   `selectedMatchType` is forced back to Casual. No errors in console.

### TC-6.2 — Flip flag off while user is queued

1. A is queued Ranked. Backend flips flag off.
2. **Expect (graceful path):** existing queue ticket is honoured (paired,
   match completes normally). New joins from any client are blocked.

### TC-6.3 — Flip flag off mid-match

1. A is in an active Ranked match. Flag is flipped off.
2. **Expect:** the in-progress match completes normally with full MMR
   resolution. No new ranked matches start.

---

## Sign-off

QA fills in pass/fail for each test case. Any FAIL on TC-1.1 / TC-2.1 /
TC-2.2 / TC-3.1 / TC-3.2 / TC-4.5 / TC-6.1 is launch-blocking.
