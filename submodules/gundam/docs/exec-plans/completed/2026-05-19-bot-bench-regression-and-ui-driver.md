# Bot Bench Regression And UI Driver

## Goal

Enhance `tools/bot-bench` without removing its current benchmark/diff workflow:

- keep current strategy-vs-strategy reports, family stats, report diffing, and sample coverage scripts
- add Cyberpunk-style regression harness capabilities for illegal/stuck/max-action/determinism detection
- add a browser/UI driver that uses the simulator UI like a player, so automated runs can catch UI/UX gaps that engine-only self-play cannot see

## Current State

`tools/bot-bench` currently drives the engine directly through `playMatch(runtime, strategies, staticResources, ...)`.

Strengths:

- structured JSON reports
- same-seed baseline/candidate diffing
- per-candidate-family attempt/success/failure/error-code telemetry
- registered real sample decks
- local experimental strategy registry

Limitations:

- it does not produce replayable per-action recordings with determinism parity checks
- it treats `max-actions-exceeded` and `concede-failed` as report data, not first-class regression failures
- it does not emulate a player clicking/typing through the simulator UI
- it cannot catch UI-only bugs such as missing buttons, inaccessible prompts, bad targeting affordances, overlays blocking clicks, or command mapping drift between UI and engine

## Design

Split bot-bench into three compatible layers.

### 1. Engine Bench Layer

Keep the existing `runBench` API and report schema. Add optional stricter regression classification rather than changing existing semantics.

New capabilities:

- `--fail-on non-game-won,max-actions,concede-failed,error-code`
- optional deadlock detector using `packages/engine/src/automation/deadlock.ts`
- per-match action recording when requested
- exit codes for CI:
  - `0`: no configured regression
  - `2`: engine/planner regression
  - `3`: replay determinism divergence
  - `4`: UI driver regression

Implementation sketch:

- add `src/regression.ts` for report classification
- extend `BenchOptions` with optional `regressionPolicy`
- keep default CLI behavior compatible: existing bench runs should still write reports and exit 0 unless a strict flag is supplied

### 2. Engine Recording And Replay Layer

Add Cyberpunk-style deterministic recordings around `playMatch`.

Recording contents:

- version
- strategy ids
- deck ids
- seed
- maxActions
- selected candidate per action
- planner outcome
- attempt details
- stateIdBefore/stateIdAfter
- termination/winner/winReason/actionCount/turnCount

Replay behavior:

- rebuild the same runtime with the same seed/decks
- rerun the same strategies
- compare action count, selected candidate, outcome, attempt details, and state IDs
- report divergences with exact action index and field

Implementation sketch:

- add `src/replay.ts`
- add `scripts/replay.ts`
- add `--save-replay <path>` to `bench`
- add `vp run replay -- --path reports/foo.replay.json`

### 3. UI Driver Layer

Add a separate Playwright-backed command that drives the simulator through visible UI controls.

This must not replace engine benching. It should be a slower, smaller, end-to-end smoke tool.

Core idea:

- reuse bot-bench registered strategies and decks
- for each active player, ask the engine-side candidate strategy what it wants to do
- translate the chosen candidate into UI interactions, not direct `runtime.executeCommand`
- click visible buttons/cards/prompts in the browser
- observe the resulting UI state and, where possible, compare it against expected state progress

Initial route:

- use `/bot-vs-bot` or add a dedicated `/bot-bench-ui` route if current spectator wiring blocks player-like interactions
- a dedicated route may be cleaner because `/bot-vs-bot` currently attaches client bots that directly submit through the runtime, which bypasses the UI controls

Driver package shape:

- `src/ui/types.ts`: UI run options, action result, failure shapes
- `src/ui/driver.ts`: browser/page lifecycle and match loop
- `src/ui/intent.ts`: `GundamBotCandidate -> UiIntent`
- `src/ui/adapter.ts`: `UiIntent -> Playwright clicks/selectors`
- `scripts/ui-bench.ts`: CLI wrapper

Preferred selector strategy:

- use accessible roles and names first
- add stable `data-testid` only where the UI lacks a user-facing accessible target
- when adding test ids, keep them semantic and tied to player-visible controls, not implementation internals

Regression categories:

- candidate chosen but no matching UI affordance exists
- UI affordance exists but is disabled when engine candidate is legal
- click succeeds but no state progress occurs
- submit error toast appears for a candidate that engine considered legal
- unexpected modal/overlay blocks the intended action
- match exceeds `maxActions`
- browser console/page errors

## Non-Goals

- Do not remove existing `bench` / `diff` report compatibility.
- Do not make Playwright UI runs the default; they are slower and should be opt-in.
- Do not require UI driver parity for every candidate family in the first pass.
- Do not promote local experimental strategies into the engine as part of this work.

## First Implementation Slice

1. Add engine replay/recording for `playMatch`.
2. Add strict regression classification for `max-actions-exceeded`, `concede-failed`, and replay divergence.
3. Add tests around replay parity and intentional replay divergence.
4. Add a small UI driver proof of concept for setup flow plus one main-phase action family:
   - `chooseFirstPlayer`
   - `alterHand`
   - `passTurn`
   - one of `deployUnit` or `enterBattle`
5. Expand UI intent coverage family by family.

## Verification

- `vp run check` in `tools/bot-bench`
- focused `vp test` for bot-bench replay/regression tests
- simulator Playwright smoke for the UI driver command once the first UI slice exists
- existing `vp run bench` and `vp run diff` workflows must still work unchanged
