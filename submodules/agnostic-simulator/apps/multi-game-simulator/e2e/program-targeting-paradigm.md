# Program Targeting Paradigm

QA handoff for expanding the current Gear-style targeting UI to Programs.

This document describes the intended interaction cases before implementation.
It should be converted into e2e coverage once Program targeting lands.

## Scope

Programs are one-shot cards: pay their cost, resolve their effect, then move
them to Trash.

The spatial targeting UI should apply only to Programs whose effect target is a
card on the board:

- Units in the Field.
- Legends in a Legend area, when the Program explicitly allows Legend targets.

Programs that target Gigs, cards in hand, cards in deck/trash, modal choices, or
numeric adjustments should keep their dedicated prompt surfaces. They should not
be made draggable onto field cards unless their effect target is a Unit or
Legend card.

## Shared Rules

- Only the current human-controlled side shows the target-selection UI.
- `p-*` means the side rendered at the bottom of the board, not necessarily P1.
- `opp-*` means the rival side rendered at the top of the board.
- Eligibility comes from the engine prompt/effect target data, not from static
  card type guesses in the UI.
- A highlighted target must represent the actual clickable/drop target. The
  highlight may glow or label the card, but it must not move or scale the card
  root away from its measured drop rectangle.
- Program spatial target copy should say `TARGET` or the specific effect action,
  not `ATTACH` or `FIGHT`.

## Primary Flows

### Direct Drag Onto A Valid Card Target

Example: drag `Floor It` from hand onto a spent Unit with cost 4 or less.

Expected behavior:

- Drag starts from a face-up Program in `p-hand`.
- Valid Unit/Legend targets show a Program-target affordance.
- Dropping on a valid target plays the Program and resolves the selected target.
- The Program leaves hand and ends in Trash.
- Eddies are spent according to the Program cost.
- The target effect resolves.
- No extra target modal remains open after resolution.

Expected dispatch shape may be one UI gesture with two engine steps:

- `playCard` for the Program.
- `resolveEffectTarget` for the dropped target, if the engine creates a pending
  `chooseTarget/effectTarget` choice after `playCard`.

QA should assert the user gesture, the dispatch log, engine state, and rendered
state all agree.

### Drag Onto The Field Zone To Enter Target Mode

Example: drag `Floor It` from hand onto `p-field`, not onto a specific card.

Expected behavior:

- The Program is not immediately committed to a random target.
- The UI enters target-selection mode with that Program as the selected source.
- Valid Unit/Legend targets are highlighted according to the Program effect.
- Clicking a valid target then plays the Program and resolves that target.
- Clicking an invalid card or empty area does not resolve the Program.

This mirrors the Gear flow where dropping Gear on the field asks for an attach
target.

### Play Verb Then Program Then Target

Example: click `Play`, click `Floor It`, click a valid spent Unit.

Expected behavior:

- Clicking `Play` arms playable hand cards.
- Clicking a Program that has spatial Unit/Legend targets enters target mode.
- Prompt copy should indicate that the selected Program needs a target.
- Valid targets are highlighted on the board.
- Clicking a valid target plays the Program and resolves the target.
- The selection clears after resolution.

### Direct Drag Onto An Invalid Card Target

Examples:

- Drag a friendly-only Program onto a rival Unit.
- Drag a Unit-only Program onto a Legend.
- Drag `Floor It` onto a ready Unit, a Unit with cost above 4, or a non-Unit.

Expected behavior:

- Invalid cards do not show the Program-target affordance.
- Dropping on an invalid card does not dispatch a resolving action.
- The Program remains in hand.
- No Eddies are spent.
- No pending target mode remains unless the drag was intentionally dropped on a
  valid target-mode surface such as the field zone.

### No Valid Spatial Targets

Some Programs can legally be played even when their effect has no valid target,
depending on the engine/card definition.

Expected behavior:

- If the engine says the Program is playable, clicking/dragging to the field
  zone may still play it normally.
- It should not enter an impossible target-selection mode.
- No card targets should be highlighted.
- The Program should resolve according to engine rules, usually no effect, then
  move to Trash.

QA should use the engine prompt as the source of truth for whether the card is
playable in this state.

## Spatial Target Categories

### Friendly Unit Target

Examples in the current corpus:

- `Reboot Optics`: friendly Unit in field.
- `Cyberpsychosis`: equipped friendly Unit in field for its power effect.

Expected target UI:

- Highlight eligible friendly Units in `p-field`.
- Do not highlight rival Units.
- Do not highlight Legends unless the Program effect or cost explicitly allows
  that target for the same selection being made.

### Rival Unit Target

Example in the current corpus:

- `Corporate Surveillance`: rival Unit with cost 3 or less.

Expected target UI:

- Highlight eligible rival Units in `opp-field`.
- Do not highlight friendly Units.
- Do not highlight rival Units outside the cost or state constraints.

### Any Unit Target

Example in the current corpus:

- `Floor It`: spent Unit with cost 4 or less.

