# OP15+ card test authoring notes

Practical harness semantics learned while verifying the OP15 leaders. Consult
before writing a new card test; extend whenever a new repair cycle reveals a
reusable fact. Canonical patterns live in `001-krieg.test.ts` … `098-*.test.ts`
in this directory.

## Fixture semantics (`OnePieceTestEngine.create`)

- Default state is **turn 3** (south active, `turnsStarted: 2` for both seats,
  6-5-6-1 battle ban satisfied). Pass `{ turnNumber: 1 }` to exercise
  first-turn restrictions. `turnsStarted` is **seeded, not simulated**: the
  DON phase has not run, so `activeDon`/`restedDon` come only from fixtures.
- `attachDon` is a public command and defaults to the active seat.
- View `characters` arrays are sparse (fixed slots); use
  `flatMap((c) => (c ? [c.power] : []))` for board-wide assertions.
- Character view fields: `rested: boolean`, `attachedDon`, `power`, `cost`.
  There is no `state` field.
- `trashFromDeck` with a **non-upTo amount silently no-ops** when the deck has
  fewer cards than requested (see `actions.ts` `case "trashFromDeck"`).
- Optional blocks surface as `effectOptional` (`{ optionId: "yes" | "no" }`).
  Costs that are "You may …" payments surface a _leading optional_ first:
  `engine.acceptLeadingOptional(seat)` then resolve the cost prompt.

## Prompt intents (projection layer)

| Printed element                    | Intent                         | Submission                                   |
| ---------------------------------- | ------------------------------ | -------------------------------------------- |
| Optional effect                    | `effectOptional`               | `{ optionId: "yes" \| "no" }`                |
| up-to DON add (active or rested)   | `effectAddDon`                 | chooseOption, options are printed cap `0..n` |
| give DON to a target (count)       | `effectGiveDonCount`           | chooseOption, printed cap                    |
| give DON recipient (1 candidate)   | auto-resolves                  | —                                            |
| effect K.O. replacement confirm    | `effectKoReplacement`          | `{ optionId: "yes" \| "no" }`                |
| effect removal replacement confirm | `effectRemovalReplacement`     | `{ optionId }`                               |
| DON!! -1 cost                      | `effectCostReturnDon`          | `{ selectedIds: ["active-don:0"] }`          |
| trash from hand                    | `effectTrashFromHandSelection` | selectEntity                                 |
| play from hand                     | `effectPlaySelection`          | selectEntity                                 |

| up-to count prompts show the **printed cap**, the engine applies
`min(chosen, live)` at resolution | | |

- Effects with exactly one legal target may resolve that prompt automatically;
  assert the board result instead of demanding a prompt.
- `thisBattle` power modifiers expire when the battle resolves; hold the
  battle with a legal Counter in the defender's hand (e.g.
  `op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037`) and assert while
  `battleCounter` is pending. A counter whose cost cannot be paid
  auto-declines without a prompt.

## Engine facts

- Removal replacements: effect-K.O. consults `ko` + `removeFromField` +
  `leaveField` families; battle K.O. consults `ko` + `leaveField` only;
  `promptForEffectRemovalReplacement` covers non-K.O. effect removal.
- `candidatePoolForTarget` excludes cards protected by `cannotBeRemoved`
  modifiers — a "protected" fixture card silently empties K.O. prompt
  candidates.
- `activateEffect` legality evaluates block conditions (fail-open on
  _unsupported_ conditions) plus costs and once-per-turn keys.
- Events played from hand dispatch `whenYouActivateEvent`; the engine records
  the activation per turn (`activatedEvent` condition reads it).
- Empty-deck defeat runs immediately on deck movement and at turn end;
  `deferEmptyDeckLoss` replacement (Brook) defers the immediate defeat to the
  end-of-turn check in `endTurnFinalize`.

## More harness facts

- `orderCards` prompts project as step kind `orderItems` (intent
  `effectSearchRemainderOrder`); submit ordered `selectedIds`.
