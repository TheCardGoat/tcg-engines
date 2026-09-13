# FAB browser playbook

This is repository-local learning, not global assistant memory. Add only
evidence-backed lessons from an authorized run. Keep raw match history in that
run's records and link it here. Read entries relevant to the current matchup or
failure; verify older rule and implementation claims before relying on them.

## Entry format

Each entry needs a stable ID and:

- Scope: hero/card/interaction, conditions where it applies, and exceptions.
- State: `candidate`, `supported`, `rejected`, or `superseded`; confidence and
  last checked date/build/rules source.
- Observation and source evidence, including the game and decision/finding ID.
- Lesson: one actionable correction; keep a strategy hypothesis separate from
  a rules fact or observed interface behavior.
- Validation: ruling, regression and/or later game that challenged the lesson;
  counterexamples, next check, and a replacement ID when superseded.

One winning game does not validate a general strategy. Confirm with a later
relevant situation, examine alternatives, and retain contradictory evidence.
Prune duplication by superseding entries, without deleting their audit trail.

## Seed lessons from the source session

These process lessons are grounded in
[the source-session record](source-session.md). They are not claims that the
current code remains broken or that the prior session's card rulings are final.

### P001 — Verify card selection before declaration

- Scope: staged defenders, equipment and duplicate cards; not instant actions.
- State: supported process lesson; last checked 2026-09-13 against source-session
  observations and the current POM's staged-defense methods.
- Evidence: equipment appeared clickable while selected count stayed unchanged;
  source session later reported successful direct-card regression playback.
- Lesson: verify selected entity/count and the dedicated confirmation outcome
  before advancing; record any action-panel fallback as a finding.
- Next check: exercise direct hand plus equipment staging on the current build.

### P002 — Separate turn ownership from interaction ownership

- Scope: defense, effect decisions, and manual seat takeover.
- State: supported process lesson; source-session evidence inspected 2026-09-13.
- Evidence: ally-target combat appeared deadlocked while the missing signal was
  the current interaction actor; POM currently exposes `interactionActor()`.
- Lesson: inspect the actor/control/step combination before clicking or reporting
  a deadlock. Do not assume ordinary defense is legal against every target.
- Next check: verify actor handoff and available choices under current FAB rules.

### P003 — Surprising results need a ruling before a repair

- Scope: triggered effects, transformations, counters and card-text disputes.
- State: supported process lesson; source-session evidence inspected 2026-09-13.
- Evidence: multiple suspected extra triggers/counters were later retracted;
  an ally-hit claim remained under investigation.
- Lesson: retain a suspected finding, check current errata/exact text/timing,
  then confirm or dismiss with citations. UI reminder text is not authority.
- Next check: review every new disputed interaction this way. No specific card
  ruling is promoted by this process entry.

### P004 — A stable deal requires a stable serving build

- Scope: repeated browser games in a shared checkout.
- State: supported process lesson; source-session evidence inspected 2026-09-13.
- Evidence: an HMR reset erased in-progress history; a fixed local preview was
  used for subsequent games.
- Lesson: identify the serving build, invalidate resets, and use a stable local
  snapshot if shared edits prevent uninterrupted games. Reload repaired code
  deliberately between games and verify the served version.
- Next check: record both build and deal identity before the next counted game.

No hero strategy bonuses or alleged win-rate improvements are seeded here.
Build those lessons from deliberate legal play and later validation.
