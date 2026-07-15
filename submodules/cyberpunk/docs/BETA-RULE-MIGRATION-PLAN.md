# Beta Rule Migration Plan

Reference: https://cyberpunktcg.com/blog/beta-rule-updates

This plan covers every finding from the Alpha-to-Beta audit. Items are grouped
by priority and ordered so that the critical behavioral fix lands first.

---

## Phase 0 — Preparation

- [ ] Create a dedicated branch `fix/beta-rule-migration` from `main`.
- [ ] Run `vp install` then `vp check && vp test` from the cyberpunk submodule
      to establish a green baseline.
- [ ] Pin this plan to the PR description so reviewers can track progress.

---

## Phase 1 — Critical: Fix Start Phase Action Order

**Problem:** The engine currently performs Start Phase steps in the order
Draw → Gain Gig → Ready, but the Beta rules specify Ready → Draw → Gain Gig.
This is a behavioral bug affecting gameplay.

**Beta rule order:**

1. Ready your spent Units, Legends, and Eddies
2. Draw a card
3. Gain a Gig from your fixer area

**Edge case:** On the first player's turn 1, readying is skipped (setup handicap:
the first player begins with two Legends spent). This carve-out must be
preserved but moved to the _correct position_ (step 1) instead of step 3.

### 1.1 Refactor `packages/engine/src/moves/pass-phase.ts` — `endTurn()`

Current flow (lines 138-185):

```
setPhase("start")  →  win check  →  draw  →  gainGig pending  →  (gainGig resolves → ready)
```

Target flow:

```
setPhase("start")  →  win check  →  ready (skip on turn 1)  →  draw  →  gainGig pending
```

**Changes:**

1. After `operations.game.setPhase("start")` (line 138) and the win check
   (line 151), move the readying logic **before** the draw.
2. Import `readySpentCards` from `gain-gig.ts` (already imported at line 9).
3. Add the turn-1 skip guard: `if (turnNumber !== 1) readySpentCards(...)`.
4. Keep `operations.zone.drawCards(opponentId, 1)` as the second step.
5. Keep the gain-gig pending choice as the third step.
6. **Remove** the `readySpentCards` call from `gain-gig.ts` execute (line 70-72)
   since readying now happens before the gain-gig pending choice is created.

### 1.2 Refactor `packages/engine/src/moves/keep-hand.ts` — `enterPlayPhase()`

Current flow (lines 84-113):

```
setPhase("start")  →  draw  →  gainGig pending  →  (gainGig resolves → ready)
```

Target flow:

```
setPhase("start")  →  ready (skip on turn 1)  →  draw  →  gainGig pending
```

**Changes:**

1. Import `readySpentCards` from `gain-gig.ts`.
2. After `operations.game.setPhase("start")` (line 93), add:
   ```
   const turnNumber = state.G.turnMetadata.turnNumber;
   if (turnNumber !== 1) readySpentCards(state, operations, firstPlayerId);
   ```
3. Draw remains step 2 (line 96).
4. Gain-gig pending choice remains step 3 (lines 102-110).

### 1.3 Refactor `packages/engine/src/moves/gain-gig.ts` — execute()

**Changes:**

1. Remove lines 68-72 (the `readySpentCards` call and `readiedCount` variable).
2. Update the log emit to no longer include `readiedCount` (or default it to 0).
3. Update the JSDoc (lines 13-23) to reflect that this move only resolves the
   gig gain — readying is no longer its responsibility.
4. The `readySpentCards` export itself stays — it's now called from
   `pass-phase.ts` and `keep-hand.ts` instead.

### 1.4 Fix `packages/engine/src/flow/index.ts` — `startTurn()`

**Changes:**

1. Reorder lines 12-30 so readying (lines 24-30) runs **before** draw (line 12)
   and gain gig (line 21).
2. Add a `turnNumber` parameter or accept it from the caller so the turn-1 skip
   can be applied. If this function isn't called in production, note it as a
   reference-implementation fix only.

### 1.5 Update comments across engine to reflect new step numbering

The step numbers in comments must shift since Ready is now step 1, Draw step 2,
Gig step 3:

