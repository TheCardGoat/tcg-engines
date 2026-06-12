# Abilities & Effects - By Topic Index

**Comprehensive Rules Version 2.0.1** - Effective February 5, 2026

## Overview

This topic covers all types of abilities, how they work, when they trigger, and how effects resolve.

---

## Quick Questions

| Question                             | Answer Location               |
| ------------------------------------ | ----------------------------- |
| **What is a triggered ability?**     | See Triggered Abilities below |
| **What is an activated ability?**    | See Activated Abilities below |
| **What is a static ability?**        | See Static Abilities below    |
| **What is the bag?**                 | See The Bag below             |
| **How do replacement effects work?** | See Replacement Effects below |
| **How do modifiers work?**           | See Ability Modifiers below   |
| **How do effects resolve?**          | See Resolving Effects below   |

---

## Triggered Abilities

**Rule refs:** 6.2, 7.7

Triggered abilities automatically occur when their condition is met.

### How They Work

1. Continuously watch for trigger condition
2. When condition met, ability added to **the bag**
3. Resolves when chosen from bag (see Bag rules below)
4. Only trigger once per condition occurrence

### Trigger Words

Abilities start with:

- "When [X happens]..."
- "Whenever [X happens]..."
- "At the start of [turn/phase]..."
- "At the end of [turn/phase]..."

### Timing

- Added to bag when condition met
- If met during resolving effect, waits in bag until effect finishes
- Resolved during Main Phase or between steps

### Common Triggers

- "When you play this character"
- "Whenever this character quests"
- "At the start of your turn"
- "When this character is banished"
- "Whenever you [do something]"

### Secondary "If" Conditions

- "If [condition], [effect]" in effect text
- Checked during resolution, not when triggering
- If false, effect resolves with no result

---

## Activated Abilities

**Rule refs:** 4.4, 6.3

Activated abilities are used by choice by paying a cost.

### How They Work

1. Choose ability to use
2. Pay all costs (typically ○ and/or ink)
3. Effect resolves immediately
4. Resulting triggers go into bag

### Cost Payment

- Must pay full cost to use
- Can't use if can't pay cost
- "For free" means no cost except ○

### Character Restrictions

- **With ○ cost:** Character must be dry
- **Without ○ cost:** Can use same turn character enters play
- Must not be questing or in challenge

### Items/Locations

- Activated abilities can be used same turn played
- No ○ means dry requirement doesn't apply

---

## Static Abilities

**Rule refs:** 6.4

Static abilities are always active while their source is in play (or for specified duration).

### How They Work

- Continuously apply without needing to activate
- Last for duration specified or while source in play
- Apply immediately when conditions met
- End immediately when duration ends or source leaves play

### Types of Static Abilities

**Unconditional Static:**

- "Your characters get +1 Ⓒ"
- Always applies while source in play

**Conditional Static (unless):**

- "This character can't quest unless you have [condition]"
- Effect applies while condition is FALSE
- Doesn't apply when condition is TRUE

**Conditional Static (if):**

- "During your turn, you may play this character for free if [condition]"
- Effect applies while condition is TRUE
- Doesn't apply when condition is FALSE

### Conditional Words

- **unless** = effect active while condition false
- **if** = effect active while condition true
- Check condition continuously during game

### Duration Examples

- "Until start of your next turn"
- "For the rest of the game"
- "While this character is exerted"
- No duration = lasts while source in play

---

## Replacement Effects

**Rule refs:** 6.5

Replacement effects replace one event with another.

### How They Work

1. Wait for specified event to happen
2. Replace that event (partially or completely)
3. Original event never happens
4. Modified event occurs instead

### Indicators

- Most include word "instead"
- "Do X instead of Y"
- "If you do X, do Y instead"
- "Gain 2 lore instead of 1"

### One Chance Only

- Each replacement effect has one chance per event
- Can't apply again even if condition becomes true again
- Self-replacement always applied first

### Multiple Replacements

When multiple can apply to same event:

1. Apply self-replacement if able
2. Choose one other replacement
3. Repeat until no more apply

### Examples

