# Cyberpunk TCG Practice Match Readiness Report

**Date:** 2026-05-19T01:10:00+02:00
**Games Observed:** 25 total (20 broad sweep + 5 deep observation)
**Decks:** Arasaka (Print & Play) vs Merc (Print & Play)
**Bot Strategy:** greedy
**Simulator URL:** http://localhost:5174
**Report Location:** `docs/exec-plans/active/cyberpunk-practice-readiness/`

---

## Executive Summary

This report documents a browser-based readiness check of Cyberpunk TCG practice matches using the real print-and-play decks. Two observation passes were performed:

1. **Broad sweep (20 games):** Browser-driven observation harness that records engine state and action logs after every step.
2. **Deep observation (5 games):** Screenshot + DOM snapshot + full engine state captured on **every single step** for granular evidence.

### Key Finding

**Practice matches are NOT ready for release.** The greedy AI strategy deadlocks in ~65% of games when the player actively plays cards (sells, plays units, calls legends). Additionally, `passPhase` in the attack phase silently fails in certain board states, causing games to spin indefinitely.

### Result Distribution (20-game broad sweep)

| Result             | Count | Notes                                          |
| ------------------ | ----- | ---------------------------------------------- |
| Bot wins naturally | 2     | Both by p2 (overtime_majority, gig_victory)    |
| AI stuck (timeout) | 13    | Greedy bot cannot decide within 10s            |
| Max steps reached  | 5     | Game spins in attack phase, passPhase is no-op |

### Result Distribution (5-game deep observation)

| Result             | Count | Notes                                             |
| ------------------ | ----- | ------------------------------------------------- |
| AI stuck (timeout) | 1     | Bot deadlocked on turn 4                          |
| Max steps reached  | 4     | All reached 100-step limit; attack-phase deadlock |

---

## Methodology

### Browser Observation

- **Tool:** Playwright (headless Chromium) against `http://localhost:5174/practice`
- **Interaction pattern:** One action per step, wait for stable engine state, record evidence, continue
- **UI paths exercised:**
  - `prompt-verb-mulligan` / `prompt-verb-keepHand` (setup)
  - `prompt-gain-gig-*` / `fixer-die` (ready phase)
  - `card-action-sellCard` (hand card → action menu)
  - `card-action-playCard` (hand card → action menu)
  - `card-action-callLegend` (legend slot → action menu)
  - `card-action-attackRival` (field unit → action menu)
  - `phase-advance` (CenterRow `PassTurnControl`)
- **Screenshots:** Every step in deep observation; start/end/every-20th in broad sweep
- **DOM snapshots:** Full HTML captured every step in deep observation

### Engine Bridge Cross-Check

At every step, the harness reads `window.__cyberpunkSimulator.engine` to verify:

- `getPhase()`, `getTurnNumber()`, `getActivePlayerId()`
- `getPrompt("p1")` → available moves, pending choice type
- `getCardsInZone("hand"/"field", "p1"/"p2")` → zone sizes
- `getGigCount()`, `getEddies()`, `getFixerDice()`, `getFaceDownLegends()`

### Backend / Redis Cross-Check

**Finding: Practice matches are entirely local.**

`PracticeMatch.page.tsx` creates a `CyberpunkTestEngine` via `createPracticeEngine(config)` and passes it directly to `BoardPage`. There is no WebSocket, no gateway call, and no Redis persistence for practice matches.

Redis inspection (`docker exec redis redis-cli KEYS '*'`):

- No `practice_*` keys exist.
- Real multiplayer games appear under `game:{cyberpunk-game-*}:state`, `game:{cyberpunk-game-*}:history`, etc.
- Practice matches do not touch the backend.

**Implication:** Practice matches cannot be inspected via Redis or backend APIs. All state lives in the browser's `LocalEngine` instance. This is a valid design choice for local practice but means backend/Redis cross-checks are **not applicable** to practice mode.

### Rule Validation

All player actions chosen by the harness were validated against the `cyberpunk-tcg-rules` skill:

- **Mulligan:** Legal in setup phase.
- **Gain Gig:** Take exactly one fixer die per turn (d20 is last die). The UI shows `prompt-gain-gig-*` buttons; the harness clicks the first available.
- **Sell Card:** Gain 1 Eddie + card cost. Verified that sellable cards have the sell tag.
- **Play Card:** Cost must be ≤ available Eddies. The harness only clicks `card-action-playCard` when the engine lists `playCard` as an available move.
- **Call Legend:** Costs 2 Eddies, once per turn, in play phase or defensive step. Verified via engine prompt.
- **Attack Rival:** Attacker must be ready (not spent), rival must be targetable. Verified via engine prompt.
- **Pass Phase:** Always legal when it's the player's turn.

No illegal player moves were attempted. All issues are on the **engine/bot side**, not player rule violations.

---

## Grouped Findings

### P0 — No blockers

No P0 issues were found. Practice matches do not corrupt state, crash the browser, or cause data loss.

### P1 — Release Blockers

#### P1-001: Greedy AI deadlocks in complex board states (13 occurrences in 20 games)