| File               | Line(s) | Current                                                | Target                                                |
| ------------------ | ------- | ------------------------------------------------------ | ----------------------------------------------------- |
| `pass-phase.ts`    | 155-164 | "Step 1: DRAW", "Step 2: GAIN A GIG", "Step 3 (READY)" | "Step 1: READY", "Step 2: DRAW", "Step 3: GAIN A GIG" |
| `keep-hand.ts`     | 70-83   | "Transition setup → ready", steps 1-3                  | Update JSDoc to match new order                       |
| `gain-gig.ts`      | 13-23   | "step 2 of the ready phase"                            | "step 3 of the start phase"                           |
| `match-state.ts`   | 260     | "Step 2 of the ready phase"                            | "Step 3 of the start phase"                           |
| `player-prompt.ts` | 253     | "READY PHASE — step 2"                                 | "START PHASE — step 3"                                |

### 1.6 Verify with tests

- [ ] Run `packages/engine` tests: `vp test` from `packages/engine`.
- [ ] Run the two-turns flow test: `packages/engine/tests/flow/two-turns.test.ts`.
- [ ] Run the ready-phase test: `packages/engine/tests/flow/ready-phase.test.ts`.
- [ ] Run win-condition tests: `packages/engine/tests/win-condition-gigs.test.ts`.
- [ ] Run gain-gig test: `packages/engine/src/moves/gain-gig.test.ts`.
- [ ] Run setup test: `packages/engine/tests/setup.test.ts`.

All tests that assert on step ordering will need their expectations updated to
match the new Ready-first sequence.

---

## Phase 2 — Player-Facing Error Messages (High Priority)

**Problem:** Three engine moves return `"Not in play phase"` to players. The
Beta phase is called "Main Phase".

### 2.1 Update error strings

| File                                     | Line | Current               | Target                |
| ---------------------------------------- | ---- | --------------------- | --------------------- |
| `packages/engine/src/moves/sell-card.ts` | 29   | `"Not in play phase"` | `"Not in main phase"` |
| `packages/engine/src/moves/play-card.ts` | 29   | `"Not in play phase"` | `"Not in main phase"` |
| `packages/engine/src/moves/go-solo.ts`   | 37   | `"Not in play phase"` | `"Not in main phase"` |

### 2.2 Verify

- [ ] Grep for remaining `"play phase"` (case-insensitive) in error messages.
- [ ] Run `vp test` from `packages/engine`.

---

## Phase 3 — Player-Facing UI Labels (High Priority)

### 3.1 Fix phase advance button labels in CenterRow.tsx

**File:** `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/components/GameBoard/CenterRow.tsx`

| Function                     | Line | Current         | Target          |
| ---------------------------- | ---- | --------------- | --------------- |
| `phaseAdvanceLabel()`        | 691  | `"READY PHASE"` | `"START PHASE"` |
| `compactPhaseAdvanceLabel()` | 711  | `"RDY"`         | `"STR"`         |
| `dockedPhaseAdvanceLabel()`  | 731  | `"Ready"`       | `"Start"`       |

The `phaseLabel()` function (lines 742-757) is already correct and needs no
changes.

### 3.2 Fix attack-phase language in PromptBanner.tsx

**File:** `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/components/Prompt/PromptBanner.tsx`

| Line | Current                                                                   | Target                                                                                                                                                                                                                  |
| ---- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 871  | `"You still have Units that can attack. Passing ends your attack phase."` | `"You still have Units that can attack. Passing ends your turn."`                                                                                                                                                       |
| 1096 | `if (gamePhase !== "attack")`                                             | Remove or invert — `"attack"` is no longer a valid `GamePhase`. This branch currently always evaluates to `true`, making the `else` dead code. Replace with a check against `attackState` or remove the guard entirely. |
| 1105 | `"No legal attackers are available. Pass to end your attack phase."`      | `"No legal attackers are available. Pass to end your turn."`                                                                                                                                                            |

### 3.3 Verify

- [ ] Run `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk` tests: `vp test` from `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk`.
- [ ] Run CenterRow tests: `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/components/GameBoard/CenterRow.test.tsx`.
- [ ] Run PromptBanner tests: `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/components/Prompt/PromptBanner.test.tsx`.

---

## Phase 4 — Engine Internal Naming (Medium Priority)

