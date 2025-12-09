# Combat and Challenges

**Topic:** Everything about challenging characters and locations, combat damage, and battle keywords
**When to Use:** Questions about attacking, defending, combat interactions, and battle keywords

## Overview
This index covers all rules related to challenges (combat), including how to challenge, damage in challenges, challenge restrictions, and keywords that affect combat.

---

## Core Challenge Rules

### How to Challenge a Character
**Summary:** Send your ready character to fight an exerted opposing character
**Key terms:** challenge, challenging character, exerted target, damage, simultaneous
**Rule refs:** 4.3.6.1-4.3.6.18
**Details in:** Section 4: Turn Structure (4.3.6)

**Basic Steps:**
1. Declare which of your characters is challenging
2. Choose an exerted opposing character
3. Check for restrictions (Bodyguard, etc.)
4. Exert your challenging character
5. "While challenging" effects apply
6. Triggered abilities go to bag and resolve
7. Challenge Damage Step - both deal damage simultaneously
8. Game state check - banish characters with damage ≥ willpower
9. Challenge ends

**Requirements:**
- Challenging character must be ready and dry
- Target must be exerted (unless you have Evasive)
- No restrictions preventing the challenge

---

### How to Challenge a Location
**Summary:** Attack an opponent's location to deal damage to it
**Key terms:** challenge location, location, no damage back, willpower
**Rule refs:** 4.3.6.19-4.3.6.23
**Details in:** Section 4: Turn Structure (4.3.6)

**Key Differences from Challenging Characters:**
- Locations are never ready or exerted - can be challenged anytime
- Locations don't have Strength - they don't deal damage back
- Otherwise follows normal challenge rules

---

### Challenge Damage Step
**Summary:** When and how damage is dealt during challenges
**Key terms:** simultaneous damage, strength, challenge damage step, not an ability
**Rule refs:** 4.3.6.13-4.3.6.16
**Details in:** Section 4: Turn Structure (4.3.6)

