# Gundam Selective Combat Strategy Iteration

## Goal

Improve the promoted `strategic` bot's attack-target and Blocker decisions while
preserving deterministic, rules-legal end-to-end play.

## Fixed baseline

- Parent strategy: engine-exported `strategic`.
- Paired evaluation uses identical seeds, decks, and both seats.
- Experimental code remains in `tools/bot-bench` until promotion.
- Existing simulator/UI worktree changes are out of scope and must be preserved.

## Hypotheses

1. Rank attacks with effective Unit stats rather than printed stats.
2. Prefer favorable Unit combats and avoid losing a more valuable attacker for
   a lower-value target when direct pressure is available.
3. Decline optional blocks that lose more board value than they protect.
4. Preserve a Unit, Base, Shield, or the game with the lowest-cost effective
   blocker that produces the best combat outcome.
5. Combine only independently safe levers, then tune the direct-pressure and
   sacrifice thresholds without changing unrelated strategy families.

## Acceptance gates

- Rules-facing scenario tests cover direct attacks, Unit combat, Blocker,
  First Strike, High-Maneuver, Base-before-Shield damage, and lethal defense.
- Every bench family has attempts and successes with zero hard failures.
- Each screen is paired across `ef-starter`, `seed-aggro`, and `gd01-mixed`,
  with both seats and a predeclared seed.
- Reject a hypothesis if any deck cell regresses by more than 5 percentage
  points at the confirmation gate.
- Promote only after an untouched holdout of at least 240 paired blocks and a
  positive 95% confidence interval for the aggregate delta.
- Re-run focused engine and BotLab tests, deterministic replay, and strict
  end-to-end simulation after promotion.
- If the promoted policy changes visible play, validate one complete match in
  the built-in browser and inspect screenshots/log visibility on desktop and
  mobile. Do not use Playwright.

## Stop conditions

- Stop after six coherent combat hypotheses if none clears the confirmation
  gate; report the strongest rejected result instead of overfitting.
- Stop immediately on rules illegality, nondeterminism, or benchmark integrity
  failure until the underlying problem is understood.

## Progress

- [x] Re-read Gundam combat and keyword rules.
- [x] Capture current baseline diagnostics.
- [x] Add isolated experimental combat policies and focused tests.
- [x] Run paired screens and reject weak variants.
- [x] Confirm the best stack on a larger multi-deck evaluation.
- [x] Run untouched holdout and promote only if all gates pass.
- [x] Run replay, engine, BotLab, and built-in browser validation.

## Results

- Six coherent variants isolated effective-stat attacking, selective blocking,
  their combination, and three Shield-sacrifice thresholds.
- The experimental combined policy passed its untouched 240-block holdout at
  +5.63 percentage points, 95% CI +1.66 to +9.48, with zero hard failures.
- The canonical `combat-aware` strategy independently passed 240 blocks / 640
  matches at +5.52 points, 95% CI +1.88 to +9.27. Deck cells were +13.13 EF,
  +2.19 mixed, and +1.25 SEED; all 640 matches ended by rules win.
- BotLab promoted `combat-aware` over `strategic`; doctor and deterministic
  replay passed on the promoted default.
- A strict 48-match `combat-aware` mirror completed with 48 rules wins, 52/52
  successful blocks, deliberate block passes, zero rejected moves, and an
  exact replay.
- Final gates passed: 105 engine files / 641 tests, 13 Bot Bench tests, 15
  BotLab tests, and all focused type/lint checks.
- Built-in-browser validation completed without Playwright: Ace resolves to
  `combat-aware`; mulligan, card art, combat targeting, desktop logs, and the
  mobile top-rail log overlay rendered correctly; the mirror completed on Turn
  10 after 121 moves with no browser warnings or errors.