### 4.1 Rename `enterPlayPhase` → `enterStartPhase`

| File                                      | Line | Change                                                |
| ----------------------------------------- | ---- | ----------------------------------------------------- |
| `packages/engine/src/moves/keep-hand.ts`  | 84   | Rename function `enterPlayPhase` to `enterStartPhase` |
| `packages/engine/src/moves/keep-hand.ts`  | 66   | Update call site                                      |
| `packages/engine/src/moves/pass-phase.ts` | 8    | Update import                                         |
| `packages/engine/src/moves/pass-phase.ts` | 42   | Update call site                                      |

### 4.2 Rename effectId `"ready-phase"` → `"start-phase"`

> **Decision needed:** `effectId` is a stable string stored in pending choices
> and potentially in serialized match state / replays. Renaming it would break
> replay deserialization for any matches recorded with the old ID.
>
> **Recommended:** Keep `"ready-phase"` as-is for now and add a migration
> comment. If replay compatibility is not a concern (Alpha matches are
> ephemeral), rename to `"start-phase"` and update both call sites:
>
> | File                                      | Line |
> | ----------------------------------------- | ---- |
> | `packages/engine/src/moves/pass-phase.ts` | 170  |
> | `packages/engine/src/moves/keep-hand.ts`  | 107  |

### 4.3 Update comments that say "ready phase" / "play phase"

Update all remaining Alpha-era phase names in JSDoc and inline comments.
See the table in Phase 1.5 for the full list. Additional files:

| File                                                 | Line(s) | Change                                                              |
| ---------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `packages/engine/src/moves/pass-phase.ts`            | 40-41   | `"runs the same ready phase"` → `"runs the same start phase"`       |
| `packages/engine/src/moves/gain-gig.ts`              | 86      | `"before this ready-phase gain"` → `"before this start-phase gain"` |
| `packages/engine/src/testing/test-state.test.ts`     | 21      | `"ready-phase preparation"` → `"start-phase preparation"`           |
| `packages/engine/src/transport/local-engine.test.ts` | 36      | `"after ready-phase draw"` → `"after start-phase draw"`             |

### 4.4 Verify

- [ ] Run `vp check && vp test` from `packages/engine`.
- [ ] Run `bun run ci:cyberpunk:check` from repo root.

---

## Phase 5 — Deprecated Test Infrastructure (Medium Priority)

### 5.1 Remove `passToAttackPhase()` no-op

**File:** `packages/engine/src/testing/test-engine.ts`

1. Remove the `passToAttackPhase()` method (lines 791-797) and its JSDoc.
2. Do a project-wide find-and-replace of `.passToAttackPhase()` calls — each
   call site should simply be **deleted** since the method is a no-op.

**Call sites to clean up (non-exhaustive, ~130 total):**

| Area               | Example files                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scenario fixtures  | `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts`, `legends.ts`, `gears.ts`, `shared.ts` |
| Legend card tests  | `packages/engine/src/cards/spoiler/legends/*.test.ts` (10+ files)                                                                                       |
| Unit card tests    | `packages/engine/src/cards/spoiler/units/*.test.ts` (5+ files)                                                                                          |
| Program card tests | `packages/engine/src/cards/spoiler/programs/*.test.ts`                                                                                                  |
| Engine test files  | `packages/engine/tests/attack.test.ts`, `player-prompt.test.ts`, `win-condition-deck-out.test.ts`, `flow/two-turns*.test.ts`                            |

**Approach:** Use a scripted find-and-replace. The pattern is always a
standalone statement `engine.passToAttackPhase()` on its own line. Delete the
entire line. Verify with `vp test` after the bulk removal.

### 5.2 Verify

- [ ] `vp test` from `packages/engine`.
- [ ] `vp test` from `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk`.
- [ ] `bun run ci:cyberpunk:check` from repo root.

---

## Phase 6 — Stale Phase Value Comparisons in Simulator (Medium Priority)

These files compare against `"play"` or `"attack"` which are no longer valid
`GamePhase` values.

### 6.1 Test assertions using old phase values

