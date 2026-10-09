# Grand Archive simulator layout

How the Grand Archive board should be arranged on desktop and mobile, and which UI states may be on screen together.

Wireframes for the states below are in [grand-archive-simulator-layout-wireframes.html](grand-archive-simulator-layout-wireframes.html). Open that file in a browser to review or adjust them.

The board stays on screen. One decision sits in front of it. The effects stack stays visible beside that decision whenever the decision might refer to it. Those three layers are the whole layout.

Placing simultaneous triggers is narrower than a free-form mix of modes. You place your own simultaneous triggers one at a time. A trigger that needs a target asks for that target before it joins the stack. You are not reordering layers that are already there, and you are not aiming a spell at the same time. The official timing is in [Triggered Abilities, rule 10](https://rules.gatcg.com/game-mechanics/game-mechanics-abilities/abilities-triggered-abilities) and [Effects Stack, rule 4](https://rules.gatcg.com/game-mechanics/game-mechanics-game-zones/game-zones-effects-stack). The rules mirror is also at [tcg.online/grand-archive/llm/rules.txt](https://tcg.online/grand-archive/llm/rules.txt).

## Anchors

The board is flat. There is no perspective. The room shows only outside the frame. Cosmetics sit on the frame corners and must not enter the sand.

These positions do not move:

| Thing | Where | Hearthstone equivalent |
| --- | --- | --- |
| Opponent champion | Top center notch, overlapping the sand | Opponent hero |
| Your champion | Bottom center notch | Your hero |
| Life | Badge on the champion portrait | The 30 |
| Mastery | Round slot immediately right of that champion | Hero power |
| Equipped weapon | Slot immediately left of that champion | Weapon slot |
| Opponent memory | Top right of the frame, a count | Opponent mana |
| Your memory | Bottom left of the frame, a count | Your mana |
| Pass | Right edge of the sand, vertically centered | End turn |
| Opponent decks | Right rail, above Pass. Main deck, then material deck | Opponent deck |
| Your decks | Right rail, below Pass. Material deck, then main deck | Your deck |
| Graveyard and banishment | Small piles under that player's deck, still on the right rail | History is not on the sand |
| Allies, items, domains, tokens | The sand only. Theirs in the upper half, yours in the lower half | Minions |
| Hand | Fan below the frame, overlapping the bottom edge | Hand below the board |
| Stack | A column just left of Pass, on the frame, never on the champions | Stays off the sand |
| Intent | Cards laid in the center of the sand while combat is showing | The sand, between the heroes |
| Decision sentence | One line along the bottom of the sand. Pass stays where it is | The button does not move |

Memory is a count because those cards are face down. Opening it lifts a sheet. The sand stays empty when nothing is in play. Lineage peeks behind the champion portrait. It is not a row of cards on the sand.

## Desktop

```
room
┌ frame  cosmetic          their memory ┐
│        weapon  THEIR CHAMPION  mastery│  their deck
│                                        │  their material
│              their units               │
│                 SAND                   │  PASS
│              your units                │  your material
│        weapon   YOUR CHAMPION  mastery│  your deck
│ your memory                 graveyards │
└────────────────────────────────────────┘
              hand fan
```

## Mobile

The same anchors, stacked. Champion notches stay centered. Memory stays in the corners. Pass and both decks stay on the right edge. The hand is the bottom of the screen. The sand is whatever is left in the middle.

## What may be on screen together

| Situation | Field | Stack | Hand | Extra surface |
| --- | --- | --- | --- | --- |
| Idle, you have Opportunity | Full | Filmstrip, or a collapsed label | Full | Pass in the top rail |
| Idle, opponent has Opportunity | Full | Filmstrip | Yours visible, cards quiet | Their name on the Opportunity marker |
| Aim a fast card or ability while the stack is occupied | Full, legal targets lit | Filmstrip, including a ghost of the card you have announced | Collapsed | One sentence: who or what you are choosing |
| The legal target is itself a stack layer | Full | Filmstrip layers become the buttons | Collapsed | Same sentence |
| Pay a reserve cost | Dim | Filmstrip | Full, and the cards you tap are the payment | Sentence shows the cost still unpaid |
| Pay or sacrifice for wither | Objects that can be sacrificed stay lit | Filmstrip | Full, for the reserve payment | One sentence covers both zones |
| Pay a memory cost | Dim | Filmstrip | Collapsed | Memory sheet, then the random cards turn face up as they are banished |
| Payment adds another target | Returns to the aim row | Ghost layer stays | Collapsed again | Sentence names the new target |
| Place several of your triggers | Visible when the trigger you are about to place aims at the field | Layers already committed stay locked. A tray holds the ones you have not placed | Collapsed | Sentence: place the next trigger |
| That trigger needs a mode or a target | Legal objects lit | The trigger sits as a ghost until you confirm it | Collapsed | Mode chips, then the aim highlight, then it locks into the filmstrip |
| Declare an attack | Combat center and intent | Hidden. A legal attack starts with an empty stack | Collapsed | Steps on the board: attacker, weapons, defender, extra costs |
| Respond during combat, before retaliation or before damage | Intent and combatants stay | Filmstrip, plus a ghost if a spell was just announced | Collapsed | The aim sentence. This is not the attack frame |
| Choose retaliation | Defenders lit | Hidden | Collapsed | Yes or no on each awake defender |
| Order retaliation damage, or order prevention | Combat center stays visible | Hidden | Collapsed | A short ordered list over the units that are dealing or taking damage |
| Put cards back into the deck in order | Dim | One-line summary | Collapsed | Private sheet. The opponent sees a count |
| Browse your material deck to materialize | Dim | Filmstrip if this materialization is being responded to | Collapsed | Your material deck as a sheet. Illegal levels are visible and inert |
| Look through a public pile, lineage, or loaded cards | Stays as it was | Stays as it was | Stays as it was | A preview. A tap selects when a decision is aiming. Press-and-hold inspects |
| Concede, or the match is over | Frozen | Frozen | Frozen | Confirm dialog, or the result screen |

Inspection is allowed in every row. It must not become a second decision. If a choice is already open, a preview dismisses back to that choice.

## The trigger case, step by step

This is one decision with a child step, not two prompts fighting.

1. The stack filmstrip shows whatever was already waiting.
2. A tray shows only your triggers that are about to enter. The opponent's triggers are already placed, or they are waiting for their own turn to place them.
3. You drag that tray into the order you want. That drag does not rewrite the filmstrip yet.
4. You commit the first trigger. If it has a mode, the mode chips appear in the sentence bar. If it needs a target, the field and, when legal, the filmstrip light up. The trigger remains a ghost layer.
5. Confirming the target locks that ghost into the filmstrip at the position you chose.
6. The tray advances to the next trigger. Repeat until the tray is empty.
7. Opportunity returns. Pass becomes available again. The tray is gone.

A spell aimed from hand uses the same aim highlight and the same filmstrip. It does not open the tray. Modes and targets are chosen first, then reserve cards are chosen from the hand, matching [Card Activation, steps 1.4 through 1.8](https://rules.gatcg.com/game-mechanics/game-mechanics-playing-cards/playing-cards-card-activation). If paying the cost creates another required target, the layout returns to the aim row with the ghost still sitting on the stack.

## Decisions that never share the screen

Only one of these owns the sentence bar:

- Pass, which is the idle state.
- Announce a card or ability, then mode, target, and payment.
- Place your simultaneous triggers.
- Attack declaration.
- Retaliation.
- Order damage or prevention.
- Materialize from the material deck.
- Search, or privately order cards into the deck.
- Discard for a hand or memory limit.
- Pay or sacrifice for wither.
- Concede.

Dice rolls, wake-up, the draw, recollection, and combat damage itself are not decisions. They play out on the board and in the log while the controls stay quiet.

Attack declaration, the retaliation choice, and damage ordering leave the stack hidden because those windows open with an empty stack. Keeping an empty filmstrip on screen would only compete with the intent row.

Opportunity inside combat is a different frame. Before retaliation and before damage, a fast spell can be aimed while the intent row stays in the center and the stack docks beside it.

## Frames worth drawing

A new wireframe is worth drawing when a different combination of surfaces is on screen together. These are the extra frames beyond idle, aim, triggers, attack, reserve, and materialize:

- Combat response, with intent and the stack both visible.
- A stack layer is the thing being targeted.
- Retaliation, as yes or no on each awake defender.
- Ordering damage or prevention.
- Wither, because the field and the hand are both live.
- Inspecting a card while a decision is already open.
- Concede, which freezes the board under a dialog.

These situations reuse a frame that already exists:

- The opponent has Opportunity. Same as idle. Pass is absent, and your cards are quiet.
- Paying a memory cost, searching, or privately ordering cards into the deck. Same sheet as materialize. The sentence changes, and a deck-order sheet is private.
- A payment that adds another required target. Return to the aim frame. The ghost stays.
- Discarding for a hand or memory limit. Same as reserve. The hand is the only live zone.
- A mode with no target. The sentence bar gains chips. The board stays in the idle frame.
- Recollection, wake-up, draw, dice, and the damage hit itself. The phase label and the log change. No new controls appear.
- Bestow in Pantheon. Same sheet as materialize.

## Outside the match

Four more screens use the same card face and the same pile sheet, without a stack:

- Deck select and sideboard.
- The pregame champion reveal.
- A read-only board while you are waiting.
- The result screen after a champion dies, a deck-out, a concede, or a draw.

Pantheon adds one private pile and a bestow sheet. It uses the same sheet pattern as the material deck.
