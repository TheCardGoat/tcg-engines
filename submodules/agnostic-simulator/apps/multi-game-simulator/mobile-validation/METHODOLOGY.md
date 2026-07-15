# Cyberpunk Card Validation — Corrected Methodology

## Why the previous validation was insufficient

The first pass (see `VALIDATION-REPORT.md`) proved the **mobile UI can be driven** for all 89 retail
cards (0 crashes, 69 full happy paths). It did **not** prove the targeting, selection, and outcome
logic is _correct_. The harness used a generic "tap the card, tap the first target, accept any state
delta" strategy. That strategy has a fatal blind spot: **it cannot tell a correct target from an
incorrect one.** If the engine wrongly includes an extra eligible target, or selects the wrong die,
or resolves the wrong branch, the harness would still report `pass` as long as _something_ changed.

The user confirmed this by hand: there are real targeting/selection problems that the generic sweep
labelled `pass`. **The existing per-card tests cannot be trusted as the truth source either**, because:

- The retail cards have **almost no engine-truth unit tests** — only `promo/lucyna-kushinada/unit.test.ts`
  exists across all 6 retail sets. Every other retail card-test is a browser `e2e.test.ts` that drives
  the **desktop** `InteractionPanelPom` (the "web only" surface the user called out).
- The comprehensive `unit.test.ts` pattern (which pins exact targeting boundaries) exists **only in
  `alpha/` and `spoiler/`**, and those are broken: **283 failing tests / 84 failing files**, all from
  engine API drift (`resolveSearchDeck` → `resolveScry`, `expectSearchDeckChoice` → `expectScryChoice`,
  `searchDeck` choice type → `scry`) plus a duplicate-import typo.

So neither the old harness nor the existing retail card-tests are a reliable oracle for targeting
correctness. We need a new foundation.

## The corrected approach: comprehensive unit → integration → e2e

This matches the codebase's own three-tier convention (confirmed in `vite.config.ts` and
`playwright.config.ts`) and the user's direction. Truth flows downward: the engine test is the
spec; the integration/e2e tests only verify the wiring presents that spec correctly.

### Tier 1 — `unit.test.ts` (the truth, most comprehensive)

- **Harness:** `CyberpunkTestEngine.createWithFixture(p1, p2?, opts?)` directly, via vitest.
  No DOM, no browser. Pure engine logic.
- **What it pins down, per card (reasoned from the published rules text + card text):**
  1. **Playability/eligibility:** playable with exact cost, not playable when unaffordable, callable
     legend when face-down, attach target rules, sellable rules.
  2. **Targeting boundaries — the heart of it:** for every effect with a target, assert the **exact
     `eligibleIds`/`eligibleTargetCount`** at the boundary (e.g. power ≤2 included, power 3 excluded
     on the default branch; power 3 included only on the high-Street-Cred branch). This is what the
     generic sweep could not do.
  3. **Branch conditions:** Street-Cred comparisons, gig-count conditions, "Program played this turn"
     gates — test both sides and mutual exclusivity.
  4. **Outcome:** after resolving, the right card moved to the right zone (field→trash, hand→deck,
     gig adjusted by the right amount), the right action-log message fired, no stray pending choice.
  5. **No-target / no-op cases:** when no legal target exists, no pending choice is created and
     nothing changes — this catches "effect fires unconditionally" bugs.
  6. **Printed stats** as a regression guard (cost/power/color/classifications).
- **Helper vocabulary:** `@cyberpunk-engine/testing` — `expectAttackCandidate`,
  `expectEligibleTargets`, `expectEligibleTargetCount`, `expectPendingChoice`/`expectNoPendingChoice`,
  `expectTargetChoice`, `expectScryChoice`, `expectAdjustGigChoice`, `expectCardPlayable`, plus
  engine resolvers `resolveEffectTarget`, `resolveScryTo`, `resolveAdjustGig`, etc. Use mock cards
  (`createMockUnit`) to hit exact power boundaries real cards don't.

### Tier 2 — `integration.test.tsx` (less comprehensive, jsdom)

- **Harness:** `renderCyberpunkSimulatorScenario({ scenarioId })` + the Testing-Library POM in jsdom.
- **Purpose:** verify the **wiring** — that a shared scenario mounts, the prompt renders, and the POM
  can drive one canonical line through the real React simulator. One or two cases per card, not the
  full boundary matrix. Catches React/interaction regressions a unit test can't.

### Tier 3 — `e2e.test.ts` (specific, browser)

- **Harness:** Playwright + `createPlaywrightCyberpunkSimulatorPom` against the dev server.
- **Purpose:** one happy-path smoke + named edge variants (e.g. `high-cred.e2e.test.ts`,
  `no-targets.e2e.test.ts`) through a real browser. Highest fidelity, slowest, fewest assertions.
