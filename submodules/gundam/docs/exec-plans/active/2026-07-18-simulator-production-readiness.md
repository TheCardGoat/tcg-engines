# Gundam Simulator Production Readiness

**Status**: completed
**Owner**: Codex
**Started**: 2026-07-18

## Goal

Make the shared Gundam browser simulator reliable for a complete standard
two-player game, from first-player choice and mulligan through normal play,
combat, effects, defeat, and recovery from invalid interactions. Prove the
result through focused automated checks and in-browser visual evidence rather
than treating fixture boot as sufficient.

## Scope

- In scope: the Gundam UI inside the shared multi-game simulator, Gundam state
  projection and interaction adapters, shared simulator primitives when the
  defect is genuinely game-agnostic, and Gundam engine behavior when a visible
  failure exposes a rules gap.
- In scope: official standard-game rule families from comprehensive rules
  sections 1-11 and 13, including setup/mulligan, phase progression, card play,
  pairing/linking, combat, action timing, effects, limits, defeat, and keyword
  behavior.
- In scope: card image loading, card sizing, desktop/mobile layout, pointer and
  keyboard affordances, drag/drop where the UI presents it, visible prompts,
  logs, animation state, and browser-console/network failures.
- Out of scope: multiplayer variants in section 12, exhaustive validation of
  every printed card definition, matchmaking infrastructure, and deployment.
  Those are separate matrices; representative executable cards are used here
  to prove each simulator and engine rule family.

## Approach

- Inventory existing deterministic fixture routes, RTL tests, engine tests,
  and browser coverage against the comprehensive-rules index.
- Drive setup from the actual UI: choose first player, inspect the initial
  hand, exercise both keep and redraw mulligans, and reach Main Phase.
- Validate one coherent interaction family at a time. Record the initial
  screenshot, perform the player action, record the resulting screenshot,
  inspect DOM state and console errors, and add the smallest rejecting test
  before patching a defect.
- Prefer game-native fixes in the Gundam UI/adapter or engine. Change shared
  simulator code only when the same normalized contract applies across games.
- Add deterministic fixtures only for rule families that cannot be reached
  economically through the natural setup flow.
- Keep an evidence matrix tying each rule family to an automated test, browser
  route, screenshot, and result. Treat missing evidence as unfinished work.

## Verification

- Focused `vp test` invocations for each touched Gundam simulator or engine
  test.
- Package-local `vp check` after each coherent patch batch.
- In-app browser passes at desktop and mobile widths, with screenshots for
  setup, mulligan, deploy/play, combat, prompts/effects, turn transition, and
  representative keyword/limit states.
- Browser console inspection and image-resource validation on every sampled
  state.
- Drag/drop proof for every visible draggable interaction, plus click/tap and
  keyboard alternatives where supplied.
- Full Gundam simulator test suite, recursive workspace type checks, and a
  production client/SSR build after the final shared simulator work.
- Final changeset review for type safety, game-agnostic boundaries, hidden
  information, unrelated worktree changes, and unresolved rule coverage.

## Stop Conditions

- Stop successfully only when all in-scope rule families have passing evidence
  and no unexplained browser errors, broken images, blocked interactions, or
  critical layout failures remain.
- Stop blocked if the same failure remains after a minimal reproduction and one
  focused fix attempt, or if a product decision is required that cannot be
  derived from the rules and existing UI contracts.
- Do not claim production readiness if broad gates fail for touched code. Record
  unrelated baseline failures precisely instead of widening the patch.

## Open Questions

- Which current fixtures are presentation-only and which execute the full
  engine command path? Resolve before counting them as rule evidence.
- Whether card art failures are bad catalog projection, unavailable external
  assets, or fixture-only mock cards. Resolve before changing rendering.
- Which interactions intentionally use click/tap only versus shared drag/drop.
  Do not add drag behavior solely to satisfy the audit if the established
  accessible interaction contract is different.

## Decision Log

- 2026-07-18 — Use official rules v1.7.0 as the behavior source and scope the
  browser campaign to standard two-player play. Multiplayer rules and exhaustive
  per-card verification require separate dedicated matrices.
- 2026-07-18 — Validate the isolated checkout at
  `http://127.0.0.1:4173/gundam/simulator`; leave the unrelated simulator on
  port 5173 untouched.
- 2026-07-18 — Preserve the shared simulator boundary: visible Gundam semantics
  stay in the Gundam adapter/UI, while reusable motion and normalized interaction
  contracts remain game-agnostic.
- 2026-07-18 — Keep the full comms sidebar visible by default on desktop. On
  mobile, expose a log-only sheet from the top rail instead of reproducing the
  desktop sidebar and its unrelated controls.
- 2026-07-18 — Treat pending effects as a blocking automation window. Candidate
  enumeration may expose only effect resolution and out-of-band administration
  there, preventing setup moves from leaking into automatic battle steps.
- 2026-07-18 — Treat `ignoreActivePlayer` moves as genuinely out-of-band for
  both validation and enumeration. This keeps concession available to either
  player regardless of the current phase or priority holder.

## Completion Evidence

- Built-in browser: first-player choice, redraw mulligan, main-phase command
  target, pilot pairing and trigger, unit deployment by native drag/drop,
  First Strike combat, Suppression shield damage, real production card art,
  desktop log default, and the mobile top-rail log sheet.
- Full-game proof: deterministic bot play completed a natural 12-turn,
  87-move match in 13 seconds with `player_two has no shields remaining`.
  Targeted command effects resolved without fallback concession, automatic
  attack-trigger windows did not leak setup moves, and the post-game Timeline
  displayed the structured move/combat/effect history instead of `NO DATA`.
- Responsive proof: bounded 1200×860 desktop board with a 272px default-open
  sidebar; bounded 390×844 mobile board with the log action in the top HUD and
  a dedicated log-only sheet.
- Images: sampled production cards reported valid natural dimensions and no
  blank or broken sources; fixtures use named fallbacks when art is absent.
- Automated proof: 101 Gundam engine test files and 623 tests passed; 70 Gundam
  simulator test files and 263 tests passed; recursive type checks passed across
  all 19 shared-simulator workspaces; production client and SSR builds passed.
- Browser diagnostics: the final natural full-game run reported no console
  warnings or errors.
