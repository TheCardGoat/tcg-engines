# Section 9: Combat & Scoring

**Rule References:** 620-633
**Full Document:** `references/41_60_Riftbound_Core_Rules_2025_06_02.md`

## Overview
This section covers when and how combat occurs, damage assignment, and the scoring system.

---

## 620-623: Combat Basics

### When Combat Occurs (621)
Combat occurs when:
- A Cleanup occurs
- No items on the Chain
- A Battlefield has Units controlled by two opposing players

### Pending Combat (622)
- Combat is **Pending** if opposing Units are present but Steps haven't started
- Turn Player chooses which Pending Combat to resolve first
- If Pending Combat stops being Pending before Steps begin, it's not resolved

### Two-Player Limit (623)
- Combat can only occur between exactly **two players**
- Battlefields with Pending/In-Progress Combat are invalid destinations for other players
- Units that would be played to such Battlefields go to controller's Base instead

---

## 624-628: Steps of Combat

### Step 1: Showdown Step (625)

#### 1a. Establish Roles
- **Attacker** = Player who applied Contested status
- **Defender** = Other player

#### 1b. Modulate Might
- Attacking Units with **Assault** get +X Might
- Defending Units with **Shield** get +X Might

#### 1c. Initial Chain (if applicable)
- "When I attack" triggers go on Chain
- "When I defend" triggers go on Chain
- Player with Focus orders first, then Turn Order

#### 1d. State Closes (if Initial Chain exists)

#### 1e. Attacker becomes Active Player

#### 1f. Proceed with Chain play as normal

### Step 2: Combat Damage Step (626)

**Only occurs if both Attacking and Defending Units remain**

#### 2a. Sum Might
- Calculate total Might of all Attacking Units
- Calculate total Might of all Defending Units

#### 2b. Distribute Damage (Attacker first)
Each player distributes damage equal to their summed Might:

**Damage Assignment Rules:**
1. Units with **Tank** must be assigned lethal damage first
2. Must assign lethal damage to a Unit before moving to next
3. Obey all requirements and restrictions if able

**Lethal Damage** = Nonzero damage ≥ Unit's Might

**Example:**
> 5 damage to distribute among four 3-Might units:
> Must assign at least 3 to one unit, remaining 2 to another.
> Cannot split 2-1-1-1.

### Step 3: Resolution Step (627)

#### 3a. Remove Units with Lethal Damage
- Units with damage ≥ Might are killed

#### 3b. Determine Outcome

| Remaining Units | Result |
|-----------------|--------|
| Both Attacking and Defending | Attackers are **Recalled** |
| Only Attacking | Battlefield is **Conquered** |
| Only Defending | Defenders retain control |
| Neither | No control change |

#### 3c. Clear Contested Status

#### 3d. Clear All Damage
- From all Units at all Locations

### Step 4: Cleanup (628)
Perform a Cleanup after Combat completes.

---

## 629-633: Scoring

### Two Ways to Score (630)

#### Conquer (630.1)
- Gain control of a Battlefield you didn't score this turn
- In team modes: Battlefields controlled by teammate during Beginning Phase are disqualified

#### Hold (630.2)
- Control a Battlefield during your Beginning Phase

### Scoring Limit (631)
- May only Score once per Battlefield per turn (from either method)

### When You Score (632)

#### 1. Earn Points (632.1)
- Earn up to 1 point (depending on current score)

**Final Point Restrictions (632.1.a-b):**
When 1 point from Victory Score:
- **Hold:** Score the Final Point
- **Conquer all Battlefields this turn:** Score the Final Point
- **Conquer but not all:** Draw a card instead

#### 2. Trigger Score Abilities (632.2)
- **Conquer abilities** trigger at Conquered Battlefield
- **Hold abilities** trigger at Held Battlefield
- Only trigger when Battlefield is Scored (max once per turn per player)

### Winning (633)
When a player reaches Victory Score, they **Win immediately**.

---

## Victory Scores by Mode

| Mode | Victory Score |
|------|---------------|
| 1v1 (Duel) | 8 |
| 1v1 (Match) | 8 |
| FFA3 (Skirmish) | 8 |
| FFA4 (War) | 8 |
| 2v2 (Magma Chamber) | 11 |

---

## Combat Flow Summary

```
COMBAT TRIGGERED
├── Step 1: Showdown
│   ├── Establish Attacker/Defender
│   ├── Apply Assault/Shield
│   ├── Initial Chain (attack/defend triggers)
│   └── Players can play Action/Reaction cards
│
├── Step 2: Combat Damage (if both sides remain)
│   ├── Sum Might for each side
│   └── Distribute damage (Tank first, lethal before moving on)
│
├── Step 3: Resolution
│   ├── Kill Units with lethal damage
│   ├── Determine outcome (Recall/Conquer/Defend)
│   ├── Clear Contested status
│   └── Clear all damage
│
└── Step 4: Cleanup
```

---

## Damage Assignment Examples

### Example 1: Basic Assignment
**Attacker:** 6 total Might
**Defender Units:** 3 Might, 3 Might, 2 Might

Attacker must assign:
- At least 3 to first unit (lethal)
- Remaining 3 to second unit (lethal)
- 2-Might unit survives

### Example 2: Tank Priority
**Attacker:** 5 total Might
**Defender Units:** 2 Might (Tank), 3 Might, 3 Might

Attacker must assign:
- At least 2 to Tank first (lethal)
- Remaining 3 to one other unit (lethal)
- One 3-Might unit survives

### Example 3: Multiple Tanks
**Attacker:** 7 total Might
**Defender Units:** 3 Might (Tank), 2 Might (Tank), 4 Might

Attacker can choose which Tank first:
- Option A: 3 to first Tank, 2 to second Tank, 2 to 4-Might (survives)
- Option B: 2 to second Tank, 3 to first Tank, 2 to 4-Might (survives)

---

## Common Questions

**Q: When does Combat happen?**
A: After a Cleanup when opposing Units are at the same Battlefield (621)

**Q: Can more than 2 players be in Combat?**
A: No, Combat is always between exactly 2 players (623)

**Q: What happens if all Units die in Combat?**
A: No control change occurs (627.1.a.1)

**Q: How do I score the final point?**
A: Either Hold, or Conquer all Battlefields in the same turn (632.1.b)

**Q: Does damage carry over between Combats?**
A: No, damage clears at end of Combat Resolution Step (627.5)

**Q: Can I choose which Combat happens first?**
A: Yes, Turn Player chooses if multiple are Pending (622.1)

---

## Related Sections

- **Section 5: Turn Structure** - When Combat occurs in turn flow
- **Section 6: Chains & Showdowns** - Showdown rules during Combat
- **Section 11: Keywords** - Assault, Shield, Tank keywords

---

*For detailed rules, read the full section in the Core Rules document*
