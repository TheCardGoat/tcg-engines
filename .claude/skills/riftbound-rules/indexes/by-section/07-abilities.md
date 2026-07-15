# Section 7: Abilities

**Rule References:** 564-585
**Full Document:** `references/21_40_Riftbound_Core_Rules_2025_06_02.md`

## Overview
This section covers all ability types, how they work, and their timing and resolution rules.

---

## 564-566: Ability Basics

### Definition (565)
An Ability is the structured rules and capabilities of Game Objects or Spells.

### Ability Types (565.1)
- Passive Abilities
- Replacement Effects
- Activated Abilities
- Triggered Abilities

### Multiple Abilities (566)
A card can have more than one Ability and more than one type of Ability.

---

## 567-570: Passive Abilities

### Definition (568)
Conditions, rules, constraints, or statements that affect the course of regular play.

### Recognition (568.1-568.2)
- Wide variety of formats
- Recognized by being **statements of fact**
- Examples:
  - "I get +1[S] while you have 2 or more cards in your hand."
  - "Friendly Yordles at my battlefield have [Shield]."

### Conditional Passive Abilities (568.3)
- Recognized by "if" or "while"
- Examples:
  - "While I'm attacking or defending alone, I have +2 [S]."
  - "If an opponent controls a battlefield, I enter ready."

### Where They're Active

#### On Permanents (569)
- Typically only active while on the Board

#### Outside the Board (570)
- Self-describe their context
- Example: "Play me only during an opponent's turn" applies in any playable zone
- Can alter costs as cards are played

---

## 571-575: Replacement Effects

### Definition (572)
An ability that alters the application of another game effect or game rule.

### Types
- Passive Abilities can be Replacement Effects
- Triggered Abilities can be Replacement Effects

### Recognition (573.1)
Identified by the term **"instead"**

**Example:**
> "The next time a friendly unit would die, kill this instead. Recall that unit exhausted."

### How They Work (573-574)
- Intercede during execution of a Game Effect
- Alter its execution
- Can alter typical flow of play

### Multiple Replacement Effects (575)
If more than one applies to the same event:
- **Object being acted on:** Owner decides order
- **Player being acted on:** That player decides order
- **Uncontrolled Battlefield:** Turn Player decides order

---

## 576-581: Activated Abilities

### Definition (577)
Repeatable effects with a cost. Follow a process similar to Playing a Card.

### Recognition (577.2)
Presence of **":"** in text, preceded by cost and succeeded by effect.

**Example:**
> "[2]: Draw 1" - Cost is 2 energy, effect is draw 1 card.

### Process (577.3)
1. Declare activation
2. Ability goes on Chain (Closed State)
3. Follow steps 557-563 (like playing a card)
4. Opponents can respond
5. Execute the ability

### Timing (578-581)
- Controller chooses when/whether to activate
- Present on Game Objects and some Spells
- Primarily activated while on the Board
- **Can only be activated:**
  - On Controlling Player's Turn
  - During an Open State

---

## 582-585: Triggered Abilities

### Definition (583)
Repeatable effects that happen when a Condition is met.

### Recognition (583.1)
Identified by **"when"** or **"at"** in the ability.

**Examples:**
> "When you conquer here, you may spend a buff to draw 1"
> "At the end of your turn, ready 2 runes."

### Structure (583.2)
- **Condition** - Follows the "When" or "At"
- **Effect** - Instruction after the comma

### How They Work (583.3)
When Condition is met:
- Behaves like an Activated Ability
- Placed on the Chain
- Can trigger during Closed or Open States, any player's turn

### Multiple Triggers (583.3.b)
If multiple trigger simultaneously:
- Controller selects order to place on Chain
- If multiple players: Turn Order determines sequence

### Where They're Active

#### On Permanents (584)
- Typically active while on the Board
- Conditions only evaluated while on Board

#### Outside the Board (585)
- Rely on Information Level of their zone
- Self-describe their context

**Example:**
> "When you conquer, you may discard 1 to return this from your trash to your hand."
> (Triggers while in trash, not elsewhere)

---

## Ability Type Summary

| Type | Recognition | Timing | Uses Chain? |
|------|-------------|--------|-------------|
| **Passive** | Statement of fact | Always active | No |
| **Replacement** | "instead" | When event would occur | No |
| **Activated** | Cost : Effect | Your turn, Open State | Yes |
| **Triggered** | "when" / "at" | When condition met | Yes |

---

## Common Questions

**Q: Can I activate abilities on my opponent's turn?**
A: No, Activated Abilities can only be activated on your turn during Open State (581)

**Q: Do Triggered Abilities use the Chain?**
A: Yes, they're placed on the Chain when triggered (583.3)

**Q: What if two Replacement Effects apply to the same event?**
A: The owner of the affected object (or player) decides the order (575)

**Q: Are Passive Abilities always active?**
A: On Permanents, typically only while on Board. Some specify other zones (569-570)

**Q: Can Triggered Abilities trigger from the trash?**
A: Only if they specifically say so (585.2)

**Q: What's the difference between Activated and Triggered?**
A: Activated = you choose when to pay cost and use it. Triggered = automatic when condition is met.

---

## Related Sections

- **Section 6: Chains & Showdowns** - How abilities resolve on the Chain
- **Section 11: Keywords** - Keyword abilities
- **Section 4: Cards & Types** - Which card types have which abilities

---

*For detailed rules, read the full section in the Core Rules document*