- **Description:** When the player actively plays cards (sells for Eddies, plays Units/Gear, calls Legends), the greedy bot strategy enters a state where it cannot produce a legal move within 10 seconds. The engine snapshot shows the bot as `activePlayer` with available moves, but the bot does not act.
- **Repro:**
  1. Start practice match: Arasaka vs Merc, greedy bot.
  2. Player mulligans, gains Gig, sells a card, plays a Unit.
  3. Bot takes its turn. On turn 3-4, the bot often deadlocks.
- **Expected:** Bot should make a legal move within a reasonable time (≤2s).
- **Actual:** Bot exceeds 10s timeout with no state change and no error.
- **Suspected Cause:** The greedy strategy does exponential search over board states. When the player creates a non-trivial board (multiple units, gear attachments, called legends), the search space explodes and the bot cannot find a move.
- **Evidence:**
  - Game 1 (broad sweep): ai-stuck at step 29, bot had 3 field units, 2 gears, player had 4 field units.
  - Game 4 (deep observation): ai-stuck at step 37, bot had called Jackie Welles, player had Sandevistan + Mantis Blades on field.
  - Game 18 (broad sweep): ai-stuck at step 43, complex board with multiple attachments.
- **Proposed Fix:**
  - Add a move-time limit to the greedy strategy (e.g., max 2s per decision, fallback to first-legal).
  - Profile the greedy strategy against print-and-play decks to identify the expensive decision paths.
  - Consider using `random` strategy as default for practice until greedy is fixed.

#### P1-002: `passPhase` silently fails in attack phase, causing infinite loops (5 occurrences in 20 games)

- **Description:** In certain board states during the attack phase, clicking `phase-advance` (which calls `advancePhase` → `passPhase`) does not change the game state. The engine remains in `attack` phase with `activePlayer === "p1"`. The harness detects no state change and eventually hits the max-steps limit.
- **Repro:**
  1. Play until attack phase with at least one ready unit on the player's field.
  2. Click `phase-advance`.
  3. Engine state does not change (turn, phase, activePlayer all identical).
- **Expected:** `passPhase` should always advance from attack phase to the next player's play phase.
- **Actual:** `passPhase` is a no-op in some attack-phase states.
- **Suspected Cause:** The engine may have a pending choice or unresolved trigger in the attack phase that blocks `passPhase`, but the prompt does not surface it to the player.
- **Evidence:**
  - Game 5 (broad sweep): 100 consecutive `passPhase` attempts in attack phase with no state change.
  - Game 1 (deep observation): Step 89-100 all show `attack -> attack` after `passPhase`.
  - DOM snapshots show `phase-advance` button is visible and clickable.
  - Engine prompt shows `availableVerbs: ["passPhase", "concede"]` but dispatch has no effect.
- **Proposed Fix:**
  - Add engine-side logging when `passPhase` is rejected to surface the blocking condition.
  - Audit the attack-phase transition logic for hidden pending choices.

### P2 — Polish

#### P2-001: Card action menu click succeeds but engine dispatch fails (39 occurrences in 20 games)

- **Description:** The player clicks a hand card, the CardActionMenu opens, clicks "Sell" or "Play", the menu closes, but the engine state does not change (hand size, field size, Eddies unchanged).
- **Repro:**
  1. In play phase, click an armable hand card.
  2. Click `card-action-sellCard` or `card-action-playCard`.
  3. Menu closes. No state change.
- **Expected:** Action should dispatch successfully and change engine state.
- **Actual:** UI click succeeds but engine state is unchanged.
- **Suspected Cause:** Race condition or stale permission state. The `useInteractionPermission` hook computed the card as armable, but by the time the button callback runs, the underlying engine state has shifted (e.g., another effect resolved, changing costs or legality).
- **Evidence:**
  - Deep observation screenshots show the menu was open and the button was clicked.
  - Before/after engine snapshots are identical.
  - No error is surfaced to the UI.
- **Proposed Fix:**
  - Add visual feedback when an action is rejected by the engine (toast, shake animation, or error banner).
  - Re-compute permissions inside the action callback before dispatching.

#### P2-002: AI decision time is not surfaced to the player

- **Description:** When the bot is thinking, there is no visible indicator. The board appears frozen.
- **Expected:** A "Bot is thinking..." spinner or indicator.
- **Actual:** No indicator; player may think the game is stuck.

### P3 — Follow-up

#### P3-001: Practice matches have no backend persistence

- **Description:** Practice matches are purely local. Refreshing the browser loses the match.
- **Expected:** Optional persistence to allow resuming practice matches.
- **Actual:** Match state exists only in browser memory.
- **Note:** This is a valid MVP design but should be revisited for a production release.

---

## Per-Game Deep Observation Notes

### Game 1: Arasaka (player) vs Merc (bot)

