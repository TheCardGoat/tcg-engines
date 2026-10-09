# Pending fight effects: required queue correction

Status: approved by the user on 2026-09-24; implementation in progress.
Validation must assert player-visible behavior, not queue or effect layout.

## Confirmed root cause

The fightResult stage orders authored card triggers before result defeats.
However, next-fight effects use separate execution paths:

- Safety Override executes directly after the authored trigger queue drains.
- Appetite for Destruction executes through afterTriggerResolution bag entries.
- The authored trigger queue can resolve only a card's stored ability index.

Thus effects for one fight event cannot all enter the same pending set or be
ordered by their controller. CR 10.12 and 10.16.2 require that ordering. Fixing
only the first matching active effect would leave this root cause intact.

Additional confirmed assumptions in these paths: only one Safety Override
copy is consumed; Reboot Optics selects a single effect before checking its
controller and assumes the rival is attacking; Appetite assumes the friendly
winner is attacking. Printed text refers to the fight's participants, not
only the attacker.

## Proposed owning design

1. Give pending trigger entries a discriminated executable origin: an authored
   ability reference, or captured delayed effects with their source/controller,
   event, bound targets, and resolution context. Do not use fake ability indexes.
2. Admit all matching next-fight effects when the event occurs. Capture all
   matches before mutating active effects, consume each once, and enqueue them
   with the authored triggers for that same event.
3. Use the existing controller order, choice, suspension, and resume pipeline
   for both entry kinds. Preserve source-card display without re-running its
   original Play ability. Later changes must not erase a pending effect.
4. Derive winner, loser, and opposing Unit from the recorded fight result.
   Reboot prevention may protect either or both participants; store a set of
   protected card IDs. Do not require a defending winner to be an attacker.
5. Remove the special direct Safety executor and Appetite's after-trigger bag
   path. Keep other delayed timings only where their rules require them.

## Owners and contracts

Cyberpunk owns pending queue types, event admission, active effects, executor,
choice projection, replay, and tests. The Cyberpunk server adapter and simulator
consume the updated native projection. Shared platform contracts stay game
agnostic. Version 3 is the strict snapshot boundary for this queue shape.

### Snapshot compatibility

Version 1 and 2 snapshots are rejected; no migration is supplied. An in-flight
match saved by an older runtime cannot resume under version 3. Older native
replays and forks also need the engine version that wrote them. Public replays
that already contain viewer projections do not require native-state restore.

A rollout across this boundary must account for those in-flight matches and
retained native archives. Do not bypass the version check or discard pending
effects to make an old snapshot load. Supporting old snapshots requires a
separately reviewed migration that preserves pending choices, bound targets,
and effect attribution.

## Risks and validation

Risks: re-executing a source Play ability; consuming an effect twice after a
choice; losing bound targets or attribution on restore; forcing an incorrect
order between players; changing unrelated end-of-turn delayed effects.

Use real card regressions for two Safety Overrides on one loss, a later loss
with no remaining copy, stacked Reboots, Reboots from both players, friendly
attacker protection, and a defending Appetite winner. Add a same-controller
ordering choice involving authored and delayed fight effects, plus restore
while such a choice is pending. Verify snapshot privacy, source attribution,
full engine/card/parser tests, adapter mapping, and a browser choice/resume.

Do not describe the three next-fight families as complete until this shared
pending model is implemented and verified.