- "If you would gain lore, gain 2 instead"
- "Deal 2 damage instead of 1 if [condition]"
- "Put 2 damage counters on this character instead"

---

## Ability Modifiers

**Rule refs:** 6.6

Modifiers change characteristics like Ⓒ, ⣇, or ◇.

### How Modifiers Work

- Apply continuously to cards
- Apply immediately when they would affect
- All modifiers combine together (no specific order)
- New modifiers combine with existing ones

### Negative Characteristics

- **Negative Ⓒ:** Deals 0 damage in challenges, counts as 0 for abilities
- **Negative ◇:** Gains 0 lore when questing
- Actual value unchanged for calculating further modifiers

### "Can't Be Reduced Below"

- After all modifiers applied, check if below specified value
- If below, characteristic becomes specified value
- Doesn't change actual value, just calculated result

### Examples

- "Your characters get +1 Ⓒ" = Add 1 to all Ⓒ
- "This character gets -1 Ⓒ for each card in opponent's hand" = Calculate total modifier
- "Your characters' Ⓒ can't be reduced below printed value" = Minimum check

---

## The Bag

**Rule refs:** 1.7, 7.7

The bag is where triggered abilities wait to resolve.

### How the Bag Works

1. Triggered ability condition met → Added to bag
2. Wait until current effect finishes resolving
3. Check which players have abilities in bag
4. Active player chooses and resolves one of their abilities
5. If active player has more, continue
6. If active player done, pass to next player
7. Repeat until bag empty

### Key Points

- Only triggered abilities go in bag
- Active player resolves their abilities first
- Players take turns in clockwise order
- New triggers from resolving go into bag for next check
- Game state check after each effect

### Bag Priority

- Active player: Resolves first
- Next player clockwise: Resolves when active player done
- Repeat until all players' abilities resolved

---

## Resolving Effects

**Rule refs:** 6.7

Comprehensive process for resolving effects.

### Resolution Steps (in order)

1. **Count "for each"** - Determine number
2. **Check secondary "if"** - If false, resolve with no effect
3. **Check replacements** - Apply any replacement effects
4. **Calculate damage** - If dealing, apply modifiers for final amount
5. **Perform instructions** - Follow all text in order, make choices

### During Resolution

- Resulting triggers go into bag (wait to resolve)
- Game state check after effect fully resolved
- If multiple players act, active player first, then clockwise

### Playing Cards During Resolution

- If instructed to play card during resolving effect
- That card played and resolves during current effect
- Its triggers go into bag, wait until current effect finishes

---

## Quick Reference

| Ability Type    | How It Works                       | When Resolves             |
| --------------- | ---------------------------------- | ------------------------- |
| **Triggered**   | Condition met → Added to bag       | When chosen from bag      |
| **Activated**   | Pay cost → Use immediately         | Immediately               |
| **Static**      | Always active while source in play | Continuously              |
| **Replacement** | Event happens → Replaced           | Instead of original event |

---

## Common Questions

**Q: Can I respond to my opponent's triggered ability?**
A: No. Triggered abilities resolve from the bag with no response window. New triggers go into bag for next check.

**Q: Do static abilities stack?**
A: It depends. Some stack (+[N] modifiers), some don't. Check card text or specific keyword rules.

**Q: What happens if I can't complete an effect?**
A: Do as much as you can. Golden Rule 1.2.3 says resolve as much as possible even if some parts can't be done.

**Q: Can I use an activated ability on the turn I play the card?**
A: Only if the ability doesn't have ○ in its cost. Abilities with ○ require the character to be dry.

**Q: Do replacement effects trigger abilities?**
A: No. The original event never happened, so its triggers don't occur. Modified event can trigger different abilities.

---

## Related Sections

- **By-Section:** Section 6 for complete ability rules
- **By-Topic:** Turn Actions for abilities from actions
- **By-Topic:** Keywords for keyword abilities
- **By-Topic:** Card Zones for zone-related abilities

---

_See full rules in: `references/disney-lorcana-comprehensive-rules/Disney-Lorcana-Comprehensive-Rules.md`_