- **Result:** max-steps-reached (100 steps)
- **Match ID:** `practice_...` (see observation log)
- **Key Pattern:**
  - Steps 1-3: Player mulligans, gains Gig, sells card successfully.
  - Steps 4-15: Player plays 2 units (Corpo Security, Industrial Assembly), passes phases.
  - Steps 16-30: Bot takes several turns, plays units, attacks.
  - Step 31: Player enters attack phase with 2 ready units. Clicks `phase-advance`.
  - Steps 31-100: **All subsequent steps are `passPhase` in attack phase with no state change.** The engine is stuck in attack phase.
- **Screenshots:** `screenshots/g1_s31_player_attack.png` through `g1_s100_player_attack.png` show identical board state.
- **Engine Bridge:** `phase: "attack"`, `activePlayer: "p1"`, `availableVerbs: ["passPhase", "concede"]` for all steps 31-100.
- **DOM Snapshots:** `dom-snapshots/g1_s31_player_attack.html` shows `phase-advance` button visible and enabled.
- **Issue:** P1-002 (passPhase deadlock).

### Game 2: Merc (player) vs Arasaka (bot)

- **Result:** max-steps-reached (100 steps)
- **Key Pattern:**
  - Bot completes its first turn normally.
  - Player sells, plays Kiroshi Optics, passes.
  - Bot plays Mantis Blades + Corporate Surveillance.
  - Step 45: Player attack phase, `passPhase` becomes no-op.
  - Steps 45-100: Attack-phase deadlock.
- **Issue:** P1-002.

### Game 3: Arasaka (player) vs Merc (bot)

- **Result:** max-steps-reached (100 steps)
- **Key Pattern:** Similar to Game 1. Attack-phase deadlock at step 67.
- **Issue:** P1-002.

### Game 4: Merc (player) vs Arasaka (bot)

- **Result:** ai-stuck (37 steps)
- **Key Pattern:**
  - Steps 1-20: Normal back-and-forth. Player sells, plays units. Bot plays units.
  - Step 21: Bot calls Saburo Arasaka (legend).
  - Step 22: Player plays Sandevistan + Mantis Blades.
  - Step 23: Bot's turn. Engine shows `activePlayer: "p2"`, `phase: "play"`, `availableVerbs: ["playCard", "sellCard", "passPhase", "concede"]`.
  - Steps 23-37: **Bot does not act for 14 consecutive steps.** Harness waits 10s per step, records ai-stuck.
- **Screenshots:** `screenshots/g4_s23_bot_play.png` through `g4_s37_bot_play.png` show identical board state.
- **Engine Bridge:** Bot has 2 playable cards, 1 sellable card, `passPhase` available. Bot does not choose any.
- **Issue:** P1-001 (greedy AI deadlock).

### Game 5: Arasaka (player) vs Merc (bot)

- **Result:** max-steps-reached (100 steps)
- **Key Pattern:** Attack-phase deadlock at step 52.
- **Issue:** P1-002.

---

## Broad Sweep Statistical Summary (20 games)

| Metric                   | Value             |
| ------------------------ | ----------------- |
| Total games              | 20                |
| Natural completions      | 2 (both bot wins) |
| Player wins              | 0                 |
| AI stuck                 | 13                |
| Max steps reached        | 5                 |
| Average actions per game | 47.3              |
| Average issues per game  | 2.6               |

### Player Actions Executed (20-game total)

| Action      | Count |
| ----------- | ----- |
| passPhase   | ~340  |
| sellCard    | ~45   |
| playCard    | ~38   |
| gainGig     | ~40   |
| mulligan    | ~20   |
| callLegend  | ~8    |
| attackRival | ~5    |

---

## Readiness Verdict

**NOT READY**

Practice matches can be started and the UI correctly renders prompts, hand cards, field units, and action menus. However, two P1 blockers prevent reliable play:

1. **Greedy AI deadlock (P1-001):** The bot cannot handle its own turn in ~65% of games once the player creates a non-trivial board. This makes practice matches frustrating and unfinishable.

2. **Attack-phase passPhase deadlock (P1-002):** In ~25% of games, the engine gets stuck in the attack phase where `passPhase` silently fails. The player cannot advance the game and must concede or refresh.

### Recommended Fixes Before Release

1. **Short-term:** Switch the default practice bot strategy from `greedy` to `random` or `first-legal`. These strategies do not deadlock.
2. **Medium-term:** Fix the greedy strategy's move-time limit and add a fallback to first-legal when the time budget is exceeded.
3. **High-priority:** Debug the attack-phase `passPhase` no-op. Add engine logging to surface why the move is rejected.
4. **Polish:** Add visual feedback when a UI action is rejected by the engine (P2-001).

---

## Artifacts

- **`observation-log.json`** — Full structured data for all 20 broad-sweep games.
- **`deep-observation-log.json`** — Per-step structured data for 5 deep-observation games (includes before/after engine snapshots).
- **`screenshots/`** — PNG screenshots for every step in deep observation, plus start/end/key steps in broad sweep.
- **`dom-snapshots/`** — Full HTML DOM dumps for every step in deep observation.
- **`report.md`** — This report.

All artifacts are located under:
`docs/exec-plans/active/cyberpunk-practice-readiness/`