| File                                                                                                       | Line           | Current          | Target         |
| ---------------------------------------------------------------------------------------------------------- | -------------- | ---------------- | -------------- |
| `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/pages/autoAttackFlow.test.ts` | 212            | `toBe("attack")` | `toBe("main")` |
| `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/pages/autoAttackFlow.test.ts` | 229            | `toBe("play")`   | `toBe("main")` |
| `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/e2e/specs/two-turns.spec.ts`  | 54,106,122,136 | `toBe("play")`   | `toBe("main")` |
| `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/e2e/specs/play-card.spec.ts`  | 24             | `toBe("play")`   | `toBe("main")` |

### 6.2 Observation harnesses

| File                                                                                                                          | Line | Current                 | Target                  |
| ----------------------------------------------------------------------------------------------------------------------------- | ---- | ----------------------- | ----------------------- |
| `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/e2e/observation/deep-observation.harness.ts`     | 651  | `snap.phase === "play"` | `snap.phase === "main"` |
| `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/e2e/observation/practice-observation.harness.ts` | 410  | `snap.phase === "play"` | `snap.phase === "main"` |

### 6.3 Animation test fixtures

| File                                                                                                         | Line | Current                      | Target                                                                            |
| ------------------------------------------------------------------------------------------------------------ | ---- | ---------------------------- | --------------------------------------------------------------------------------- |
| `packages/engine/src/animation/builder.test.ts`                                                              | 457  | `from: "play", to: "attack"` | `from: "main", to: "main"` (no separate phase transition) or remove the test case |
| `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/animation/event-sounds.test.ts` | 110  | `from: "play", to: "attack"` | Same as above                                                                     |

> **Note:** Since attacks are now steps within the main phase, there is no
> `phaseChanged` event from `"play"` to `"attack"` in the current engine.
> These test fixtures may need to be removed or replaced with a different event.

### 6.4 Additional test files with old phase names

| File                                                                                                                  | Line        | Change                          |
| --------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------- |
| `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/components/Prompt/PromptBanner.test.tsx` | 696         | `toBe("play")` → `toBe("main")` |
| `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/components/GameBoard/CenterRow.test.tsx` | 638,653,708 | `toBe("play")` → `toBe("main")` |

### 6.5 Verify

- [ ] `vp test` from `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk`.
- [ ] `vp test` from `packages/engine`.

---

## Phase 7 — Scenario IDs and Labels (Medium Priority)

### 7.1 Rename scenario IDs

**File:** `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/types/e2e.ts`

| Line | Current            | Target            |
| ---- | ------------------ | ----------------- |
| 66   | `"attackPhase"`    | `"attackStep"`    |
| 68   | `"defensivePhase"` | `"defensiveStep"` |

### 7.2 Update scenario definitions

**File:** `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/core.ts`

| Line   | Current                                  | Target                              |
| ------ | ---------------------------------------- | ----------------------------------- |
| 44     | `id: "attackPhase"`                      | `id: "attackStep"`                  |
| 46     | `label: "Attack phase · Your turn"`      | `label: "Attack step · Main phase"` |
| 54, 73 | Update labels referencing "Attack phase" | Use "Attack step"                   |

**File:** `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/shared.ts`

| Line | Current                               | Target                              |
| ---- | ------------------------------------- | ----------------------------------- |
| 106  | `attackPhase: "scenario:attackPhase"` | `attackStep: "scenario:attackStep"` |

### 7.3 Remove `passToAttackPhase()` calls from scenarios

These are covered in Phase 5.1 but worth calling out specifically:

- `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts` line 47
- `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/legends.ts` line 547
- `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/gears.ts` lines 198, 256

### 7.4 Verify

- [ ] `vp test` from `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk`.

---

## Phase 8 — Legend Test Fixture Constants (Low Priority)

### 8.1 Fix `CALL_COST = 2` constants

