# Comprehensive Rules Test Evaluation Summary

This document summarizes how each **executable** Comprehensive Rules (CR 1.2.0)
clause is proven in `packages/engine/tests/rules/`, and how those proofs show the
engine implements the rules correctly—including **negative** and **edge** cases.

Source of truth for mapping and non-executable classifications:
[`rules-test-coverage.md`](./rules-test-coverage.md).

Run the suite:

```sh
cd packages/engine && vp test run tests/rules
```

## How evaluation works

Every executable rule test follows the same contract:

1. **Arrange** with real `@tcg/op-cards` catalog definitions (or the public
   deck-validation API for construction rules).
2. **Act** through public player-facing commands on `OnePieceTestEngine`
   (`playCard`, `declareAttack`, `attachDon`, `activateEffect`, `endTurn`,
   `concede`, `resolveDecision`, setup/start-game, etc.)—not private
   `MatchState` surgery for the happy path.
3. **Assert** player-visible outcomes:
   - `getView` (Life, deck count, power, zones, rested, attached DON!!, hand)
   - pending decisions / prompts
   - match finish (`status`, `winner`, `finishReason`)
   - or `expectFailure` when a move must be **rejected** as illegal

That is the definition of “engine properly implemented” for this suite: if the
rule says an action is legal/observable, a real command produces it; if the rule
forbids it, the command fails with a reason and state is unchanged in the way
the player would see.

## Positive vs negative / edge cases

| Kind | What it means | Typical signals |
| ---- | ------------- | --------------- |
| **Positive** | Legal path produces the CR outcome | `play` / `attack` / `give DON!!` then `getView` |
| **Negative** | Illegal path is rejected, or optional path declined | `expectFailure`, “cannot”, “does not activate” |
| **Edge** | Boundary of the rule (0, once, first turn, equal power, mid-prompt, extra turn) | “boundary”, “control”, “0”, “only”, first-turn, mid-battle |

Rough suite mix (285 tests): about **45%** are negative/edge-named or use
`expectFailure`; about **24%** explicitly call `expectFailure`; almost all
command-driven tests assert `getView` or finish/prompts.

### Control pairs (positive + negative)

Where the suite is strongest, a rule has both halves:

| Rule family | Positive proof | Negative / control proof |
| ----------- | -------------- | ------------------------ |
| 6-5-6-1 first-turn battle | Second turn attacks succeed | First turn of each seat fails; Rush does not override |
| 10-1-1 [Rush] | Rush Character attacks on play turn | Non-Rush cannot; Rush still blocked on seat first turn |
| 10-1-3 [Banish] | Life trashed, no Trigger | Same Life with non-Banish offers Trigger |
| 10-1-7 [Unblockable] | Blocker not offered | Same attack without Unblockable offers Blocker |
| 10-2-2 / 10-2-3 timing | Main / Activate: Main legal in Main | Illegal on opponent turn and mid-battle |
| 10-2-9 [DON!! xX] | Exact and greater counts work | Fewer than X does not |
| 10-2-15 [On Block] | Activates when Blocker used | Does not activate when Blocker declined |
| 10-2-1 K.O. vs trash | Effect “K.O.” fires On K.O. | Trash without “K.O.” / 3-7-6-1 does not |
| 5-1-2 deck construction | Valid 50+Leader+colors | Rejects size, color, category, copy limit |
| 7-1-1-2 attack targets | Leader / rested Character legal | Active Character illegal |
| Counter / Trigger | Activate or resolve | Decline path restores hand / skips effect |

### Edge cases already covered (high signal)

- Concession mid-battle and during setup; finished match rejects further commands
- First player: no draw, 1 DON!!, no battle; second player first-turn battle ban; extra-turn handoff still bans P2 first active turn
- Character area full (5) → replacement trash before play; Stage replacement
- Equal power wins for attacker; lower power does nothing; 0 Life Leader damage wins
- Attacker/target leaves mid-battle → no damage
- Cost cannot be paid; activation cost cannot be paid; optional cost declined
- Once Per Turn second activation rejected; bounce resets OPT usage
- Power can go negative without trashing; cost floor at 0
- Draw X=0; draw up to may choose 0; “up to” may choose 0
- Trigger activate vs decline; Banish skips Trigger; mid-damage Trigger suspend

## Residual negative/edge gaps (honest)

These are **not** missing defining mechanics, but would strengthen the map:

