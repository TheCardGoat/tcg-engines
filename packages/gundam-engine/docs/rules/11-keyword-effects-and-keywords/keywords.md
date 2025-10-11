# Keywords (Square Brackets)

> **Section:** 11-2. Keywords
> **Navigation:** [Back to Section 11 Summary](./light.md) | [View Keyword Effects](./keyword-effects.md) | [Full Section 11](./full.md)

Keywords are special markers displayed in square brackets `【】` on cards. They define when and how card effects activate during gameplay.

---

## Table of Contents

### Activated Effects
1. [【Activate･Main】](#activate-main) - Activated during main phase
2. [【Activate･Action】](#activate-action) - Activated during action steps

### Command Timing
3. [【Main】](#main) - Command playable in main phase
4. [【Action】](#action) - Command playable in action steps

### Triggered Effects
5. [【Burst】](#burst) - Triggers when Shield destroyed
6. [【Deploy】](#deploy) - Triggers on deployment
7. [【Attack】](#attack) - Triggers when attacking
8. [【Destroyed】](#destroyed) - Triggers when destroyed

### Pilot-Related Keywords
9. [【When Paired】](#when-paired) - Triggers on Pilot pairing
10. [【During Pair】](#during-pair) - Constant while paired
11. [【Pilot】](#pilot) - Pilot qualifications

### Restrictions
12. [【Once per Turn】](#once-per-turn) - Limits activations

---

## <a id="activate-main"></a>【Activate･Main】

**Rule Number:** 11-2-1

### Definition

【Activate･Main】 is the keyword for an activated effect that can only be activated during your main phase. Fulfilling conditional actions proceeding the colon activates the effect that follows it.

### Rules

11-2-1-1. 【Activate･Main】 is the keyword for an activated effect that can only be activated during your main phase. Fulfilling conditional actions proceeding the colon activates the effect that follows it.

11-2-1-1-1. An 【Activate･Main】 effect cannot be activated while a Unit is attacking.

11-2-1-2. "【Activate･Main】 \(condition\)：\(text\)" means you may fulfill the condition \(condition\) during your main phase. If you do, perform \(text\).

11-2-1-3. If an 【Activate･Main】 effect has neither a colon nor conditions listed for activation, you can activate it by declaring you are doing so.

### Key Points

- Can only be activated during your main phase (6-5)
- Cannot activate while a Unit is attacking
- Requires fulfilling conditions before the colon (if any)
- If no conditions are specified, simply declare activation
- Player chooses when to activate (unlike triggered effects)

### Format

**With Condition:** `【Activate･Main】 (condition): (effect)`
**Without Condition:** `【Activate･Main】 (effect)`

---

## <a id="activate-action"></a>【Activate･Action】

**Rule Number:** 11-2-2

### Definition

【Activate･Action】 is the keyword for an activated effect that can only activated during activation steps. Fulfilling conditional actions proceeding the colon activates the effect that follows it.

### Rules

11-2-2-1. 【Activate･Action】 is the keyword for an activated effect that can only activated during activation steps. Fulfilling conditional actions proceeding the colon activates the effect that follows it.

11-2-2-1-1. An action step occurs after the block step of a Unit attack and during the end phase.

11-2-2-2. "【Activate･Action】 \(condition\)：\(text\)" means you may fulfill the condition \(condition\) during an action step. If you do, perform \(text\).

11-2-2-3. If an 【Activate･Action】 effect has neither a colon nor conditions listed for activation, you can activate it by declaring you are doing so.

### Key Points

- Can only be activated during action steps
- Action steps occur: after the block step (7-5) and during the end phase (6-6-2)
- Requires fulfilling conditions before the colon (if any)
- If no conditions are specified, simply declare activation
- Player chooses when to activate during the action step

### Format

**With Condition:** `【Activate･Action】 (condition): (effect)`
**Without Condition:** `【Activate･Action】 (effect)`

---

## <a id="main"></a>【Main】

**Rule Number:** 11-2-3

### Definition

【Main】 is a keyword for a command effect on a Command card.

### Rules

11-2-3-1. 【Main】 is a keyword for a command effect on a Command card.

11-2-3-2. 【Main】 means this card can be played from your hand during your main phase.

### Key Points

- Appears on Command cards only
- Indicates the card can be played during your main phase (6-5-2-4)
- Pay the card's cost and activate its effect
- Command cards are placed in trash after resolution (unless otherwise stated)
- Some Command cards have both 【Main】 and 【Action】

---

## <a id="action"></a>【Action】

**Rule Number:** 11-2-4

### Definition

【Action】 is a keyword for a command effect on a Command card.

### Rules

11-2-4-1. 【Action】 is a keyword for a command effect on a Command card.

11-2-4-2. 【Action】 means this card can be played from your hand during an action step.

11-2-4-2-1. Action steps occur after the block step of a Unit attack and during the end phase.

11-2-4-2-2. Cards cannot be paired as Pilots during an action step.

### Key Points

- Appears on Command cards only
- Indicates the card can be played during action steps
- Action steps occur: after the block step (7-5) and during the end phase (6-6-2)
- Cannot pair Pilots during action steps
- Some Command cards have both 【Main】 and 【Action】

---

## <a id="burst"></a>【Burst】

**Rule Number:** 11-2-5

### Definition

【Burst】 is the keyword for a triggered effect that triggers when the card is revealed after being destroyed by damage or an effect or such while it is acting as a Shield.

### Rules

11-2-5-1. 【Burst】 is the keyword for a triggered effect that triggers when the card is revealed after being destroyed by damage or an effect or such while it is acting as a Shield.

11-2-5-2. "【Burst】 \(text\)" means when this card is acting as a Shield and is revealed after being destroyed, you may activate the following effect. If you do, perform \(text\).

11-2-5-3. You can also choose not to activate the 【Burst】 effect. In that case, the card is placed into the trash.

### Key Points

- Triggers when the card is destroyed while acting as a Shield
- Card is revealed when Shield is destroyed
- Activation is **optional** - you may choose not to activate
- If activated, perform the effect; if not, card goes to trash
- 【Burst】 effects have priority over other triggered effects (9-1-6-8)
- See Section 7-6-2-4 for Shield destruction rules

### Format

`【Burst】 (effect text)`

---

## <a id="deploy"></a>【Deploy】

**Rule Number:** 11-2-6

### Definition

【Deploy】 is the keyword for a triggered effect that triggers when that Unit or Base is first placed into the battle area.

### Rules

11-2-6-1. 【Deploy】 is the keyword for a triggered effect that triggers when that Unit or Base is first placed into the battle area.

11-2-6-2. "【Deploy】 \(text\)" means when this card is deployed, perform \(text\).

### Key Points

- Triggers when Unit or Base enters the battle area
- Triggers whether deployed from hand or by an effect
- Activates automatically when deployment occurs
- Resolves before game continues
- Only triggers the first time the card enters play (not if it returns)

### Format

`【Deploy】 (effect text)`

---

## <a id="attack"></a>【Attack】

**Rule Number:** 11-2-7

### Definition

【Attack】 is the keyword for a triggered effect that triggers when that Unit declares an attack.

### Rules

11-2-7-1. 【Attack】 is the keyword for a triggered effect that triggers when that Unit declares an attack.

11-2-7-2. "【Attack】 \(text\)" means when this Unit attacks, perform \(text\).

### Key Points

- Triggers during the attack step (7-3) when Unit declares attack
- Triggers whether attacking a player or a Unit
- Activates automatically when attack is declared
- Effect resolves during attack step before continuing to block step
- See Section 7-3-2 for 【Attack】 effect timing

### Format

`【Attack】 (effect text)`

---

## <a id="destroyed"></a>【Destroyed】

**Rule Number:** 11-2-8

### Definition

【Destroyed】 is the keyword for a triggered effect that triggers when that Unit or Base is destroyed and placed from the battle area or shield area into the trash.

### Rules

11-2-8-1. 【Destroyed】 is the keyword for a triggered effect that triggers when that Unit or Base is destroyed and placed from the battle area or shield area into the trash.

11-2-8-2. "【Destroyed】 \(text\) means when this Unit or Base is destroyed and placed into the trash, perform \(text\).

11-2-8-3. A triggered effect activated by 【Destroyed】 activates from the trash as an effect on the Unit or Base that was destroyed.

11-2-8-3-1. If there is text referring to the state of that Unit or Base, refer to its state while it was in its last location prior to being destroyed and placed into the trash.

### Key Points

- Triggers when Unit or Base is destroyed and placed into trash
- Does NOT trigger when moved to trash by other means (e.g., battle area excess management)
- Effect activates from the trash
- References to card state use last known information before destruction
- Resolves after the card is in the trash but before game continues

### Format

`【Destroyed】 (effect text)`

---

## <a id="when-paired"></a>【When Paired】

**Rule Number:** 11-2-9

### Definition

【When Paired】 is the keyword for a triggered effect that triggers when a Pilot is paired with that Unit.

### Rules

11-2-9-1. 【When Paired】 is the keyword for a triggered effect that triggers when a Pilot is paired with that Unit.

11-2-9-2. 【When Paired】 appears as "【When Paired･\(qualifications\) Pilot】\(text\)." This means when a Pilot fulfilling the \(qualifications\) is paired with this Unit, perform \(text\).

### Key Points

- Triggers when a Pilot pairs with the Unit
- May specify qualifications (traits, name, etc.) for the Pilot
- Only triggers if paired Pilot meets the qualifications
- Triggers when pairing occurs (during main phase or by effect)
- Different from 【During Pair】 which is a constant effect

### Format

`【When Paired･(qualifications) Pilot】 (effect text)`
**Example:** `【When Paired･Amuro Pilot】 Draw 1 card.`

---

## <a id="during-pair"></a>【During Pair】

**Rule Number:** 11-2-10

### Definition

【During Pair】 is the keyword for a constant effect that is continuously active while a Pilot is paired with that Unit.

### Rules

11-2-10-1. 【During Pair】 is the keyword for a constant effect that is continuously active while a Pilot is paired with that Unit.

11-2-10-2. 【During Pair】 appears as "【During Pair･\(qualifications\) Pilot】\(text\)." This means while a Pilot fulfilling the \(qualifications\) is paired with this Unit, perform \(text\).

### Key Points

- Constant effect active while Pilot is paired
- May specify qualifications (traits, name, etc.) for the Pilot
- Only active if paired Pilot meets the qualifications
- Effect is continuous - no activation required
- Effect ends immediately when Pilot is removed or qualifications no longer met

### Format

`【During Pair･(qualifications) Pilot】 (effect text)`
**Example:** `【During Pair･Char Pilot】 This Unit gets AP+2.`

---

## <a id="pilot"></a>【Pilot】

**Rule Number:** 11-2-11

### Definition

【Pilot】 is the keyword for Pilot qualifications which typically appear following 【When Paired】 or 【During Pair】 keywords.

### Rules

11-2-11-1. 【Pilot】 is the keyword for Pilot qualifications which typically appear following 【When Paired】 or 【During Pair】 keywords.

11-2-11-2. If it appears as 【\(qualifications\) Pilot】, it will fulfill the 【When Paired】 or 【During Pair 】 condition if the Pilot fulfills those \(qualifications\).

11-2-11-3. If it appears as 【Pilot】 without \(qualifications\), any Pilot will fulfill the condition when paired.

### Key Points

- Indicates Pilot qualification requirements
- Can specify traits, names, or other qualifications
- `【Pilot】` without qualifications means any Pilot qualifies
- `【(qualifications) Pilot】` means only Pilots with those qualifications
- Used with 【When Paired】 and 【During Pair】 effects

### Format

**Any Pilot:** `【Pilot】`
**Specific Pilot:** `【(qualifications) Pilot】`
**Examples:**
- `【Pilot】` - Any Pilot
- `【Amuro Pilot】` - Only Amuro
- `【(Gundam) Pilot】` - Only Pilots with (Gundam) trait

---

## <a id="once-per-turn"></a>【Once per Turn】

**Rule Number:** 11-2-12

### Definition

【Once per Turn】 is the keyword indicating that that effect can only be activated one time during that turn.

### Rules

11-2-12-1. 【Once per Turn】 is the keyword indicating that that effect can only be activated one time during that turn.

11-2-12-2. If multiple Units or Bases have a copy of the same effect with 【Once per Turn】, each Unit or Base can activate it one time.

### Key Points

- Limits the effect to one activation per turn
- Applies per card - each card with the effect can activate once
- Does NOT limit based on effect name - multiple cards with same 【Once per Turn】 effect can each activate
- Resets at the start of each turn
- Applies to that specific card's instance of the effect

### Format

Effects with this keyword appear as:
`【Once per Turn】 (effect text with activation conditions)`

### Example Scenario

If you control three Units that each have the same 【Once per Turn】 effect, each of those three Units can activate their effect once during the turn (total of 3 activations).

---

## Summary: Keywords by Category

### Activated Effects (Player-Controlled Timing)
- **【Activate･Main】** - Activate during your main phase
- **【Activate･Action】** - Activate during action steps

### Command Card Timing
- **【Main】** - Play Command during main phase
- **【Action】** - Play Command during action steps

### Triggered Effects (Automatic Activation)
- **【Burst】** - When Shield destroyed (optional)
- **【Deploy】** - When entering play
- **【Attack】** - When declaring attack
- **【Destroyed】** - When destroyed

### Pilot Mechanics
- **【When Paired】** - Triggered when Pilot pairs
- **【During Pair】** - Constant while paired
- **【Pilot】** - Qualification marker

### Restrictions
- **【Once per Turn】** - Limits to one activation per turn per card

---

## Cross-References

### Related Sections
- **Section 6-5 (Main Phase)** - When 【Main】 and 【Activate･Main】 can be used
- **Section 7-3 (Attack Step)** - When 【Attack】 triggers
- **Section 7-5 (Action Step)** - When 【Action】 and 【Activate･Action】 can be used
- **Section 8 (Action Steps)** - Detailed action step rules
- **Section 9-1-6 (Triggered Effects)** - General triggered effect rules
- **Section 9-1-7 (Activated Effects)** - General activated effect rules
- **Section 6-5-2-3 (Pilot Pairing)** - When 【When Paired】 triggers

---

*This document covers all 12 keywords from Section 11-2. For angle-bracket keyword effects like <Repair> and <Blocker>, see [keyword-effects.md](./keyword-effects.md).*
