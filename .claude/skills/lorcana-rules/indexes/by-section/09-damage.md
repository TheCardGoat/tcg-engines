# Section 9: Damage

**Rule References:** 9.1 - 9.4
**Full Document:** `references/disney-lorcana-comprehensive-rules/Disney_Lorcana_Comprehensive_Rules_082225_EN_251019_220309.md` (Section 9)

## Overview
This section covers how damage works in Disney Lorcana, including damage representation, dealing damage, and what happens when cards leave play.

---

## 9.1. Representation of Damage
**Summary:** How damage is tracked on cards
**Key terms:** damage counters, willpower, persistent, accumulates
**Rule refs:** 9.1.1-9.1.x

**Rules:**
- Damage is represented by placing damage counters on cards
- Damage is persistent - it doesn't go away at end of turn
- Damage accumulates over multiple turns
- When damage ≥ willpower, the card is banished (via game state check)

**Methods of Tracking:**
- Physical counters (dice, beads, etc.)
- Digital tracking via app
- Any clear method agreed upon by players

**Important:**
- Damage stays on cards until:
  - Card is banished
  - Card leaves play
  - An effect removes the damage
- Damage does NOT reset at end of turn

---

## 9.2. "Put" Damage
**Summary:** Difference between dealing and putting damage
**Key terms:** deal damage, put damage, damage counters
**Rule refs:** 9.2.1-9.2.x

### "Deal" vs "Put":

**Deal Damage:**
- Result of combat (challenge damage step)
- Result of abilities that say "deal X damage"
- Can be modified by effects (e.g., Resist reduces dealt damage)
- Subject to prevention effects

**Put Damage:**
- Abilities that say "put X damage counters"
- Cannot be modified by effects like Resist
- Bypasses damage prevention
- Less common than dealing damage

**Example:**
- "Deal 2 damage" - Can be reduced by Resist
- "Put 2 damage counters" - Cannot be reduced by Resist

---

## 9.3. Moving Damage Counters
**Summary:** Effects that move damage between cards
**Key terms:** move damage, damage counters, transfer
**Rule refs:** 9.3.1-9.3.x

**Rules:**
- Some effects move damage counters from one card to another
- This is different from dealing or putting damage
- The damage is simply transferred
- No damage prevention applies
- Damage limits still apply (can't exceed willpower before being banished)

**Example:**
- "Move up to 3 damage counters from this character to another character"
- Damage is removed from first card and added to second card

---

## 9.4. Leaving Play
**Summary:** What happens to damage when cards leave play
**Key terms:** leaves play, damage removed, no memory
**Rule refs:** 9.4.1-9.4.x

**Rules:**
- When a card leaves play, all damage on it is removed
- If the card returns to play, it's treated as a new card with no damage
- Cards have no "memory" of their previous state
- Damage only matters while the card is in play

**Examples:**
- Character is banished with 3 damage → Damage is gone
- Character returned to hand with 2 damage → If played again, starts with 0 damage
- Character shifted onto another → The new character starts fresh (no damage from the one underneath)

---

## Damage Flow

### 1. Damage is Dealt or Put
- Challenge damage step (both characters deal damage simultaneously)
- Ability deals damage ("Deal X damage to...")
- Ability puts damage ("Put X damage counters on...")

### 2. Damage Counters are Placed
- Physical counters placed on the card
- Damage accumulates with any existing damage

### 3. Game State Check
- Happens after the damage is dealt/put
- If damage ≥ willpower, card is banished

### 4. Card is Banished (if applicable)
- Card goes to discard
- All damage is removed
- "When banished" abilities trigger

---

## Key Damage Concepts

### Willpower = HP
- Willpower is like hit points
- Character with 5 willpower can take 5 damage before being banished
- Locations also have willpower and can be damaged

### Persistent Damage
- Damage does NOT heal at end of turn
- Accumulates over multiple turns
- Only removed when card leaves play or an effect removes it

### Overkill Doesn't Matter
- If a character has 3 willpower and takes 5 damage, it's just banished
- Extra damage doesn't carry over anywhere

### Simultaneous Damage in Challenges
- Both characters deal damage at the same time in the challenge damage step
- Both can be banished if both have damage ≥ willpower
- Game state check determines if either/both are banished

---

## Damage Modification

### Effects That Modify Damage:

**Resist** (Keyword, Section 10.6)
- Reduces damage dealt by X
- Only affects "dealt" damage, not "put" damage
- Example: "Resist +2" means take 2 less damage

**Challenger** (Keyword, Section 10.3)
- Increases damage dealt in challenges
- Example: "Challenger +3" means deal 3 more damage while challenging

**Support** (Keyword, Section 10.11)
- Temporarily increases strength (which increases damage dealt)
- Example: "Support" gives another character +1 strength this turn

**Strength Modifiers**
- Any effect that changes strength changes damage dealt
- Static abilities, triggered abilities, etc.

---

## Common Questions This Section Answers

**Q: Does damage go away at end of turn?**
A: No, damage is persistent and stays on the card (9.1)

**Q: What's the difference between "deal damage" and "put damage counters"?**
A: "Deal" can be modified (e.g., by Resist), "put" cannot (9.2)

**Q: If my character takes damage and is returned to hand, does it keep the damage?**
A: No, damage is removed when the card leaves play (9.4)

**Q: When does challenge damage happen?**
A: In the Challenge Damage step, after triggered abilities resolve (Section 4.3.6.13)

**Q: Can Resist reduce "put damage counters" effects?**
A: No, Resist only affects dealt damage, not put damage (9.2)

**Q: If a character is shifted onto, does the new character keep the damage?**
A: No, the new character is a new card and starts with no damage (9.4)

**Q: When are characters banished due to damage?**
A: During the game state check after damage is applied (Section 1.9)

**Q: Do both characters in a challenge deal damage even if one is banished first?**
A: Yes, damage is dealt simultaneously in the challenge damage step (Section 4.3.6.13)

---

## Related Sections

- **Section 1.9: Game State Check** - When damage causes banishment
- **Section 4.3.6: Challenge** - Challenge damage step and timing
- **Section 5.1: Conditions** - Damaged/undamaged card conditions
- **Section 6.2.10: Willpower** - How much damage a card can take
- **Section 10.3: Challenger** - Increases damage in challenges
- **Section 10.6: Resist** - Reduces damage dealt
- **Section 10.11: Support** - Increases strength temporarily

---

## Examples

### Example 1: Simple Damage in Challenge
- Character A (3 Strength, 4 Willpower) challenges Character B (2 Strength, 3 Willpower)
- Character B is exerted (can be challenged)
- Challenge occurs
- Challenge Damage Step: A deals 3 damage to B, B deals 2 damage to A
- Place counters: B has 3 damage, A has 2 damage
- Game State Check: B has damage ≥ willpower (3≥3), so B is banished. A survives with 2 damage.

### Example 2: Resist
- Character A (5 Strength) challenges Character B (2 Strength, 4 Willpower, Resist +2)
- Challenge Damage Step: A deals 5 damage, B deals 2 damage
- B's Resist applies: B takes 5-2=3 damage (not banished)
- A takes 2 damage
- Both survive

### Example 3: Accumulated Damage
- Turn 1: Character takes 2 damage (has 5 willpower)
- Turn 2: Same character takes 2 more damage (now has 4 damage)
- Turn 3: Same character takes 1 more damage (now has 5 damage ≥ 5 willpower)
- Game State Check: Character is banished

---

*For detailed rules, read the full section in the comprehensive rules document*