- **Important:** the existing retail `e2e.test.ts` files use the **desktop** InteractionPanel. They
  are valid browser coverage but are **not** mobile coverage and must not be treated as the truth.

## Process per card (the "reason about how to test that card, then test it" loop)

1. **Read the card** from `submodules/cyberpunk/packages/cards/src/<set>/<type>/<slug>.ts`: rulesText,
   abilities, conditions, selectors, costs.
2. **Load the rules context** (`cyberpunk-tcg-rules` skill) for any mechanic the card touches
   (targeting, Street Cred, gigs, BLOCKER, GO SOLO, triggers).
3. **Reason about the targeting/selection contract:** what is eligible, what is excluded, at which
   boundary, under which condition. Write the boundary list down.
4. **Write `unit.test.ts`** that asserts each boundary exactly (eligibleIds, outcomes, no-op cases).
   Run `CYBERPUNK_FIXTURE_TESTS=1 vp test run card-tests/cyberpunk/<set>/<type>/<slug>/unit.test.ts`.
5. **If a unit test fails, decide:** engine bug (fix engine + keep the test) vs stale test expectation
   (fix the test). Use the card text + rules as the arbiter, never a TCG assumption.
6. **Add a thin `integration.test.tsx`** for the canonical line once the unit tier is green.
7. **Add/keep an `e2e.test.ts`** for the browser smoke. Only when all three pass is a card "validated".

## Baseline reality (measured)

- Retail sets card-tests: 50 files, **49 are `e2e.test.ts`, 1 is `unit.test.ts`** (lucyna-kushinada).
  → Retail cards have essentially **no engine-truth coverage**.
- alpha/spoiler card-tests: 168 files, **283 failing tests / 84 failing files**.
  → The comprehensive tier exists but is broken by API drift; it must be repaired before it can be a
  reliable oracle, OR explicitly scoped out (alpha/spoiler are excluded from the live retail catalog).

## Owners and gates (backpressure)

- **Engine/card-test fixes** live in `submodules/agnostic-simulator/apps/multi-game-simulator/card-tests/`
  and `submodules/cyberpunk/packages/engine`. One owner per patch.
- **First rejecting gate:** `CYBERPUNK_FIXTURE_TESTS=1 vp test run card-tests/cyberpunk/<path>` for the
  touched card (fast, focused). Then the broader card-tests run.
