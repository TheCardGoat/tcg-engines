# Command Activation Origin And Trash Follow-Ups

**Status**: completed
**Owner**: Gundam engine/cards

## Goal

Make Command activation preserve how the effect was activated and make
location-qualified follow-ups executable only from their printed location.
This fixes the four GD05 Special Moves without special-casing their card
numbers and provides a reusable legality boundary for future effects that
permit or prevent activation from trash.

## Rules And Card Constraints

- A played Command activates its Command effect and goes to trash after that
  effect ends (rules 3-4-1, 3-4-3, and 3-4-4).
- A Command card with a Pilot effect is a Pilot while paired, and Pilot rules
  apply to it (rules 3-4-6-3 and 3-4-6-4).
- Dragon Gundam, Gundam Rose, Gundam Maxter, and Bolt Gundam activate the Main
  effect of their paired card. They do not play that card from hand.
- GD05-112, GD05-113, GD05-121, and GD05-122 may Pair only from trash after
  their Main effect has been activated.
- Domon Kasshu is the positive trash-origin case: his effect discards the
  Special Move first, then may activate its Main.
- Card text overrides the base rules (rule 1-3-1), and an effect with a
  location condition cannot activate unless that condition is fulfilled
  (rules 3-3-9-2-1, 10-1-6-2, 10-2-1, and 10-3-1-1).

## Implemented Model

1. Add a discriminated `CommandActivationOrigin` to queued Command effects:
   `playedFromHand`, `activatedWhilePaired`, `activatedFromTrash`, or
   `activatedFromShield`.
2. Preserve the source card's real location while resolving an activation that
   does not play the card. In particular, `activatedWhilePaired` keeps its
   Pilot assignment and battle-area location.
3. Keep the existing transient no-location/removal representation only for a
   Command that was actually played, not for every indirect activation.
4. Represent the Special Moves' second clause as an after-resolution,
   trash-qualified continuation rather than an ordinary `pairPilot` directive
   inside the Main body. The continuation must re-check the source's current
   zone immediately before it is enqueued and again before it resolves.
5. Carry the activation origin on the pending effect and execution context.
   A future restriction such as “effects can't activate from trash” can use
   that provenance at the common command-enqueue boundary without inferring
   origin from the card's later location.
6. Continue emitting `commandEffectActivated` and recording
   `activatedCommandThisTurn` whenever the Main/Action body legally activates,
   independent of origin. Observers such as Master Asia, Shining Gundam Super
   Mode, and Unicorn Gundam (Awakened) must keep working.

Implemented type boundary:

```ts
type CommandActivationOrigin =
  | { kind: "playedFromHand"; paidResources: number; paidExResources: number }
  | { kind: "activatedWhilePaired"; hostUnitId: CardInstanceId }
  | { kind: "activatedFromTrash" }
  | { kind: "activatedFromShield" };
```

Location-qualified continuations use the narrow `pairSourceFromZone` action
with `requiredZone: "trash"`, rather than a boolean on generic `pairPilot`.
The target legality layer and executor both re-check the source zone, which
suppresses invalid prompts and protects against state changes between prompt
publication and resolution.

## Regression Matrix

| Activation path            | Command                 | Expected Main result     | Expected source result                                        |
| -------------------------- | ----------------------- | ------------------------ | ------------------------------------------------------------- |
| Dragon Gundam attack       | GD05-112                | Grant Breach 3           | Remains paired; no trash Pair prompt                          |
| Gundam Rose attack         | GD05-113                | AP +2                    | Remains paired; no trash Pair prompt                          |
| Gundam Maxter attack       | GD05-121                | Enemy AP -2              | Remains paired; no trash Pair prompt                          |
| Bolt Gundam attack         | GD05-122                | Rest Lv.4-or-lower enemy | Remains paired; no trash Pair prompt                          |
| Normal play from hand      | all four                | Resolve printed Main     | Move to trash, then optionally Pair                           |
| Domon discard activation   | representative GD05-121 | Resolve printed Main     | Already trash-qualified, then optionally Pair                 |
| Burst self-Main activation | existing Burst Commands | Resolve printed Main     | Follow Burst destination rules; no false hand-play provenance |
| EX-paid Dawn of Fold play  | GD04-021 observer       | Resolve played Command   | Pair event card only after trash qualification                |

## Acceptance Gates

- The nine focused suites changed by this investigation pass.
- Paired activation never publishes a `pairPilot` prompt for a trash-only
  continuation and preserves the original Pilot assignment.
- Normal play exposes the optional Pair only after the source is observable in
  trash.
- Domon's discarded-command activation remains legal and can complete the
  trash Pair.
- Existing indirect activation observers and Master Asia's
  `activatedCommandThisTurn` condition still pass.
- Gundam Lfrith Thorn's GD04 trash-pair behavior remains green.
- Add a focused engine test for a synthetic “can't activate effects from
  trash” restriction once the generic restriction type exists.

## Validation Evidence

- The focused GD05 matrix passes: 9 files, 47 tests.
- The expanded regression set passes: 11 files, 53 tests, including Burst
  replay eligibility and Unicorn Gundam (Awakened)'s indirect activation
  observer.
- GD04 Gundam Lfrith Thorn, Master Asia, Darkness Finger, and the core
  play-command suite pass in a separate 6-file, 39-test run.
- The broad workspace check reached 4,253 passing card tests and found one
  stale Unicorn expectation; that test was corrected and passes in the
  expanded regression set.