| File                                                                                 | Line       | Change                                                                                                                                |
| ------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/engine/src/cards/spoiler/legends/river-ward-detective-on-the-hunt.test.ts` | 20, 27, 35 | `CALL_COST = 2` → `CALL_COST = 1`; update `eddies: 2` fixtures to `eddies: 1` (check if any test needs 2 eddies for multiple actions) |
| `packages/engine/src/cards/spoiler/legends/panam-palmer-nomad-cavalry.test.ts`       | 15, 22     | Same pattern                                                                                                                          |
| `packages/engine/src/cards/alpha/units/goro-takemura-losing-his-way.test.ts`         | 26         | Same pattern                                                                                                                          |

> **Caution:** Some tests may set `eddies: 2` because the test plays a card
> AND calls a legend in the same test. In those cases, the fixture value should
> be the sum of the card cost + legend call cost (1), not just the call cost.
> Review each test individually before changing.

### 8.2 Audit other legend/unit test fixtures for `eddies: 2`

Run a targeted grep for `eddies: 2` or `eddies:\s*2` in test files under
`packages/engine/src/cards/` to find any additional fixtures that should be
updated.

### 8.3 Verify

- [ ] `vp test` from `packages/engine`.

---

## Phase 9 — Animation Recipe Naming (Low Priority)

### 9.1 Rename `playPhaseChange` → `phaseChange`

**File:** `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/animation/recipes/phaseChange.ts`

| Line | Current                  | Target               |
| ---- | ------------------------ | -------------------- |
| 4    | `PlayPhaseChangeOptions` | `PhaseChangeOptions` |
| 29   | `playPhaseChange`        | `phaseChange`        |

> **Note:** The initial grep for imports of this function returned no results,
> suggesting it may be imported dynamically or through the ScriptPlayer barrel.
> Verify before renaming.

### 9.2 Verify

- [ ] `vp check` from `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk`.

---

## Phase 10 — Engine Comments and Doc Updates (Low Priority)

### 10.1 Update `test-fixtures.ts` comment

**File:** `packages/engine/src/testing/test-fixtures.ts`

| Line | Current               | Target                |
| ---- | --------------------- | --------------------- |
| 49   | `"Defaults to "play"` | `"Defaults to "main"` |

### 10.2 Update `keep-hand.ts` JSDoc

**File:** `packages/engine/src/moves/keep-hand.ts`

| Line | Current                             | Target                               |
| ---- | ----------------------------------- | ------------------------------------ |
| 14   | `"auto-advances to the play phase"` | `"auto-advances to the start phase"` |

### 10.3 Update all test describe blocks and comments

Bulk-rename the following in test files (comments only, no behavior change):

- `"Play Phase"` → `"Main Phase"` in describe blocks
- `"Attack Phase"` → `"Attack Step"` in describe blocks
- `"Ready Phase"` → `"Start Phase"` in describe blocks
- Comment annotations like `— PLAY PHASE ──` → `— MAIN PHASE ──`
- Comment annotations like `— READY PHASE ──` → `— START PHASE ──`
- `"PLAY PHASE — actions"` → `"MAIN PHASE — actions"`

Key files (non-exhaustive):

| File                                                                                                      | Lines                                                |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `packages/engine/tests/play-phase.test.ts`                                                                | 12 (describe block), potentially filename            |
| `packages/engine/tests/flow/ready-phase.test.ts`                                                          | 13, 26, 295                                          |
| `packages/engine/tests/flow/two-turns.test.ts`                                                            | 13, 86, 122, 137, 152, 164, 169, 176                 |
| `packages/engine/tests/flow/two-turns-with-moves.test.ts`                                                 | 5, 8, 15, 123, 157, etc.                             |
| `packages/engine/tests/test-engine.test.ts`                                                               | 15                                                   |
| `packages/engine/tests/player-prompt.test.ts`                                                             | 63, 77                                               |
| `packages/engine/tests/win-condition-deck-out.test.ts`                                                    | 40, 129                                              |
| `packages/engine/tests/attack.test.ts`                                                                    | 20, 33, 43, 56, 72, etc. (describe block + comments) |
| `packages/engine/src/moves/play-card.test.ts`                                                             | 36, 132                                              |
| `packages/engine/src/moves/gain-gig.test.ts`                                                              | 19                                                   |
| `packages/engine/src/testing/test-state.test.ts`                                                          | 57                                                   |
| `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/e2e/specs/two-turns.spec.ts` | 58, 103, 119, 133, 148, 155                          |

### 10.4 Verify

- [ ] `vp test` from `packages/engine`.
- [ ] `vp test` from `submodules/agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk`.
- [ ] `bun run ci:cyberpunk:check` from repo root.

---

## Phase 11 — `attackRival` Naming (Low Priority, Large Scope)

**Problem:** 378+ occurrences of `attackRival` across the codebase. The Beta
rules say players "attack the Rival's Gig area" instead of "attacking the
Rival directly." The blog states there is **no gameplay change**, only a
conceptual/terminology rename.

> **Decision needed:** This is the largest single rename in the plan (~378
> occurrences across engine, tests, simulator, card tests, e2e types, animation
> tests). Given the blog says "functionally no gameplay change," this can be
> deferred to a follow-up PR if desired.

### 11.1 If proceeding with rename

| Current                                                   | Target                                                                                               |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `attackRival` (move name)                                 | `attackGigArea`                                                                                      |
| `AttackRivalInput`                                        | `AttackGigAreaInput`                                                                                 |
| `attackRivalMove`                                         | `attackGigAreaMove`                                                                                  |
| `move.attackRival` (message key)                          | `move.attackGigArea`                                                                                 |
| `"move.attackRival": "{attackerName} attacked directly."` | `"move.attackGigArea": "{attackerName} attacked the gig area."`                                      |
| `AttackRivalLog` (type)                                   | `AttackGigAreaLog`                                                                                   |
| `attack-rival.ts` (file)                                  | `attack-gig-area.ts`                                                                                 |
| `engine.attackRival()` (test helper)                      | `engine.attackGigArea()`                                                                             |
| `rivalId` in `AttackState`                                | Keep as-is — `rivalId` refers to the opponent player, which is a different concept from the gig area |

### 11.2 Verify (if proceeding)

- [ ] Full `bun run ci:cyberpunk:check` from repo root.

---

## Phase 12 — Future: QUICK Keyword (Not Yet Implemented)

The Beta rules introduce a new **QUICK** keyword usable during the React
(defensive) step. The blog says full details are coming in a follow-up article.

**No action now.** Track as a follow-up:

- [ ] When Beta keyword details are published, design the QUICK keyword type
      and validation logic.
- [ ] Integrate into `AttackStep` validation in `call-legend.ts` and any new
      move that handles QUICK abilities.
- [ ] Add QUICK to the card definition keywords union type.

---

## Phase 13 — Future: "React" Window Naming (Cosmetic)

The Beta rules call the defender's response window "React." The engine
implements this as `"defensive"` in `AttackStep`. The concept is correct and
fully implemented.

**No action now.** If Beta materials standardize on "React," rename:

- `"defensive"` → `"react"` in the `AttackStep` union type
- All 44+ references to "defensive step" in comments, tests, error messages,
  and log keys
- `useBlocker.ts` error messages: `"Not in defensive step"` → `"Not in react window"`

---

## Execution Order Summary

| Phase | Priority    | Scope                                 | Risk                          |
| ----- | ----------- | ------------------------------------- | ----------------------------- |
| 0     | —           | Branch + baseline                     | None                          |
| 1     | 🔴 Critical | Engine behavior (Start Phase order)   | **High** — affects game logic |
| 2     | 🔴 High     | 3 error strings                       | Low                           |
| 3     | 🔴 High     | UI labels (3 components)              | Low                           |
| 4     | 🟡 Medium   | Function name + comments              | Low                           |
| 5     | 🟡 Medium   | Deprecated no-op removal (~130 sites) | Medium — bulk delete          |
| 6     | 🟡 Medium   | Stale phase value comparisons         | Medium — tests may break      |
| 7     | 🟡 Medium   | Scenario IDs + labels                 | Low                           |
| 8     | 🟢 Low      | Test fixture constants                | Low — needs per-test review   |
| 9     | 🟢 Low      | Animation recipe naming               | Low                           |
| 10    | 🟢 Low      | Comments and doc strings              | None                          |
| 11    | 🟢 Low      | `attackRival` rename (378+ sites)     | Medium — largest rename       |
| 12    | ❌ Future   | QUICK keyword                         | N/A                           |
| 13    | ❌ Future   | "React" naming                        | N/A                           |

Phases 1-3 should land in a single PR. Phases 4-10 can follow in a second
PR. Phase 11 (`attackRival`) can be a dedicated third PR given its size.
Phases 12-13 are tracked for when Beta materials provide more detail.
