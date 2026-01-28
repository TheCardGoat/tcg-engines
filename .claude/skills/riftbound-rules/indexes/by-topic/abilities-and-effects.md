# Abilities & Effects

**Topic:** Passive abilities, triggered abilities, activated abilities, replacement effects, the chain
**When to Use:** Questions about how abilities work, timing, and resolution

## Overview
This index covers all ability types, how they work, and when they resolve.

---

## Ability Types

| Type | Recognition | Timing | Uses Chain? |
|------|-------------|--------|-------------|
| **Passive** | Statement of fact | Always active | No |
| **Replacement** | "instead" | When event would occur | No |
| **Activated** | Cost : Effect | Your turn, Open State | Yes |
| **Triggered** | "when" / "at" | When condition met | Yes |

---

## Passive Abilities

**Rule refs:** 567-570

### What They Are
Conditions, rules, constraints, or statements that affect gameplay.

### Recognition
- Statements of fact
- May include "if" or "while" for conditions

### Examples
> "I get +1[S] while you have 2 or more cards in your hand."
> "Friendly Yordles at my battlefield have [Shield]."
> "While I'm attacking or defending alone, I have +2 [S]."

### When Active
- **On Permanents:** While on the Board
- **Outside Board:** Self-describe their context (e.g., "Play me only during...")
- **Cost modifiers:** Active in any zone the card can be played from

---

## Replacement Effects

**Rule refs:** 571-575

### What They Are
Abilities that alter another game effect or rule.

### Recognition
Identified by **"instead"**

### Example
> "The next time a friendly unit would die, kill this instead. Recall that unit exhausted."

### How They Work
1. Watch for specific event
2. When event would occur, intercede
3. Replace original event with new effect

### Multiple Replacement Effects
If multiple apply to same event:
- **Object being acted on:** Owner decides order
- **Player being acted on:** That player decides order
- **Uncontrolled Battlefield:** Turn Player decides order

---

## Activated Abilities

**Rule refs:** 576-581

### What They Are
Repeatable effects with a cost that you choose to use.

### Recognition
Format: `[Cost] : [Effect]`

### Examples
> "[2]: Draw 1" - Pay 2 Energy to draw 1 card
> "[T]: Add [1]" - Exhaust to add 1 Energy
> "Kill this, [2]: Draw 2" - Kill this and pay 2 Energy to draw 2

### When You Can Activate
- Your turn
- Open State
- Not during Showdown (unless Action/Reaction keyword)

### Process
1. Declare activation
2. Ability goes on Chain (state becomes Closed)
3. Make choices, determine costs
4. Pay costs
5. Opponents can respond with Reactions
6. Ability resolves

### Common Costs
| Symbol | Meaning |
|--------|---------|
| [X] | X Energy |
| [C] | 1 Power of specified domain |
| [T] or ⬇ | Exhaust this |
| Discard X | Discard X cards |
| Kill this | Kill this permanent |

---

## Triggered Abilities

**Rule refs:** 582-585

### What They Are
Effects that happen automatically when a condition is met.

### Recognition
Identified by **"when"** or **"at"**

### Examples
> "When you conquer here, you may spend a buff to draw 1"
> "At the end of your turn, ready 2 runes."
> "When I attack, deal 1 damage to a unit."

### Structure
- **Condition:** What triggers the ability (after "when" or "at")
- **Effect:** What happens (after the comma)

### How They Work
1. Condition is met
2. Ability is placed on the Chain
3. Can trigger during any state, any player's turn
4. Resolves when it's the top item on Chain

### Multiple Triggers
If multiple trigger simultaneously:
- Same controller: Controller chooses order
- Different controllers: Turn Order determines sequence

### Where Active
- **On Permanents:** While on Board
- **Outside Board:** Self-describe their context

**Example:**
> "When you conquer, you may discard 1 to return this from your trash to your hand."
> (Only triggers while in trash)

---

## The Chain

**Rule refs:** 532-544

### What It Is
- Temporary zone for spells and abilities being resolved
- Exists when cards are played or abilities activated
- Creates **Closed State**

### Resolution Order
**Last In, First Out (LIFO)**
- Most recent item resolves first
- Then next most recent, etc.

### Chain Process
1. Card/ability placed on Chain
2. State becomes Closed
3. Active Player can add more (Reactions only)
4. Priority passes to other Relevant Players
5. When all pass, top item resolves
6. Cleanup occurs
7. Repeat until Chain is empty

### What Can Be Added During Closed State
- **Reaction** spells
- **Reaction** abilities
- Triggered abilities (automatic)

---

## Ability Timing Summary

| Ability Type | When It Works |
|--------------|---------------|
| Passive | Always (while in appropriate zone) |
| Replacement | When replaced event would occur |
| Activated | Your turn, Open State, not Showdown |
| Triggered | When condition is met (any time) |

---

## Keywords as Abilities

Many keywords are specific ability types:

| Keyword | Ability Type |
|---------|--------------|
| Accelerate | Optional Additional Cost |
| Action | Permission (timing) |
| Assault | Passive |
| Deathknell | Triggered |
| Deflect | Passive |
| Ganking | Passive |
| Hidden | Permission |
| Legion | Conditional |
| Reaction | Permission (timing) |
| Shield | Passive |
| Tank | Passive |
| Temporary | Triggered |
| Vision | Triggered |

---

## Common Questions

**Q: Can I activate abilities on my opponent's turn?**
A: No, unless they have Action or Reaction keyword

**Q: Do triggered abilities use the Chain?**
A: Yes, they're placed on the Chain when triggered

**Q: What if two abilities trigger at the same time?**
A: Controller chooses order. If different controllers, Turn Order determines sequence.

**Q: Are passive abilities always active?**
A: On Permanents, only while on Board. Some specify other zones.

**Q: Can I respond to an activated ability?**
A: Yes, with Reaction cards/abilities while it's on the Chain

**Q: What's the difference between Activated and Triggered?**
A: Activated = you choose when to pay cost and use it. Triggered = automatic when condition is met.

**Q: Can triggered abilities trigger from the trash?**
A: Only if they specifically say so (e.g., "When you conquer, return this from your trash...")

**Q: Do replacement effects use the Chain?**
A: No, they intercede during event resolution

---

## Related Sections

- **Section 6: Chains & Showdowns** - Chain resolution details
- **Section 7: Abilities** - Full ability rules
- **Section 11: Keywords** - Keyword abilities

---

*For detailed rules, read the full section in the Core Rules document*
