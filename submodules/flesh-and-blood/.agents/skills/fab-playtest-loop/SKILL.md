---
name: fab-playtest-loop
description: Run an autonomous Flesh and Blood browser playtest-and-repair loop with deliberate hand planning, QA and UX review, and persistent evidence-backed learning. Use for full simulator games, repeated clean-game acceptance, or /fab-playtest-loop; bot-only benchmark tuning belongs to fab-self-improve-bot.
---

# FAB Browser Playtest Loop

Own four responsibilities together: play well, verify rules and interactions,
make the simulator understandable, and carry lessons into the next game.
The agent chooses moves; POM helpers and bot heuristics are advisers/executors.
This differs from `fab-self-improve-bot`, whose benchmark player is deterministic.

## Start or resume

1. Classify this as FAB-specific work spanning the FAB engine/cards and the
   agnostic simulator's FAB UI/adapters. Read root, `submodules/`, and nearest
   owner `AGENTS.md` files. Preserve shared dirty work and existing running games.
2. Load `fab-rules`, its glossary and master index. Follow its errata-first
   lookup for named cards. Current owner guides govern code ownership; older
   rules-reference prose describing a catalog-only workspace is historical.
3. Read [source-session.md](references/source-session.md) for the inherited
   scenario and failure patterns. Read [lessons.md](references/lessons.md), then
   the selected run's ledger and unresolved findings. Recheck historical claims
   against current source and rendered behavior; prior commentary is evidence
   to investigate, not a ruling or proof that a fix still works.
4. Use [run-record.md](references/run-record.md) to create a unique directory
   under `submodules/flesh-and-blood/reports/browser-playtest/<run-id>/`, or
   resume the explicitly selected run. Record one owner thread, scope, decks,
   clean target, any user limits, URL, browser handles, source/build identity,
   and the exact next action. Do not overwrite a run owned by another session.
5. Default to the source scenario: Malice, Domina of the Dead versus Viserai,
   the Forsaken; manual decisions for both seats; three consecutive clean
   completed games. Here one completed simulator game is the counting unit
   (the source request called these matches). Honor other requested matchups.
6. Check running Docker services and checkout ownership before starting anything.
   Use the root Docker launcher for full-platform work; follow the owning
   simulator guide for standalone development. Discover the actual URL/port.
   If collaborators' HMR resets games, checkpoint and use an isolated local
   build/preview of the same source for stable full-game evidence. Preserve
   the required dev/browser interaction check for behavioral simulator fixes.
7. Verify deck names, counts, pitch colors, starting equipment, sideboard, hero
   faces, seed, and turn order through setup. Record any supported correction
   explicitly; never silently replace or drop a card to make a fixture load.
   Verify bots/auto-decisions are disabled for both manually played seats and
   priority settings retain useful response windows.

## Observe, plan, act, verify

Use the in-app browser in Codex Desktop. Start from a current screenshot and
accessible UI state. One practice tab with the real take-control control is
valid for manual two-seat practice; it is not proof of network multiplayer.
Use two isolated player sessions when multiplayer validation is requested.

At every new hand, before the next decision for that seat, write a short
**decision brief** in the game record: current face/life, hand and public board,
likely win condition, intended attacks and targets, pitch allocation, defense
reserve, equipment/other board resources, arsenal choice, resource/action-point
budget, and a fallback if the opponent disrupts the line. Consider at least one
plausible alternative when a meaningful choice exists. Explain the tradeoff in
a few sentences; do not transcribe private internal reasoning.

Keep separate plans for the two seats. Decisions may use that seat's own hand
and information legally known to it plus public history. Do not use the other
seat's private hand, face-down arsenal, seed-derived draw order, or omniscient
engine snapshots to choose moves. When one agent plays both seats, this is an
information-discipline convention, not proof of independently blind play.

For **each decision window**, including defense, reactions, pitch, targets,
optional effects, and end phase:

1. Identify the actual interaction actor and controlled viewer. Turn player,
   priority holder, decision owner, and defense declarer can differ. A missing
   priority owner alone does not establish a deadlock.
2. Check legality and affordability, including activation costs, timing,
   restrictions, action points and conditional go again. Read exact card text
   and verify disputed rules before treating a surprising outcome as a defect.
3. Reassess after an opponent action, draw/banish/reveal, transformation,
   resource change, or trigger changes the plan. Record the chosen action,
   expected result, and a brief reason or reference to the still-valid plan.
   Do not mechanically execute the rest of a precomputed turn.
4. Click one semantic action through visible cards, equipment, targets, or
   dedicated controls. Inspect the fresh rendered state before the next choice.
   Reacquire stale elements after transitions; verify selection counts and
   confirmation state. Never advance whole turns in a blind pass loop.
5. Check the actual result against the prediction: costs, zone movements,
   counters, damage, source/target, triggers, actor, and next available action.
   Inspect the associated log entries and visual feedback now, not only at end.

Inspect the current `FabSimulatorPom` and its DOM driver before reuse. Its
`play`, `pitch`, `blockWith`, `interactionActor`, and related methods are useful
vocabulary, but some helpers use the practice action panel and some batch passes.
Audit the exact helper used. A jsdom POM does not automatically support the
in-app browser; use the browser's documented click APIs or a supported adapter.
Improve the existing POM when a demonstrated gap blocks ordinary player clicks.
Do not inject game commands, mutate hidden state, invoke engine apply from the
browser, or use omniscient automation to manufacture browser completion.

The legal-action/debug panel can help diagnose or legally finish a diagnostic
game when a player control fails. Record the workaround and exclude that game
from the clean streak. Source/engine inspection can explain a failure but cannot
replace the missing browser interaction evidence.

## QA, product, and UX checks during play