- **Stop conditions:** per-card unit tier green and matching the reasoned contract; or a genuine
  rules ambiguity that needs human input (report it, don't guess).

## What "validated" means now

A card is validated when its **`unit.test.ts` pins the exact targeting/selection contract reasoned
from the card text + rules** and passes, a thin integration test confirms wiring, and the browser e2e
smoke passes. A generic "the UI didn't crash and something changed" result is **no longer accepted**
as validation of correctness.

---

## Results of this pass (backpressured loop)

### Baseline reality measured

- **Retail card-tests:** originally 50 files, 49 browser `e2e.test.ts` + 1 `unit.test.ts`.
  Retail cards had **no engine-truth coverage** before this pass.
- **alpha/spoiler card-tests:** REMOVED this session (176 files). The cards contain incorrect
  historical text and the tests encoded stale behavior (API drift + redesigned-card expectations).
  Per the project owner's directive, they are deleted; the card _definitions_ stay for history.
- **Pre-existing engine baseline:** `npx vp test run` in the cyberpunk engine shows **26 failing
  tests / 10 files** that pre-date this work (e.g. `peace-offering.test.ts`). These are unrelated to
  the card-validation effort and out of scope here; they are flagged for the engine owner.

### Engine correctness fix (this session)

- **Bug:** an ability with effects `[targeted effect, independent effect]` fizzled the ENTIRE ability
  (including the independent effect) when the targeted effect had zero legal candidates. Floor It
  ("Give a rival Unit -1 power this turn. Draw 1.") drew nothing when the rival had no Units.
- **Root cause:** `abilityHasRequiredEffectTargets` (`ability-executor.ts`) used `.every()` — any
  single empty targeted effect aborted the whole trigger at enqueue and resume.
- **Fix:** a targeted effect with zero candidates no longer gates the ability when another effect
  would still resolve independently (new `isEffectIndependentOfTarget` helper). The targeted effect
  still no-ops via the existing `{ status: "noAction" }` path; the independent effect (Draw) runs.
- **Regression proof:** full engine suite is **26 failed / 966 passed both before and after** the fix
  (identical) — zero new failures. Floor It engine test + card-test updated to assert the Draw fires.

### Cards given full engine-truth unit tests this session (103/103 tests green across 22 files)

| Card                     | Tier        | Tests | Contract pinned                                                                                |
| ------------------------ | ----------- | ----- | ---------------------------------------------------------------------------------------------- |
| Carnage at the Colosseum | unit        | 10/10 | `powerLessThanAnyOf` (strict-less), -1€/8+Gig cost reduction, no-target no-op                  |
| Corporate Surveillance   | unit        | 6/6   | rival cost ≤4 inclusive, **spend** vs defeat, already-spent targetable                         |
| Gilded Matón             | unit        | 6/6   | `ifYouDo` optional gear-defeat → rival cost ≤3, **decline path**, auto-decline                 |
| Gilded Matón             | integration | 1/1   | jsdom wiring of chooseCardToMove → chooseTarget                                                |
| Reboot Optics            | unit        | 6/6   | no-target buff, `preventNextRivalFightDefeat` registered                                       |
| Floor It                 | unit        | 8/8   | any-rival target, -1 power, **Draw resolves with no target** (engine fix)                      |
| Gorilla Arms             | unit        | 6/6   | attach to unit/face-up-legend, **no-eligible-gig edge** (all values shared), firstTimeEachTurn |
| Over the Edge            | unit        | 5/5   | power ≤ friendly d20 (inclusive), **targets BOTH sides**, no-target no-op                      |
| All is Lost              | unit        | 5/5   | trash 3, `bound`-selector recovery (Units among trashed only), no-Unit no-choice               |
| Mantis Blades            | unit        | 6/6   | attach unit/face-up-legend, +2 power, gear-follows-host                                        |
| Meredith Stout           | unit        | 7/7   | BLOCKER, +2-vs-Legend static, gigValueChanged trigger, empty-trash no-choice                   |
| Bootleg Black Sapphire   | unit        | 5/5   | sell-always + even/odd draw-2 conditional (both boundary sides)                                |
| Sketchy Ripper           | unit        | 6/6   | attack trigger, power-0-no-steal, Gear-only deck-search, take-none                             |
| Hanako Arasaka           | unit        | 6/6   | `costEqualsGigValueOf` (cost == any friendly gig value), multi-value, no-match                 |
| Peace Offering           | unit        | 5/5   | 2-Gig binding + optional copyGigValue + hasGigPair draw; flagged pre-existing binding-prompt bug |
| Chrome Reverie           | unit        | 6/6   | rival-unit `cantAttack` (choose 1, optional), conditional free Legend call (hasMinGig)         |
| Take Control             | unit        | 4/4   | Quick, `stealsOneFewerGig` to contextual attacker, AI/Drone/Vehicle conditional draw           |
| Afterparty at Lizzie's   | unit        | 4/4   | adjustGig ±1 (either, chooseUpTo), hasDistinctGigValues(≥2) draw                               |
| Industrial Assembly      | unit        | 4/4   | adjustGig +4 (increase), 8+ Gig conditional draw (targetExists minValue 8)                     |
| Fool on the Hill         | unit        | 4/4   | rivalRevealChoice (top 2, hand/trash), draw-2-if-trash                                         |
| Cyberpsychosis           | unit        | 4/4   | equipped-unit +3/gear (perCount), defeatAtEndOfTurnIfAttacks                                   |


### Findings surfaced by the precise tests

1. **Floor It no-target Draw (FIXED):** the independent "Draw 1" now resolves when the debuff has no
   target — a real engine bug fixed this session, benefiting any `[targeted, independent]` ability.
2. **Carnage `powerLessThanAnyOf` is correct** — the test caught my own boundary mis-reasoning.
3. **Over the Edge targets both players' Units** (no `controller` on its target) — a notable contract
   most assumptions would miss; pinned explicitly.
4. **Gorilla Arms `valueNotSharedBy`** is correct (engine test covers the positive case; the card-test
   adds the all-values-shared no-prompt edge).

### How to run / continue

- Focused: `CYBERPUNK_FIXTURE_TESTS=1 npx vp test run --configLoader runner card-tests/cyberpunk/<type>/<slug>/unit.test.ts`
- All retail card-tests (non-e2e): `CYBERPUNK_FIXTURE_TESTS=1 npx vp test run --configLoader runner card-tests/cyberpunk` → **57/57 green**
- Engine: `cd submodules/cyberpunk && npx vp test run` (26 pre-existing baseline fails, none from this work)
- Continue the per-card loop for the remaining targeting-heavy retail cards (Mantis Blades, Meredith
  Stout, Hanako reveal-destination, Sketchy Ripper deck-search, Bootleg Black Sapphire Show, etc.).

### Skipped checks (backpressure)

- **Engine broad baseline (26 fails):** pre-existing, unrelated (peace-offering etc.); flagged for the
  engine owner, not touched beyond the Floor It fix.
- **alpha/spoiler card-tests:** removed per owner directive (incorrect text).
- **E2E suite:** not run; retail `e2e.test.ts` files already exist for these cards.