Expected target UI:

- Highlight every eligible Unit on both `p-field` and `opp-field`.
- Respect state and cost restrictions.
- Do not highlight Legends.

### Unit Or Legend Target

Example in the current corpus:

- `Cyberpsychosis` cost can spend a friendly Unit or face-up Legend during its
  event-triggered play window.

Expected target UI:

- Only use the spatial Program paradigm when the pending choice is a Program
  card target choice.
- If the Program prompt is asking for a cost target, the UI must make that clear
  and should not use generic play-target copy.
- Highlight eligible Units and face-up Legends according to the engine choice.
- Do not highlight face-down Legends unless the engine marks them eligible.

## Non-Spatial Program Targets

These Programs should not use field-card drag/drop targeting unless they also
contain a separate Unit/Legend card target step.

### Gig Targets

Examples:

- `Industrial Assembly`: friendly Gig.
- `Afterparty at Lizzie's`: rival Gig and value adjustment.

Expected UI:

- Use Gig/Fixer/center-row prompt controls.
- Do not highlight Units or Legends.
- Dragging the Program onto a Unit or Legend should be ignored.

### Hand, Deck, Trash, Or Search Targets

Expected UI:

- Use the existing choice modal, search picker, or card list prompt.
- Do not create board-spatial drop targets unless the engine target is a visible
  Unit or Legend on the board.

### Multi-Target Or Variable-Count Choices

Expected UI:

- Use a modal or multi-select flow unless the implementation explicitly supports
  multi-card board selection.
- Do not make a single drag/drop gesture imply multiple targets.

## Mobile Expectations

Mobile should expose the same target semantics as desktop.

Additional mobile checks:

- Field card gaps are large enough that adjacent card targets can be dragged to
  reliably.
- The highlighted card root stays aligned with the visible card image.
- Player field and rival field are both reachable as targets when the Program
  permits both.
- Helper chips such as Deck, Trash, Fixer, and Eddies do not accidentally become
  Program target surfaces.

## Desktop Expectations

Desktop should use the same engine adapter and target eligibility.

Additional desktop checks:

- Dense field layouts still leave enough visual gap between adjacent targets.
- Dragging onto the visible card image resolves the same target as clicking it
  in target-selection mode.
- The prompt banner changes from `Your move` to a clear Program target prompt
  when a Program source has been selected.

## Suggested QA Test Matrix

| Case                       | Source                    | Target                                    | Expected                                                                        |
| -------------------------- | ------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------- |
| Direct valid Unit target   | Program in `p-hand`       | Eligible Unit in `p-field` or `opp-field` | Program plays, target resolves, Program goes to Trash.                          |
| Direct valid Legend target | Program in `p-hand`       | Eligible face-up Legend                   | Program plays, target resolves, Program goes to Trash.                          |
| Field-zone staging         | Program in `p-hand`       | `p-field` zone                            | Enters target-selection mode; no Program resolution yet.                        |
| Play-click staging         | `Play` verb, then Program | none yet                                  | Enters target-selection mode with valid board targets highlighted.              |
| Invalid Unit target        | Program in `p-hand`       | Ineligible Unit                           | No dispatch, no cost spent, Program stays in hand.                              |
| Invalid Legend target      | Program in `p-hand`       | Ineligible or face-down Legend            | No dispatch, no cost spent, Program stays in hand.                              |
| Non-spatial Gig Program    | Program in `p-hand`       | Unit or Legend                            | No spatial target dispatch; use Gig prompt flow instead.                        |
| No eligible spatial target | Program in `p-hand`       | field zone                                | Either normal no-effect play or inert, exactly matching engine prompt legality. |
| Mobile dense field         | Program in `p-hand`       | Adjacent eligible field cards             | Correct card target resolves; no neighbor mis-target.                           |
| Desktop dense field        | Program in `p-hand`       | Adjacent eligible field cards             | Correct card target resolves; no neighbor mis-target.                           |

## Useful Selectors

- Hand Program source: `[data-zone="p-hand"][data-card-type="program"]`
- Friendly field card: `[data-zone="p-field"][data-card-id="<target id>"]`
- Rival field card: `[data-zone="opp-field"][data-card-id="<target id>"]`
- Legend card: `[data-testid="legend-slot"][data-card-id="<target id>"]`
- Prompt Play verb: `[data-testid="prompt-verb-playCard"]`
- Effect target cards should expose `data-choice-eligible="true"` while an
  engine `chooseTarget/effectTarget` choice is active.

## Open Implementation Notes

- The UI likely needs a source-selection state that can remember a Program card
  before the Program has been moved to Trash.
- Direct Program drag/drop may need to dispatch `playCard` and then immediately
  dispatch `resolveEffectTarget` if the selected target is still eligible after
  `playCard`.
- QA should verify the dispatch log records both actions when two engine moves
  are required.
- If the engine later exposes Program target candidates directly in the
  `playCard` prompt, QA should prefer that candidate list over card-definition
  inference.