- **Agency:** is it clear whose choice is pending, what to select, why an action
  is disabled, and how to confirm, decline, or declare no defense? Exercise
  zero-target effects, equipment selection, duplicates, and target changes when
  they arise naturally; add focused fixtures for important unexercised repairs.
- **Feedback:** can players read attack/defense totals, physical versus arcane
  damage, resources, go again, counters, hero face changes, and zone movement?
  Verify card art aspect ratio, legibility, highlights, overlays, and click
  targets from screenshots; DOM/accessibility text alone cannot prove visuals.
- **Logs:** can a player reconstruct actor, source, target, cost, effect,
  quantity, and ordering? Inspect current combat and History, duplicate/missing
  entries, private information exposure, and correspondence with visible state.
- **Completion:** verify a real terminal win/loss/draw, both seats' final state,
  final logs/history and the available post-game/replay/new-game controls.
  Missing expected post-game surfaces are findings; unavailable platform-only
  surfaces in standalone practice are explicit coverage limits.

Load `impeccable` when diagnosing or repairing a demonstrated UI/UX issue;
keep repairs focused on the observed player difficulty. Follow its relevant
guidance without turning every game into an unrelated redesign.

## Finish, triage, repair, replay

Record observations first as **suspected**. Confirm against authoritative rules
and reproducible interaction evidence, or mark **dismissed** with an explanation.
Separate player mistakes, POM failures, card/engine bugs, adapter projection,
UI/UX/log defects, fixture errors, and environment interruptions.

Finish the current game before editing if meaningful legal play remains possible.
Any workaround makes it diagnostic. If a crash or deadlock prevents progress,
capture the last valid state and minimal reproduction, mark the game unfinished,
and enter repair immediately. Do not force a loss, silently undo/retarget,
reset state, or deliberately concede to get a counted completion.

At game end, fix every confirmed in-scope defect discovered before starting
the next acceptance game. Prefer the owning rule/adapter/UI boundary over
card-specific patches and never change correct gameplay to fit a mistaken plan.
Preserve unrelated edits; inspect overlapping work before modifying it.

- For engine/card behavior, load `fab-test-generation`; add a meaningful public
  move regression with real cards, then run focused owner checks and required
  owner gates. For POM/UI behavior, drive actual DOM interactions and verify
  rendered outcomes, then reproduce the failure path in the real browser.
- Classify UI diffs. Pure presentation changes use desktop/mobile visual proof
  as applicable and skip automated gates under root policy. Changes to prompts,
  semantic copy, interaction, focus, or logs need the smallest behavioral check
  plus required owner gates. Documentation-only notebook/skill updates need no
  product tests. Never run broad gates just for a visual or documentation edit.
- Refresh the serving build after a behavioral repair, verify its identity,
  and replay the failed sequence. A test passing while the browser still runs
  old code leaves the finding open. A focused fixture is regression proof,
  not a completed acceptance game.

## Learn without teaching the loop mistakes

After each game, compare plans with outcomes. Record a few consequential
decisions: what was known, chosen line, missed timing/cost or UI cue, better
legal alternative, and a concrete situation to test next game. Correct earlier
misclassifications explicitly. Do not infer poor play from losing alone.

Append evidence to the run record; promote only reusable supported lessons to
[lessons.md](references/lessons.md). Give each lesson a scope, rule/evidence
links, confidence, counterexamples, validation status, and next check. Read
relevant lessons before the next hand/game. Strategy hypotheses remain candidates
until a later independent situation supports them; reject or supersede lessons
contradicted by current rules or new evidence.

Self-improvement may update this skill's procedural references, the POM, and
in-scope product paths when a demonstrated failure warrants it. Record each
instruction change's before/after, motivating evidence, validation, and rollback
condition in the run. Never rewrite user scope, evidence standards, permissions,
or clean-game acceptance to make the loop succeed. Do not edit global Codex
memory as part of this workflow; the repo notebook is its learning store.

Bot-policy edits are optional and require an actual reusable bot mistake. Use
`fab-self-improve-bot` for that bounded benchmark subtask while retaining manual
browser play for this loop. Validate situation behavior and paired same-deck,
same-seed seat exchange plus fresh seeds. Report caps/stalls/errors as unfinished.
Three clean browser games establish observed usability, not improved win rate.

## Acceptance and persistence

Increment the clean streak only after a full, uninterrupted game on the verified
build passes all applicable checks, with no confirmed defect, unresolved
suspicion, debug fallback, state manipulation, automation takeover, or missing
terminal/log/visual evidence. A dismissed suspicion with supporting evidence is
not a defect. A strategic loss can be clean if played deliberately and correctly.

Reset the streak on a confirmed issue, an unfinished/invalidated game, or a
relevant source/deck/build change. Keep same-seed retries for regressions, but
do not count three copies of one scripted opening as breadth: include fresh
deals and both starting seats across the streak, using supported setup controls.
Verify that seed/turn-order changes actually took effect; a URL cache-buster is
not a new seed. If the fixture cannot vary them, repair setup or disclose the
coverage blocker before claiming acceptance.

Close only when the target streak is reached, all run findings are resolved or
rules-backed dismissals, and the latest lesson changes have been checked in
subsequent play or are explicitly still hypotheses. Report remaining coverage
limits without claiming universal correctness.

Checkpoint after each hand, finding, game, and repair, and before a context or
time limit. Resume by reading records and verifying the live state first.
Continue within the active task without asking after every game. On an explicit
limit, user pause, missing browser, or external blocker, save the exact next
action and mark paused/blocked, never complete. Respect any host goal tool's own
rules; a run ledger is not authority to create or complete a host goal. No daemon
or recurring schedule is implied by this skill.