**How It Works:**
1. After triggered abilities resolve, challenge damage step occurs
2. Both characters deal damage equal to their Strength simultaneously
3. This is NOT an ability or effect (doesn't use the bag)
4. Calculate total Strength (base + modifiers)
5. Apply damage modification effects (Resist, etc.)
6. Place damage counters
7. Game state check determines if either/both are banished

**Important:** Damage is simultaneous - both characters can be banished

---

### Challenge Restrictions

#### Bodyguard
**Summary:** Must challenge this character first
**Key terms:** bodyguard, must challenge, ready, protection
**Rule ref:** 10.2
**Details in:** Section 10: Keywords (10.2)

**Effect:**
- While you have a ready character with Bodyguard, opponents must challenge it first
- Opponents can't challenge your other characters
- Only works while Bodyguard character is ready
- Evasive characters ignore Bodyguard

**Common Question:** "Can I challenge past a Bodyguard?"
**Answer:** No, unless your character has Evasive

---

#### Target Must Be Exerted
**Summary:** Can only challenge exerted characters normally
**Key terms:** exerted, ready, can't challenge ready
**Rule ref:** 4.3.6.7
**Details in:** Section 4: Turn Structure (4.3.6)

**Rule:** Target character must be exerted unless you have Evasive
**Exception:** Evasive keyword allows challenging ready characters

---

### Challenge Interruption
**Summary:** What happens if a character leaves the challenge early
**Key terms:** leaves challenge, removed, challenge ends
**Rule ref:** 4.3.6.23
**Details in:** Section 4: Turn Structure (4.3.6)

**Rule:** If either character is removed from the challenge, the challenge ends immediately
- Resolve remaining triggered abilities in the bag
- "While challenging" effects end
- No challenge damage step occurs

---

## Combat Keywords

### Evasive
**Summary:** Challenge ready characters and ignore Bodyguard
**Key terms:** evasive, challenge ready, ignore bodyguard, bypass
**Rule ref:** 10.4
**Details in:** Section 10: Keywords (10.4)

**Effect:**
- Can challenge ready characters (not just exerted)
- Ignores Bodyguard completely
- Very powerful offensive keyword

**Tactical Use:** Bypass defensive setups, challenge fresh characters

---

### Challenger
**Summary:** Deal bonus damage while challenging
**Key terms:** challenger, bonus damage, while challenging, stacks
**Rule ref:** 10.3
**Details in:** Section 10: Keywords (10.3)

**Effect:**
- Get +X Strength while YOU are the challenger
- Only applies when you're attacking, not when being challenged
- Multiple instances stack (Challenger +2 and +1 = +3 total)

**Example:** Character with 3 Strength and Challenger +2 deals 5 damage while challenging

**Common Mistake:** Doesn't apply when being challenged - only when challenging

---

### Resist
**Summary:** Take less damage from all sources
**Key terms:** resist, damage reduction, stacks, dealt damage only
**Rule ref:** 10.6
**Details in:** Section 10: Keywords (10.6)

**Effect:**
- Take X less damage from all sources
- Only affects "dealt" damage (not "put damage counters")
- Applies to challenge damage and ability damage
- Multiple instances stack (Resist +1 and +2 = +3 total)

**Example:** Character with Resist +2 takes 5 damage → only 3 damage counters placed

**Important:** Doesn't work against "put damage counters" effects

---

### Reckless
**Summary:** Can't quest, usually aggressive character
**Key terms:** reckless, can't quest, challenge only
**Rule ref:** 10.5
**Details in:** Section 10: Keywords (10.5)

**Effect:**
- This character cannot quest
- Can still challenge and use abilities
- Usually found on high-Strength characters

**Design Note:** Trade-off for powerful combat stats

---

## Combat Damage Calculation

### Basic Formula
```
Final Damage = (Base Strength + Challenger bonus) - Resist
```

### Examples:

**Example 1: Simple Challenge**
- Attacker: 4 Strength
- Defender: 3 Strength
- Result: Attacker takes 3 damage, Defender takes 4 damage

**Example 2: With Challenger**
- Attacker: 4 Strength, Challenger +2
- Defender: 3 Strength
- Result: Attacker takes 3 damage, Defender takes 6 damage (4+2)

**Example 3: With Resist**
- Attacker: 5 Strength
- Defender: 2 Strength, Resist +2
- Result: Attacker takes 2 damage, Defender takes 3 damage (5-2)

**Example 4: Complex**
- Attacker: 4 Strength, Challenger +2
- Defender: 3 Strength, Resist +1
- Result: Attacker takes 3 damage, Defender takes 5 damage (4+2-1)

---

## Damage and Banishment

### When Are Characters Banished?
**Summary:** During game state check after damage is dealt
**Key terms:** game state check, damage ≥ willpower, banished
**Rule refs:** 1.9.1.3, 9.1
**Details in:** Section 1: Concepts (1.9), Section 9: Damage

**Process:**
1. Damage is dealt in challenge damage step
2. Game state check occurs
3. Any character/location with damage ≥ willpower is banished
4. Banished cards go to discard
5. "When banished" abilities trigger

**Important:** Both characters can be banished if both have fatal damage

---

### Damage Is Persistent
**Summary:** Damage stays on cards across turns
**Key terms:** persistent damage, accumulates, doesn't heal
**Rule ref:** 9.1
**Details in:** Section 9: Damage

**Rules:**
- Damage doesn't go away at end of turn
- Accumulates over multiple challenges
- Only removed when card leaves play or an effect removes it

**Example:** Character takes 2 damage turn 1, 2 damage turn 2 = 4 total damage

---

## Common Combat Scenarios

### Scenario 1: Bodyguard Protection
**Q:** "Can I challenge a character protected by Bodyguard?"
**A:** No, you must challenge the Bodyguard character first (unless you have Evasive)

### Scenario 2: Challenging Ready Characters
**Q:** "Can I challenge a ready character?"
**A:** Only if your character has Evasive (10.4)

### Scenario 3: Both Characters Die
**Q:** "What if both characters would be banished?"
**A:** Both are banished - damage is simultaneous (4.3.6.13)

### Scenario 4: Challenger Only When Attacking
**Q:** "Does Challenger apply when I'm being challenged?"
**A:** No, only when YOU are the challenger (10.3)

### Scenario 5: Location Doesn't Fight Back
**Q:** "Does a location deal damage when I challenge it?"
**A:** No, locations have no Strength and don't deal damage (4.3.6.22)

### Scenario 6: Character Removed During Challenge
**Q:** "What if the defending character is returned to hand before damage?"
**A:** Challenge ends immediately, no damage is dealt (4.3.6.23)

---

## Related Sections

- **Section 4.3.6: Challenge** - Complete challenge rules
- **Section 9: Damage** - Damage mechanics
- **Section 10: Keywords** - Bodyguard, Evasive, Challenger, Resist, Reckless
- **Section 1.9: Game State Check** - When banishment occurs
- **Section 6.1: Characters** - Character requirements
- **Section 6.5: Locations** - Challenging locations

---

## Quick Reference

**Can I challenge if...**
- My character was just played? No (must be dry, unless Rush)
- My character is exerted? No (must be ready)
- Target is ready? No (unless you have Evasive)
- There's a ready Bodyguard? No (must challenge Bodyguard first, unless you have Evasive)
- Target is at a location? Yes (location doesn't prevent challenges)

**Damage calculations:**
- Base damage = Strength
- Add Challenger if challenging
- Subtract Resist if defending
- Deal damage simultaneously
- Check for banishment after damage

---

*For detailed rules, see the referenced sections in the comprehensive rules document*
