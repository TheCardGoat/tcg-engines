# Effects & Resolution

Reference for effect types, activation, resolution order, and action steps.  
Source: Gundam Card Game Comprehensive Rules Ver. 1.5.0

---

## Effect Types (Section 10)

| Type             | Description                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| **Constant**     | Always active while the card is in play. Re-evaluated each game state check.                    |
| **Triggered**    | Fires automatically when its timing event occurs (e.g., 【Deploy】, 【Attack】, 【Destroyed】). |
| **Activated**    | Player pays a cost to fire during a specific window (【Activate·Main】 or 【Activate·Action】). |
| **Command**      | One-time resolution when a Command card is played.                                              |
| **Substitution** | Replaces a game rule rather than adding to it.                                                  |

---

## Resolution Rules (Section 10)

- Effects resolve in the **order written** on the card.
- All conditions and targets must be valid at the time of activation.
- If a target becomes invalid mid-resolution, skip that step; continue with remaining steps.
- The **active player** always resolves first when simultaneous effects occur.
- Perform actions **as much as possible** — partial resolution is valid when full resolution is impossible.
- Impossible actions are simply **skipped**, not failed.

---

## Action Steps (Section 9)

Action Steps occur during the Action Step (battle step 3) of a battle and allow players to respond:

1. The **active player** (attacker) gets the first action opportunity.
2. Available actions:
   - Play a card with **【Action】** timing.
   - Activate an **【Activate·Action】** effect.
   - **Pass**.
3. After each action or pass, the other player gets an action opportunity.
4. The Action Step ends when **both players pass consecutively**.

---

## Activation Costs

Effects may require one or more costs to activate:

- **Rest self**: Turn the card sideways (e.g., "Rest this Base：").
- **Pay resources**: Rest N resources (shown as ①②③ etc. in card text).
- **Discard**: Discard N cards from hand.
- **Rest friendly units**: Rest N friendly Units.

Costs are paid **before** the effect resolves. If the cost cannot be fully paid, the effect cannot be activated.

---

## Rules Management (Section 11)

Automatic checks occur throughout the game:

1. **Defeat conditions**: 0 shields + battle damage, or 0 cards in deck.
2. **Destruction**: Any Unit with accumulated damage ≥ HP is destroyed and sent to trash.
3. **Field limits**: Max 6 Units in battle area, max 15 resources. Excess must be sent to trash.

Rules management is checked after every game action and effect resolution.

---

## Conditions & Preconditions

Effects may have **preconditions** that must be true for the effect to be eligible:

- Board state checks (e.g., "While you have 2 or more [Trait] Units").
- Self-state checks (e.g., "While this Unit is linked").
- Turn checks (e.g., "During your turn").
- These are distinct from **target filters**, which determine what the effect acts upon.

---

## Conditional Branches

Some effects have if/then/else logic:

- Evaluate the condition at resolution time.
- Execute the matching branch's steps.
- `else` may chain into another conditional.