| Gap | Notes |
| --- | ----- |
| 10-2-8 [End of Your Opponent's Turn] | Non-executable today (no catalog card in suite) |
| 10-2-4-1-2 negative half | “Cannot activate Counter unless text says so” only partly covered |
| 10-2-13-5 mid-payment OPT | Unreachable (atomic cost validation) — classified |
| Simultaneous both-players lose (9-2-1 both) | Not separately proven as double empty-deck |
| Effect “you lose” (1-2-5 lose half) | Suite has effect **win**; lose-by-effect needs a catalog card |
| Grouped play into full Character area | Known limitation: `playGrouped` still caps open slots |

---

## Per-chapter rule evaluation tables

### 1. Game Overview (`01-game-overview.test.ts`)

_20 tests; 13 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `1-1-1` | a match is played head-to-head by exactly two players | commands: attack, end turn, concede, resolve prompt; assert: win/loss, getView, reject illegal move, zone/power state | negative/edge |
| `1-2-1-1-1, 1-2-2-1, 1-2-1` | a player whose Leader takes damage at 0 Life loses, and their opponent wins (1-2-1) | commands: attack, end turn, concede, resolve prompt; assert: win/loss, getView, reject illegal move, zone/power state | negative/edge |
| `1-2-1-1-2, 1-2-2-2, 1-2-2` | a player whose deck reaches 0 cards loses when rule processing runs (1-2-2) | commands: attack, end turn, concede, resolve prompt; assert: win/loss, prompts, getView, reject illegal move, zone/power state | negative/edge |
| `1-2-5` | a card effect that says a player wins ends the game during that effect's processing | commands: attack, concede, resolve prompt; assert: win/loss, prompts, getView, reject illegal move | negative/edge |
| `1-2-3` | a player may concede at any point and loses immediately, ending the game | commands: attack, concede; assert: win/loss, prompts, getView, reject illegal move | negative/edge |
| `1-2-3` | concession is legal mid-battle while a prompt is pending | commands: attack, concede; assert: win/loss, prompts, getView | positive |
| `1-2-3` | concession is legal during setup, before the game starts | commands: play, attack, concede; assert: win/loss, getView, reject illegal move, zone/power state | negative/edge |
| `1-2-4` | concession is not affected by cards and cannot be replaced by replacement effects | commands: play, attack, concede, resolve prompt; assert: win/loss, getView, reject illegal move, zone/power state | negative/edge |
| `1-3-1` | card text takes precedence over the rules — [Rush] attacks on the turn it is played | commands: play, attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `1-3-2` | an impossible action is skipped while the rest of the effect is performed | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `1-3-2-1` | changing an object to a state it is already in is not performed | commands: play, activate, end turn, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `1-3-2-2` | an action required 0 times is not carried out | commands: play, activate, end turn, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `1-3-3` | a prohibiting effect takes precedence over an action an effect requires | commands: play, activate, end turn, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `1-3-4, 1-3-10` | when both players must act at the same time, the turn player acts first | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `1-3-5-1` | an 'up to' choice without a minimum may choose 0 | commands: play, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `1-3-6-1, 1-3-6-1-1, 1-3-6` | power may become negative, and the card is not trashed for it (1-3-6) | commands: play, resolve prompt; assert: getView, zone/power state | negative/edge |
| `1-3-6-2` | a cost that becomes negative is treated as 0 outside calculations | commands: play, activate, resolve prompt; assert: getView, zone/power state | positive |
| `1-3-7` | effect actions are carried out in the order described on the card | commands: play, activate, resolve prompt; assert: getView, zone/power state | positive |
| `1-3-9-1` | playing a card requires paying the cost written in its upper left corner | commands: play, activate, resolve prompt; assert: getView, zone/power state | positive |
| `1-3-9-2` | activating a card's effect requires paying its activation cost | commands: activate, resolve prompt; assert: getView, zone/power state | positive |

### 2. Card Information (`02-card-information.test.ts`)

_45 tests; 13 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `2-1-1` | every card has a fixed, non-empty card name | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-1-2` | a [Name] reference matches cards with exactly that card name | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-1-3` | a card that gets a card name from its text is treated as having that name | commands: play, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-2-1, 2-2-2` | every card has a category, and the catalog uses exactly the five card categories | commands: play, activate, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-2-3` | a Leader card is placed in the Leader area | commands: play, activate, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-2-3-1, 2-6-3` | a 'Leader' reference affects the Leader card in the Leader area | commands: play, activate, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-2-4, 2-7-1, 2-7-2` | playing a Character rests DON!! equal to its printed cost and places it in the Character area | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-2-4-1` | a 'Character' reference only matches Character cards in the Character area | commands: activate, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `2-2-4-2` | a 'Character card' reference matches the category outside the Character area | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-2-5, 2-7-3` | activating an Event card rests DON!! equal to its cost and trashes the card to resolve its effect | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-2-5-1` | an 'Event' reference matches Event-category cards | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-2-6, 2-7-4` | playing a Stage card rests DON!! equal to its cost and places it in the Stage area | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-2-6-1` | a 'Stage' reference matches the Stage card in the Stage area | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-2-6-2` | a 'Stage card' reference matches Stage-category cards outside the Stage area | commands: play, resolve prompt; assert: prompts, getView | positive |
| `2-3-1, 2-3-2, 2-3-3` | every card has colors, drawn from the six printed colors | commands: play, resolve prompt; assert: getView, zone/power state | positive |
| `2-3-4` | some cards have multiple colors | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `2-3-5` | a multicolor card is treated as a card of every color it possesses | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `2-3-5` | a multicolor card is not treated as a color it does not possess | commands: play, attack, resolve prompt; assert: getView, zone/power state | negative/edge |
| `2-3-6` | 'multicolored' is referenceable in card text (positive) | commands: attack; assert: getView, zone/power state | positive |
| `2-3-6` | 'multicolored' is referenceable in card text (negative) | commands: play, attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-4-1, 2-4-2` | cards have types, and some cards have multiple types | commands: play, resolve prompt; assert: prompts, getView | positive |
| `2-4-3, 2-4-3-1` | a {Type} reference matches cards whose types include it, even inside a compound type | commands: play, resolve prompt; assert: prompts, getView | positive |
| `2-5-1, 2-5-2` | cards have attributes drawn from the six printed attributes | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-5-3, 2-5-4` | some cards have multiple attributes and are treated as having each of them (Slash half) | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-5-4, 2-5-6, 2-6-3` | a <Special> attribute reference matches a multi-attribute card and modifies its power | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-5-5` | only Leader cards and Character cards have attributes | commands: play; assert: getView, reject illegal move, zone/power state | negative/edge |
| `2-6-1, 2-6-2` | power is the battle strength, and only Leaders and Characters have it | commands: play, activate; assert: getView, reject illegal move, zone/power state | negative/edge |
| `2-6-2` | every printed Character card has a power value | commands: play, activate; assert: getView, reject illegal move, zone/power state | negative/edge |
| `2-7-5` | only Character cards, Event cards and Stage cards have costs | commands: play, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `2-7-6` | an effect may make a cost less than the written value | commands: play, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `2-8-1, 2-8-2` | card text describes effects, and Character text is not valid outside the Character area | commands: play, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `2-8-3` | card text is resolved in order starting from the text closest to the top | commands: play, resolve prompt, start game; assert: prompts, getView, zone/power state | positive |
| `2-8-5` | a card without card text is treated as having 'no base effect' | commands: play, resolve prompt, start game; assert: getView, zone/power state | negative/edge |
| `2-9-1, 2-9-2` | a Leader has a Life value, and at game start that many face-down Life cards are placed | commands: attack, start game; assert: getView, zone/power state | positive |
| `2-9-2-1` | the deck-top card is placed at the bottom of the Life area | commands: attack, resolve prompt, start game; assert: prompts, getView, zone/power state | positive |
| `2-9-3` | only Leader cards have Life | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `2-10-1` | a Character card's Counter increases the defending card's power during the Counter Step | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-10-1` | without a Counter, the same battle at equal power damages the Leader | commands: attack, resolve prompt; assert: getView, zone/power state | negative/edge |
| `2-10-2` | only Character cards have (Symbol) Counter | commands: play, attack, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `2-11-1` | an activated [Trigger] resolves instead of the card being added to the hand | commands: play, attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `2-11-1` | a declined [Trigger] adds the Life card to the hand instead | commands: play, attack, resolve prompt; assert: prompts, getView | negative/edge |
| `2-11-2` | [Trigger] is part of the card text and can be referenced by effects | commands: play, resolve prompt; assert: prompts, getView | positive |
| `2-14-2` | a deck may contain up to 4 cards with the same card number | catalog/structural assertion | positive |
| `2-14-2, 1-3-1` | a card whose own text overrides the limit may exceed 4 copies (1-3-1) | catalog/structural assertion | positive |
| `2-14-3` | every card has a unique card number | catalog/structural assertion | positive |

### 3. Game Areas (`03-game-areas.test.ts`)

_36 tests; 8 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `3-1-1, 3-1-3` | each player possesses one of every area | commands: play, resolve prompt; assert: getView, zone/power state | positive |
| `3-1-4` | the number of cards in each area is open information to both players | commands: play, resolve prompt; assert: getView, zone/power state | positive |
| `3-1-6` | a power-modified Character bounced to hand and replayed has its printed power | commands: play, resolve prompt; assert: getView, zone/power state | positive |
| `3-1-6` | attached DON!! is stripped when a Character moves to another area and returns rested to the cost area | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `3-1-7, 3-2-3` | the owner decides the order of simultaneously placed cards, moving them one by one | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `3-1-8` | the opponent cannot confirm the order cards are placed into a secret area | commands: play, end turn, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `3-2-1, 3-2-2` | the deck is a secret area; neither player can check its contents | commands: play, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `3-3-1, 3-3-2` | each player places a DON!! deck; it is an open area whose count both players confirm | commands: play, attack, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `3-4-1` | cards drawn from the deck are placed in the hand | commands: play, attack, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `3-4-2` | a player can freely view the contents of their own hand | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `3-4-3` | players cannot view the contents of the other player's hand | commands: play, attack, resolve prompt; assert: getView, zone/power state | negative/edge |
| `3-5-1` | an Event card that has been activated is placed in the trash | commands: play, attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `3-5-1` | a Character card that has been K.O.'d is placed in the trash | commands: play, attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `3-5-2` | the trash is an open area; both players can view its contents and order | commands: play, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `3-6-1, 3-6-2` | the Leader is placed face-up in an open area | commands: play, attack, resolve prompt; assert: prompts, getView, reject illegal move | negative/edge |
| `3-6-3` | a Leader cannot be moved from the Leader area by card effects | commands: play, attack, end turn, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `3-7-2` | the Character area is an open area | commands: play, attack, end turn; assert: getView, reject illegal move, zone/power state | negative/edge |
| `3-7-4` | a Character cannot attack on the turn in which it is played | commands: play, attack, end turn; assert: getView, reject illegal move, zone/power state | negative/edge |
| `3-7-4` | a Character can attack from the next turn onward | commands: play, attack, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `3-7-4` | [Rush] is the printed exception; a Rush Character can attack on the turn it is played | commands: play, attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `3-7-5` | Characters are played active unless otherwise specified | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `3-7-6` | up to 5 Character cards can be placed in the Character area | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `3-7-6-1` | with 5 Characters in play, playing a new Character trashes 1 first | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `3-7-6-1` | trashed Character returns attached DON!! to the cost area | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `3-7-6-1` | an effect playing a Character into a full Character area offers the replacement choice | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `3-7-6-1` | an effect that plays a Character rested keeps the rested placement | commands: play, resolve prompt; assert: getView, zone/power state | positive |
| `3-8-2, 3-8-4` | Stages are played active in an open area | commands: play, end turn; assert: getView, zone/power state | positive |
| `3-8-5, 3-8-5-1` | playing a new Stage trashes the 1 Stage already in the Stage area | commands: play, attack, end turn; assert: getView, zone/power state | positive |
| `3-9-2` | the cost area is an open area; both players can view its contents | commands: attack, end turn; assert: getView, zone/power state | positive |
| `3-9-3` | DON!! cards are placed in the cost area as active | commands: play, attack, end turn; assert: getView, zone/power state | positive |
| `3-10-1` | each player's Life cards match their Leader's printed Life | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `3-10-2` | the Life area is a secret area; neither player can check face-down Life cards | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `3-10-2` | the card at the top of the Life cards is moved first | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `3-10-2-1` | a card added to the Life area face-up is treated as an open card | commands: play, resolve prompt; assert: getView | positive |
| `3-10-3` | looking at face-down Life cards leaves them face-down after the effect | commands: play, resolve prompt; assert: getView | positive |
| `3-10-3` | looking at a face-up Life card leaves it face-up after the effect | commands: play, resolve prompt; assert: getView | positive |

### 4. Basic Terminology (`04-terminology.test.ts`)

_20 tests; 7 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `4-3-1, 4-3-2` | the turn player is the player whose turn is in progress | commands: play, attack, end turn; assert: getView, zone/power state | positive |
| `4-4-1-1, 4-4-1-2` | field cards are either active or rested | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `4-5-1` | a drawn card is added to the hand without being revealed to the opponent | commands: play, resolve prompt; assert: getView, zone/power state | negative/edge |
| `4-5-2, 4-5-3` | "draw 2 cards" repeats the single-draw process twice from the top of the deck | commands: play, resolve prompt; assert: getView, zone/power state | positive |
| `4-5-3` | "draw X cards" does nothing when X is 0 | commands: play, attack, resolve prompt; assert: getView, zone/power state | negative/edge |
| `4-5-4, 4-8-2` | "draw up to X cards" may stop after any count from 0 to X (exception to ordinary up-to) | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `4-6-2-1` | 1 damage moves the top card of the damaged player's Life to their hand | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `4-6-2-2` | X damage repeats the 1-damage process X times | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `4-6-3` | a [Trigger] card drawn from Life during damage may be activated instead of added to hand | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `4-6-3-1` | a [Trigger] cannot be activated when the Life card is not added to hand | commands: play, attack, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `4-7-1, 4-7-2` | playing a card pays its cost; a card whose cost cannot be paid cannot be played | commands: play, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `4-8-1` | "up to X" chooses between 0 and X immediately before the effect processes | commands: activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `4-9-2` | "base" power is the printed number regardless of current power modifiers | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `4-9-2-1` | multiple set-base-power effects on one card apply the highest value | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `4-9-2-1` | a "base power" filter reads the effect-set base power instead of the printed value | commands: activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `4-10-1` | a failed "if" clause prevents the following clause from resolving | commands: play, activate, resolve prompt; assert: getView, zone/power state | negative/edge |
| `4-10-1` | when the "if" clause holds, the following clause resolves | commands: play, activate, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `4-10-2` | a failed "then" clause does not prevent later clauses from resolving | commands: play, activate, end turn, resolve prompt; assert: getView, zone/power state | negative/edge |
| `4-12-1` | «Set Power to 0» reduces power by its current value at activation for the duration | commands: play, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `4-12-2` | «Set Power to 0» does nothing when the target's power is already negative | commands: play, resolve prompt; assert: getView, zone/power state | negative/edge |

### 5. Game Setup (`05-game-setup.test.ts`)

_24 tests; 10 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `5-1-1, 5-1-2` | each player prepares 1 Leader, a 50-card deck, and a 10-card DON!! deck — exactly 1 Leader is accepted | catalog/structural assertion | positive |
| `5-1-2` | a deck without a Leader card is rejected | catalog/structural assertion | negative/edge |
| `5-1-2` | a deck with two Leader cards is rejected | catalog/structural assertion | negative/edge |
| `5-1-2` | a 50-card main deck alongside the Leader is accepted | catalog/structural assertion | positive |
| `5-1-2` | a 49-card main deck is rejected | catalog/structural assertion | negative/edge |
| `5-1-2` | an undersized main deck is rejected | catalog/structural assertion | negative/edge |
| `5-1-2` | a DON!! deck of other than 10 cards is rejected | catalog/structural assertion | negative/edge |
| `5-1-2-1` | a deck of Character, Event, and Stage cards is accepted | catalog/structural assertion | positive |
| `5-1-2-1` | a main deck containing a DON!! card is rejected | catalog/structural assertion | negative/edge |
| `5-1-2-2` | a card whose color is not included on the Leader is rejected | catalog/structural assertion | negative/edge |
| `5-1-2-3` | a deck may contain exactly 4 cards with the same card number | assert: zone/power state | positive |
| `5-1-2-3` | a deck with 5 cards with the same card number is rejected | assert: zone/power state | negative/edge |
| `5-1-2-4` | an unlimited-copies deck-construction effect replaces only the 4-copy limit | assert: zone/power state | negative/edge |
| `5-2-1-2` | each deck is shuffled and placed face-down in the deck area | assert: win/loss, zone/power state | positive |
| `5-2-1-3` | each Leader card is placed face-up in its Leader area | assert: win/loss, zone/power state | positive |
| `5-2-1-4` | the players decide by Jo Ken Po who chooses to go first or second | assert: win/loss, zone/power state | positive |
| `5-2-1-5` | the deciding player declares whether they go first or second | assert: zone/power state | positive |
| `5-2-1-6` | each player draws 5 cards from their deck as their opening hand | assert: zone/power state | positive |
| `5-2-1-6` | each player may redraw their hand once, and only once | commands: start game | negative/edge |
| `5-2-1-6-1` | a redraw returns the whole hand to the deck, reshuffles, and draws 5 cards | commands: start game | positive |
| `5-2-1-7` | each player places face-down Life equal to their Leader's Life value | commands: start game | positive |
| `5-2-1-7` | the deck-top card is placed at the bottom of the Life area | commands: start game | positive |
| `5-2-1-8` | the first player begins the game and starts their turn | commands: start game | positive |
| `5-2-1-8` | when the deciding player chooses second, the opponent starts the game | commands: start game | positive |

### 6. Game Progression (`06-game-progression.test.ts`)

_28 tests; 17 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `6-1-1, 6-1-2` | the turn player progresses a Refresh, Draw, DON!!, Main, and End Phase sequence | commands: attack, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `6-2-1` | effects that last 'until the start of your next turn' end during the Refresh Phase | commands: attack, give DON!!, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `6-2-2` | 'at the start of your turn' effects activate during the Refresh Phase, before the draw | commands: attack, give DON!!, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `6-2-3` | DON!! cards given to Leader and Character cards return to the cost area during the Refresh Phase | commands: attack, give DON!!, end turn, start game; assert: getView, zone/power state | positive |
| `6-2-4` | rested Leader, Character, Stage, and cost area cards become active during the Refresh Phase | commands: attack, end turn, start game; assert: getView, zone/power state | positive |
| `6-3-1` | the turn player draws 1 card from their deck during the Draw Phase | commands: play, attack, give DON!!, end turn, start game; assert: getView, zone/power state | positive |
| `6-3-1` | the player going first does not draw a card on their first turn | commands: play, attack, give DON!!, end turn, start game; assert: getView, zone/power state | negative/edge |
| `6-4-1` | the DON!! phase places 2 DON!! cards from the DON!! deck face-up in the cost area | commands: play, attack, give DON!!, end turn, start game; assert: getView, zone/power state | positive |
| `6-4-1` | the player going first places only 1 DON!! card on their first turn | commands: play, attack, give DON!!, end turn, start game; assert: getView, zone/power state | negative/edge |
| `6-4-2` | a DON!! deck with only 1 card places only 1 DON!! card | commands: play, attack, give DON!!, end turn; assert: getView, zone/power state | negative/edge |
| `6-4-3` | an empty DON!! deck places no DON!! cards | commands: play, attack, give DON!!, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `6-5-2` | Main Phase actions may be performed in any order and as many times as you wish | commands: play, attack, give DON!!, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `6-5-3-1` | play a Character card from your hand by resting DON!! equal to its cost | commands: play, activate, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `6-5-3-1` | play a Stage card from your hand by resting DON!! equal to its cost | commands: play, activate, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `6-5-3-1` | activate a [Main] Event card from your hand by resting DON!! equal to its cost | commands: play, give DON!!, activate, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `6-5-3-1` | a card cannot be played without enough active DON!! to pay its cost | commands: play, give DON!!, activate, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `6-5-4-1` | the turn player can activate [Activate: Main] effects during their Main Phase | commands: give DON!!, activate, end turn, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `6-5-5-1` | giving places an active DON!! card from the cost area underneath your Leader or a Character | commands: give DON!!, end turn; assert: getView, reject illegal move, zone/power state | negative/edge |
| `6-5-5-2` | Leader and Character cards gain +1000 power per given DON!! during your turn only | commands: attack, give DON!!, end turn; assert: getView, reject illegal move, zone/power state | negative/edge |
| `6-5-5-3` | giving can be performed as many times as you wish to the extent possible | commands: attack, give DON!!, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `6-5-5-4` | when a card with given DON!! moves to another area, those DON!! go to the cost area rested | commands: attack, give DON!!, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `6-5-5` | giving DON!! cannot be performed while a battle is in progress | commands: attack, give DON!!, end turn, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `6-5-6-1` | neither player can battle on their first turn | commands: attack, end turn, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `6-5-6-1` | an extra turn does not let the second player battle on their first active turn | commands: attack, end turn; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `6-5-6` | a second attack cannot be declared while a battle is in progress | commands: play, attack, end turn, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `6-6-1-1` | [End of Your Turn] effects activate during the End Phase | commands: play, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `6-6-1` | 'during this turn' modifiers expire when the turn ends | commands: play, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `6-6-1-4` | the turn ends and the non-turn player becomes the new turn player | commands: end turn; assert: getView | positive |

### 7. Attacks and Battles (`07-battle.test.ts`)

_23 tests; 6 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `7-1, 7-1-1-1` | the turn player declares an attack by resting an active Leader or Character | commands: attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `7-1-1-2` | the attack target is the opponent's Leader or a rested Character, never an active Character | commands: attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `7-1-1-3` | [When Attacking] effects activate at the Attack Step, before the battle continues | commands: attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `7-1-1-4` | if the target leaves the area during the Attack Step, the battle ends without damage | commands: attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `7-1-2-1` | the attacked player can activate a [Blocker] only once during a battle | commands: attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `7-1-2-2` | [On Block] effects activate when the [Blocker] is activated | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `7-1-3-1` | effects of the player being attacked that read 'when attacked' activate before the Counter Step | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `7-1-3-2` | the attacked player may perform Counter Step actions as many times as they wish | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `7-1-3-2-1` | trashing a Counter Character from hand adds its Counter value to the defending card's power | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `7-1-3-2-2` | the attacked player pays the cost of a [Counter] Event in hand and trashes it to activate it | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `7-1-3-3` | if the attacker leaves the area during the Counter Step, the battle ends without damage | commands: attack, resolve prompt; assert: win/loss, getView, zone/power state | negative/edge |
| `7-1-4-1` | the attacker wins the battle when its power is equal to the defending card's power | commands: attack, resolve prompt; assert: win/loss, prompts, getView, zone/power state | positive |
| `7-1-4-1-1` | winning against a Leader deals 1 damage and moves the top Life card to the owner's hand | commands: attack, resolve prompt; assert: win/loss, prompts, getView, zone/power state | positive |
| `7-1-4-1-1-1` | dealing damage while the opponent has 0 Life wins the game for the attacking player | commands: attack, resolve prompt; assert: win/loss, prompts, getView, zone/power state | positive |
| `7-1-4-1-1-2` | a Life card with [Trigger] moved by damage may be revealed and activated instead of added to hand | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `7-1-4-1-1-2` | activating the revealed [Trigger] resolves it instead of adding the card to hand | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `7-1-4-1-1-3` | [Double Attack] deals 2 damage, repeating the Life-to-hand movement for each damage | commands: attack; assert: getView, zone/power state | positive |
| `7-1-4-1-2` | a Character that loses the battle at equal or lower power is K.O.'d to the trash | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `7-1-4-2` | when the attacker's power is lower, it loses the battle and nothing happens | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `7-1-5-1, 7-1-5-5` | the battle ends and the game returns to the Main Phase | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `7-1-5-2` | effects that read 'at the end of this battle' activate when the battle ends | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `7-1-5-3` | the turn player's effects that last 'during this battle' become invalid at the end of the battle | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `7-1-5-4` | the non-turn player's effects that last 'during this battle' become invalid at the end of the battle | commands: attack, resolve prompt; assert: getView, zone/power state | positive |

### 8. Activating and Resolving Effects (`08-effects.test.ts`)

_32 tests; 15 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `8-1-1, 8-1-2` | an effect is a card-text command; a "may" effect may be declined with no processing | commands: play, attack, activate, end turn, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `8-1-2, 8-1-3-1` | a non-"may" auto effect must activate automatically, once per occurrence | commands: play, attack, activate, end turn, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `8-1-3-1-2` | an auto effect with an activation cost cannot activate when the cost cannot be paid | commands: play, attack, activate, end turn, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `8-1-3-2, 8-4-3` | an [Activate: Main] field effect is declared by the turn player in Main and resolves on that card | commands: play, activate, end turn, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `8-1-3-4` | an applied replacement effect replaces the original processing | commands: play, resolve prompt; assert: getView, zone/power state | positive |
| `8-1-3-4-1` | declining a replacement effect leaves the original processing in place | commands: play, attack, activate, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `8-1-3-4-5` | a replacement effect that cannot be carried out cannot be applied | commands: play, attack, activate, end turn, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `8-1-4-1, 8-1-4-2` | continuous effects last for a duration (contrast one-shot processing), then end | commands: play, attack, activate, end turn, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `8-2-1-1, 8-2-1-2` | a negated effect does not occur (invalid under conditions); its activation cost cannot be paid | commands: play, attack, activate, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `8-2-3` | an effect that already resolved is not retroactively invalidated | commands: play, attack, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `8-3-1-1` | multiple actions in one activation cost are all carried out to activate | commands: play, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `8-3-1-3` | an effect whose activation cost cannot be paid cannot be activated | commands: play, activate, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `8-3-1-4` | an optional activation cost may be declined, forgoing the effect | commands: play, attack, give DON!!, activate, resolve prompt; assert: getView, zone/power state | negative/edge |
| `8-3-1-5` | a ① cost rests that many active DON!! cards from the cost area | commands: play, attack, give DON!!, activate, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `8-3-1-6` | a DON!! −X cost returns that many DON!! cards to the DON!! deck | commands: play, attack, give DON!!, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `8-1-3-3-2, 8-3-2-3` | a permanent [DON!! x1] condition is met only when that many DON!! are given at activation | commands: play, attack, give DON!!, end turn; assert: prompts, getView, zone/power state | negative/edge |
| `8-3-2-4` | a [Your Turn] condition is met during your turn only | commands: play, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `8-3-2-1, 8-3-2-5` | [Opponent's Turn] and every other condition must all be fulfilled | commands: play, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `8-3-3` | effects after an unfulfilled "if" clause are not resolved | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `8-4-2` | activating the effect of an Event card trashes that Event card | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `8-4-4-1` | a choice is made during resolution, and "up to" allows choosing 0 | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `8-4-4-2, 8-4-4-4` | deck faces are checked to choose; a player may decline a secret-area choice | commands: play, attack, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `8-4-5` | an [On K.O.] auto effect activates when the card moves to the trash, an open area | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `8-5-2, 8-5-4` | "when you activate an Event" reacts to playing an Event card | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `8-5-3` | activating only an Event card's Life Trigger effect is not a card activation | commands: attack, resolve prompt; assert: getView, zone/power state | negative/edge |
| `8-6-1` | when activation timings coincide, the turn player resolves their effect first | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `8-6-1` | an effect playing a Character on the opponent's turn resolves the turn player's reaction first | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `8-6-1` | a Counter Event activation resolves the turn player's reaction first | commands: attack, give DON!!, resolve prompt; assert: getView, zone/power state | positive |
| `8-6-1` | effect damage dealt by the non-turn player resolves the turn player's reaction first | commands: play, attack, give DON!!, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `8-6-2` | an effect whose timing is fulfilled during damage processing waits until it completes | commands: play, attack, give DON!!, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `8-6-2-1` | a [Trigger] checked during damage processing may suspend that processing | commands: play, attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `8-6-3` | a reaction to a card activation resolves after that activation completes | commands: play, resolve prompt; assert: getView, zone/power state | positive |

### 9. Rule Processing (`09-rule-processing.test.ts`)

_3 tests; 1 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `9-1-1, 9-2-1-1, 9-2-1` | the 0-Life Leader-damage defeat is judged automatically, with no player input (9-2-1) | commands: play, attack, end turn; assert: win/loss, prompts, getView, zone/power state | positive |
| `9-1-2, 9-2-1-2, 9-2-1` | the 0-card-deck defeat resolves immediately, even mid-effect (9-2-1) | commands: play, end turn; assert: win/loss, getView, zone/power state | positive |
| `9-2-1-2` | a player who still has cards in their deck has not fulfilled the defeat condition | commands: end turn; assert: win/loss, getView, zone/power state | negative/edge |

### 10-1. Keyword Effects (`10-keyword-effects.test.ts`)

_14 tests; 11 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `10-1-1-1` | [Rush] allows a Character to attack during the turn in which it is played | commands: play, attack, end turn; assert: getView, reject illegal move, zone/power state | negative/edge |
| `10-1-1-1` | a Character without [Rush] cannot attack during the turn in which it is played | commands: play, attack, end turn; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-1-1-1, 6-5-6-1` | [Rush] does not let either player attack on their first turn | commands: play, attack, end turn; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-1-2-1` | [Double Attack] deals 2 damage to the opponent Leader's Life | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `10-1-3-1` | [Banish] trashes the damaged Life card without activating its [Trigger] | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `10-1-3-1` | the same Life card offers its [Trigger] when damaged by a non-[Banish] attacker | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `10-1-4-1` | [Blocker] rests to take the attack's place when your Leader is attacked | commands: attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-1-4-1` | [Blocker] activates only when another of your cards is attacked, once per battle | commands: attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-1-4-1` | a rested [Blocker] cannot be activated during the Block Step | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `10-1-5-1, 10-1-5-3` | a damaged [Trigger] card may be revealed and activated, is in no area while resolving, and is trashed afterward | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `10-1-5-2` | declining the [Trigger] adds the damaged card to hand | commands: play, attack, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-1-6-1` | [Rush: Character] may attack only Characters on the turn it is played | commands: play, attack, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-1-7-1` | [Unblockable] prevents the opponent from activating [Blocker] | commands: attack, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `10-1-7-1` | without [Unblockable] the same attack offers the opponent's [Blocker] | commands: attack; assert: prompts | negative/edge |

### 10-2. Keywords (`10-keywords.test.ts`)

_34 tests; 18 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `10-2-1-1, 10-2-1-2` | a Character that loses a battle is K.O.'d and placed from the Character area into its owner's trash | commands: attack; assert: getView, zone/power state | positive |
| `10-2-17-1, 10-2-17-2` | [On K.O.] activates on the field when K.O.'d and resolves while the card is in the trash | commands: attack; assert: getView, zone/power state | positive |
| `10-2-17-1` | a [On K.O.] activation condition is checked on the field before the card leaves | commands: play, attack, resolve prompt; assert: getView, zone/power state | positive |
| `10-2-17-1` | a [On K.O.] activation condition not fulfilled on the field does not activate | commands: play, attack, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `10-2-1-1` | a Character trashed by an effect that says K.O. is K.O.'d, so [On K.O.] activates | commands: play, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `10-2-1-3` | a Character trashed by an effect that does not say K.O. is not treated as K.O.'d, so [On K.O.] does not activate | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `10-2-1-3, 3-7-6-1` | trashing a Character by the 3-7-6-1 rule process is not a K.O. | commands: play, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-2-2-1` | an [Activate: Main] effect can be activated during the Main Phase | commands: play, attack, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-2-2-1` | an [Activate: Main] effect cannot be activated during the opponent's turn | commands: play, attack, activate; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-2-2-1` | an [Activate: Main] effect cannot be activated while in battle | commands: play, attack, activate; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-2-3-1` | a [Main] Event can be used during the Main Phase | commands: play, attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-2-3-1` | a [Main] Event cannot be used during the opponent's turn | commands: play, attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-2-3-1` | a [Main] Event cannot be used while in battle | commands: play, attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-2-3-1-1` | as an exception, a [Trigger] may activate a [Main] effect outside the Main Phase | commands: play, attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-2-4-1` | a [Counter] Event can be used during the opponent's Counter Step | commands: play, attack, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-2-4-1` | a [Counter] Event cannot be used during your own Main Phase | commands: play, attack, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `10-2-4-1-1, 10-2-4-1-2` | an effect may activate [Counter] when the effect says 'activate [Counter]' | commands: play, attack, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `10-2-5-1` | a [When Attacking] effect activates when an attack is declared during the Attack Step | commands: play, attack, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `10-2-6-1` | an [On Play] effect activates when the card is played | commands: play, attack, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `10-2-7-1` | an [End of Your Turn] effect activates and resolves once at the End Phase of your turn | commands: attack, end turn, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `10-2-7-1` | an [End of Your Turn] effect does not activate at the End Phase of the opponent's turn | commands: attack, end turn; assert: prompts, getView, zone/power state | negative/edge |
| `10-2-9-1` | the condition is satisfied when the card is given exactly X DON!! cards | commands: attack, resolve prompt; assert: getView, zone/power state | positive |
| `10-2-9-1` | the condition is satisfied when the card is given more than X DON!! cards | commands: attack, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `10-2-9-1` | the condition is not satisfied when fewer than X DON!! cards are given | commands: attack, end turn, resolve prompt; assert: getView, zone/power state | negative/edge |
| `10-2-10-1` | DON!! -X returns DON!! cards from the field to the DON!! deck | commands: attack, end turn, resolve prompt; assert: getView, zone/power state | positive |
| `10-2-11-1` | a [Your Turn] condition is satisfied during your turn and not during the opponent's turn | commands: activate, end turn, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `10-2-12-1` | an [Opponent's Turn] condition is satisfied during your opponent's turn and not during your turn | commands: activate, end turn, resolve prompt; assert: getView, reject illegal move, zone/power state | negative/edge |
| `10-2-13-1, 10-2-13-3` | a [Once Per Turn] effect resolves once and cannot be activated or have its cost paid again that turn | commands: play, activate, resolve prompt; assert: prompts, getView, reject illegal move, zone/power state | negative/edge |
| `10-2-13-2` | with multiple cards that have the same effect, each card may activate its [Once Per Turn] effect once | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `10-2-13-4` | a card that left the field and appeared again is treated as a different card and may activate its [Once Per Turn] effect again | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `10-2-14-1` | a Trash cost selects a card from the hand and places it in the trash | commands: attack, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `10-2-15-1` | an [On Block] effect activates during the Block Step when you activate your [Blocker] | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `10-2-15-1` | an [On Block] effect does not activate when the [Blocker] is not activated | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | negative/edge |
| `10-2-16-1` | an [On Your Opponent's Attack] effect activates after the opponent's Attack Step effects when an attack is declared | commands: attack, resolve prompt; assert: prompts, getView, zone/power state | positive |

### 11. Other (`11-other.test.ts`)

_6 tests; 1 negative/edge-named or expectFailure._

| Rule cite(s) | What the test proves | How engine correctness is evaluated | Kind |
| --- | --- | --- | --- |
| `11-1` | the draw outcome is representable — the game ends with no winner | commands: activate, resolve prompt; assert: win/loss, getView, zone/power state | positive |
| `11-2-1` | a card moved from deck to hand by a named search is revealed to both players | commands: activate, resolve prompt; assert: getView, zone/power state | positive |
| `11-2-2` | a card revealed by an effect becomes unrevealed after that effect resolves | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `11-3-1` | a look-at effect exposes the secret card's identity only to the effect's player | commands: play, activate, resolve prompt; assert: prompts, getView | negative/edge |
| `11-3-2` | looked-at cards remain in their original area with no zone movement | commands: play, activate, resolve prompt; assert: prompts, getView, zone/power state | positive |
| `11-3-3` | after a look with no instructed action, cards stay in their original state | commands: activate, resolve prompt | positive |

## Aggregate negative / edge coverage

- Total tests: **285**
- Negative/edge (name or `expectFailure`): **120**
- Use `expectFailure` for illegal moves: **74**
- Assert `getView` player-visible state: **256**
- Drive public commands: **264**
