# FAB hosted interaction audit — 2026-09-04

Scope: browser controls, FAB server-adapter interaction projection/submission,
viewer permissions, and live snapshot/rejection handling. The reported staging
match was stuck on turn one with Pass disabled despite available card actions.
This is not an exhaustive audit of individual card implementations.

## Findings repaired

- **Hosted controls depended on practice callbacks.** Pass had neither a local
  callback nor local legal commands. Hosted defense also lost the atomic legal
  defender sets, and the mobile End turn shortcut had no submission path.
  Adapter-owned control identities now preserve Pass, End turn, and defender
  selection. The board submits the exact typed server interaction. Labels
  and action list order no longer identify Pass versus End turn.
- **Defense declaration was incorrectly gated by rules priority.** The defender
  makes that declaration while priority is null. Hosted controls and decision
  ownership now recognize this state; declaring no defense retains the explicit
  confirmation when cards remain in hand. CR 7.3.2 and 7.3.3 distinguish
  declaration from the subsequent priority window.
- **Human defense was capped at three blockers by bot-style enumeration.** The
  adapter now exposes one bounded entity-selection input from eligible single
  defenders. Both practice and hosted controls submit the complete selection
  for authoritative engine validation. This supports four or more blockers
  without serializing exponentially many combinations. An illegal combination
  (tested with two hand cards against dominate) is rejected without consuming
  the declaration; a corrected legal selection can then succeed.
- **Trigger auto-order was omitted from decision projection.** The engine
  offers the preference during trigger-order decisions, but the adapter
  projected only optional-trigger preferences. All decision-compatible
  automation commands now remain available to the decision owner.
- **Live snapshots could regress the board or preserve stale actions.** Older
  versions are ignored. Interaction views must match the accepted state version
  and actor; missing/mismatched interactions clear available actions.
- **Move submission lacked a pending gate and explicit act permission check.**
  One submission is permitted until a newer authoritative snapshot arrives.
  Submission is revalidated against the current interaction view and viewer
  permissions. The in-flight guard updates synchronously, including between
  clicks before React rerenders.
- **Rejected moves silently resynchronized.** The server reason is now visible,
  stale actions are cleared, and a sync is requested. An unconfirmed submission
  also requests synchronization after ten seconds without replaying the move.

The server already validates actor-scoped interaction IDs, request IDs, state
versions, and submitted values before applying commands. That authority remains
in place; the browser does not update a hosted match optimistically.

## Evidence

- Live staging accessibility inspection: Pass reported “Pass is unavailable in
  this match” while card actions remained available.
- Engine-backed tabletop regression cases: hosted pass availability, multi-card
  defense committed atomically, confirmed no defense while priority is null,
  and mobile End turn resolving to the arsenal-choice command.
- Route regressions: duplicate submissions, act permission, older snapshot
  delivery, missing interactions, rejection feedback, and resync requests.
- Local browser fixture `/flesh-and-blood/simulator/tests/hosted-controls`
  instantiates the actual server adapter. Two cards can be staged independently
  and committed as one defense; the resulting board shows both blockers and
  disables the defender's Pass after priority transfers. `?phase=opening`
  starts before the first action for turn progression checks; `?defenders=4`
  exercises a declaration beyond the old cap.

## Remaining boundaries

- Preparation/bootstrap lifecycle and sidebar identity changes are owned by
  concurrent tasks; their combined behavior needs the consolidated gate after
  integration.
- The browser fixture uses a local server adapter. It proves interaction
  rendering and command acceptance, not deployed gateway/database delivery.
  Staging must be rechecked after normal PR/CI/CD deployment. No infrastructure
  was mutated during this audit.

## Validation checkpoint

- Adapter type check passed; complete adapter suite passed 125 tests before the
  selection extension, then 21 focused adapter tests passed including its new
  dominate rejection case.
- Complete board, priority, and live-route suites passed 170 tests before the
  selection extension. Its seven focused hosted/keyboard regressions passed,
  including zero, two, and four blockers.
- App-wide TypeScript validation was attempted. Unrelated existing errors in
  card-art/practice-deck/projection fixtures and other game workspaces remain;
  the complete diagnostics are in `/tmp/fab-hosted-audit-types-selection.log`.
  Consolidated publication gates are owned by the coordinating task.

## PR review follow-up (2026-09-04)

- Corrected singleton defense filtering: a card that cannot defend alone may
  still be selected alongside required equipment. The engine now exposes
  `listDefenderCandidates`, using per-card eligibility while deferring aggregate
  requirements to the complete declaration. The authoritative defense quote and
  command still enforce those requirements. This follows the simultaneous
  declaration in [CR 7.3.2](https://rules.fabtcg.com/en/cr/07-combat/#cr7.3.2).
- A valid synchronized interaction clears the previous synchronization alert.
- Three defense selection contract tests pass: required equipment co-defense,
  absence of equipment, and dominate rejection. The cases also exclude defense
  reactions and non-ambush arsenal cards from declaration candidates.
- The focused stale-snapshot/recovery UI test passes. Engine and adapter type
  checks pass. The complete adapter suite passed 126 tests before the two new
  equipment cases; subsequent focused run passes all three declaration cases.
- Browser proof at `localhost:5173/flesh-and-blood/simulator/tests/hosted-controls?attack=required-equipment`:
  selected Snatch and Mask of Momentum against Palantir Aeronought, submitted
  Declare defense, observed version 5 advance to 6 and 4 committed defense
  against 6 power (2 projected damage), with defender Pass disabled.
- At the observed 1280x720 viewport, the expanded combat panel covered part of
  the head equipment. Its existing Move combat chain to top control exposed the
  equipment and allowed selection. Record this as a separate layout follow-up;
  it is not a rules or submission failure.
- Full shared gates and final publication remain coordinated with the other
  active repairs. Earlier all-app validation encountered unrelated catalog
  readiness test failures being repaired by the card presentation task.