- `giveDon` count options cap at the **live donor pool**; `addDon` options
  show the **printed cap** and apply `min(chosen, live)` at resolution.
- `donState: "any"` (cost-area give) deducts rested DON first, then active.
- Scheduled end-of-turn prompts pause the resolution queue _before_
  `endTurnFinalize`; resolve them before asserting next-turn state.
- Search reveal prompts list the looked cards; submission is validated
  against the filtered eligible ids.
- A lone legal recipient auto-resolves giveDon/target prompts.

- Mixed rest prompts ("Rest up to 1 of your opponent's cards") project as
  kind `payCost` under intent `effectMixedRestSelection`; the selection
  resolves the rest directly (no follow-up target prompt).
- `resolveDecision` applies synchronously; assertions immediately after a
  resolve see the resulting state.
- Capture instance ids BEFORE a self-trash cost (the card leaves the field).
- Turn handoff draws a card for the active player; expected hand sizes after
  `endTurn` cycles include that draw.

- `engine.playCard(card)` looks the card up in the HAND; capture field ids
  after the play, not before.
- Opaque hand picks (e.g. "your opponent places 1 card from their hand at the
  bottom of their deck") create a SECOND `effectTargetSelection` prompt owned
  by the card owner; it is invisible in the other seat's projection. Resolve
  it explicitly by reading the hand from the owner's view.
- Search reveal prompts list ALL looked cards; submission is validated against
  the filtered eligible set.
- Effect costs named `returnCharacterToDeck` project as
  `effectCostReturnCharacterToDeck`.

- Paying a play cost RESTS the active DON (activeDon -> restedDon); account
  for it when asserting DON-area totals after a play.
- `revealFromDeck`'s schema field is `conditional` (the processor previously
  mis-read `ifRevealedCardMatches`, silently dropping follow-ups).
- Unsigned numeric modifiers on opponent-targeted "give ... N power" text are
  sign-suspicious; verify against the official card and align base text,
  i18n, and structured value (done for OP15-061 Ohm: -1000).

- `rearrangeDeck` (topOrBottom) resolves as orderItems FIRST
  (`effectRearrangeDeckOrder`), then a position chooseOption
  (`effectRearrangeDeckPosition`).
- The returnDon ACTION (a replacement/Effect, not a cost) uses intent
  `effectReturnDon`; the COST variant is `effectCostReturnDon`.
- Blockerless battles auto-complete: a negative "no Blocker" boundary is
  proven by life damage + zero prompts, not by a missing prompt.

## Fifty-card checkpoint (leaders 7 + characters 043, commits ccd20264, 8555b0a2, d0786914)

Batch: 50 canonical cards. First-run pass ~60%; all green after repair.
Signal: prompt intent/kind guessing and fixture DON-phase assumptions caused
most repair cycles; probe-then-write beats guess-and-run.
Change: keep AUTHORING-NOTES as the single cheat-sheet; reuse the established
prompt-flow templates (replacement confirm, search reveal+order, DON give,
rearrange order→position) instead of inventing per card.
Proof: all focused suites green; full engine suite run at shared-engine
changes; 3 scoped commits.
Next-two result: kept — later batches (050-065, 066-069) converged faster.

- Self-referencing cost modifiers while the card is IN HAND must target
  `zones: ["hand", "character"]` (a "character"-only pool excludes hand).
- The leader is exposed as `south.leader`, not in `south.characters`.
- Draw effects shrink the deck: assert `deckCount` accordingly.

- Life Trigger tests: place the card in the `life:` fixture (not the field),
  attack the LEADER so Life damage occurs, resolve `lifeTrigger` with
  `{ optionId: "activate" | "skip" }`. A held Counter pauses the battle first —
  decline via `battleCounter` empty selection.
- Attacking a rested CHARACTER K.O.s it without Life damage (no Trigger).
- Effect plays from trash use `effectPlaySelection`; an empty candidate pool
  auto-declines silently.
- Color filters need exact card colors; verify the fixture's color field.
