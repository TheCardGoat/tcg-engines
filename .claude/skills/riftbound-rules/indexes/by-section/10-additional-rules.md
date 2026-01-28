# Section 10: Additional Rules

**Rule References:** 634-652, 700-711
**Full Document:** `references/41_60_Riftbound_Core_Rules_2025_06_02.md`

## Overview
This section covers effect layering, modes of play, conceding, and additional game mechanics like buffers and the Mighty status.

---

## 634-639: Layers

### Purpose (635-636)
Layers are the mechanism for applying Game Effects that alter traits, abilities, or properties of Game Objects.
- Organizational structure only
- No intrinsic rules or influence
- Ensures consistent application order

### The Three Layers (637)

#### Layer 1: Trait-Altering Effects (637.1)
Effects that grant, remove, or replace inherent traits:
- Name
- Super Type
- Type
- Tags
- Controller
- Cost
- Domain
- **Might assignment** (setting Might to a value)
- Copying (one object becoming a copy of another)

**Recognition:** "become(s)", "give", "is", "are"

**Example:**
> "A unit's Might becomes 4 this turn" - Applied in Layer 1

#### Layer 2: Ability-Altering Effects (637.2)
Effects that grant, remove, or replace abilities or rules text:
- Keywords
- Passive Abilities
- Appending rules text
- Removing rules text
- Duplicating rules text

**Recognition:** "become(s)", "give", "lose(s)", "have", "has", "is", "are"

**Example:**
> "Other friendly units have [Vision]" - Applied in Layer 2

#### Layer 3: Arithmetic (637.3)
Mathematics of increasing/decreasing numeric values:
- Might (+X/-X)
- Energy Cost
- Power Cost

All applications are arithmetic (addition/subtraction).

### Ordering Within Layers (638-639)

#### Dependency (638)
If multiple effects in same layer, check for dependency:
- Does one effect alter the existence of the other?
- Does one effect alter how many objects the other affects?
- Does one effect alter the outcome of the other?

If dependency exists, apply dependent effect last.

#### Timestamp (639)
If no dependency, apply in timestamp order:
- First effect played → applied first
- Newest effect → applied last

---

## 640-648: Modes of Play

### Required Variables (642)
Each Mode must define:
- Number of Players
- Formation (solo/team, number of opponents)
- Victory Score
- Battlefield Count
- Setup variations
- Format
- First Turn Process
- Unique Rules (if any)

### Sanctioned Modes

#### 1v1 Duel (644)
| Variable | Value |
|----------|-------|
| Players | 2 |
| Formation | 1v1, no teams |
| Victory Score | 8 |
| Battlefields | 2 (each provides 3, randomly select 1) |
| Format | Best of 1 |
| First Turn | Second player channels extra rune |

#### 1v1 Match (645)
| Variable | Value |
|----------|-------|
| Players | 2 |
| Formation | 1v1, no teams |
| Victory Score | 8 |
| Battlefields | 2 (each provides 3, select 1, used ones removed for next game) |
| Format | Best of 3 (first to 2 Set Points) |
| First Turn | Second player channels extra rune |

#### FFA3 Skirmish (646)
| Variable | Value |
|----------|-------|
| Players | 3 |
| Formation | FFA, 2 opponents each |
| Victory Score | 8 |
| Battlefields | 3 (each provides 3, randomly select 1) |
| Format | Best of 1 |
| First Turn | First player doesn't draw; last player channels extra rune |

#### FFA4 War (647)
| Variable | Value |
|----------|-------|
| Players | 4 |
| Formation | FFA, 3 opponents each |
| Victory Score | 8 |
| Battlefields | 3 (first player's battlefields removed) |
| Format | Best of 1 |
| First Turn | First player doesn't draw; last player channels extra rune |

#### 2v2 Magma Chamber (648)
| Variable | Value |
|----------|-------|
| Players | 4 |
| Formation | 2v2, 2 opponents, 1 teammate |
| Victory Score | 11 |
| Battlefields | 3 (first player's battlefields removed) |
| Format | Best of 1 |
| First Turn | First player doesn't draw; last player channels extra rune |

**Unique 2v2 Rules (648.8):**
- Teammates can play spells during each other's turns
- Teammate-controlled Battlefields during Beginning Phase can't be scored
- Control is NOT shared (can't Hide at teammate's Battlefield)
- "Friendly" includes teammate's Game Objects
- Teammates are Relevant Players by default
- Hands remain Private (but can communicate freely)
- Final Point: Must score all Battlefields not held by ally at Beginning Phase

---

## 649-652: Conceding

### Basic Rules (650-651)
- Player may concede at any time
- Conceding player is removed from game
- If only one player remains, they Win
- If multiple remain, follow Removal of a Player

### Removal of a Player (652)

1. **Banish all permanents and runes** they control or own
2. **Remove their Battlefield** (replace with token battlefield if in use)
3. **Remove all cards they own** from game
4. **Counter all spells and abilities** they control

### Game Continuation (652.5)
- **Turn:** If removed player was Turn Player, next in order takes over
- **Focus:** If removed player had Focus, next Relevant Player gets it
- **Priority:** If removed player had Priority, next Relevant Player gets it

---

## 700-711: Buffers and Mighty

### Buffers (701-705)

#### What They Are (702)
- Objects placed on Units
- Tracked with buff reminder cards or any spare object
- Can be added or spent

#### Rules
- **Adding:** Place buff on Unit (if it doesn't have one)
- **Spending:** Remove single buff from Unit you control
- **Limit:** Only ONE buff per Unit at a time
- **Effect:** Each buff contributes +1 Might
- **Removal:** If Unit leaves play, remove all buffs

### Mighty (706-711)

#### Definition (707-708)
- Unit "is Mighty" if Might is **5 or greater**
- Unit "becomes Mighty" when Might changes from <5 to ≥5

#### Evaluation
- **On Board (710):** Use current Might (including modifiers)
- **In Non-Board Zones (711):** Use inherent/printed Might

**Example:**
> 3-Might unit gets +3 this turn → becomes Mighty (now 6)
> When effect expires → no longer Mighty (back to 3)

---

## Common Questions

**Q: In what order do +Might and "becomes X Might" apply?**
A: "Becomes X" is Layer 1 (trait-altering), +X is Layer 3 (arithmetic). Layer 1 first, then Layer 3.

**Q: What happens to my cards if I concede?**
A: They're banished (permanents/runes) or removed from game (652)

**Q: Can a Unit have multiple buffs?**
A: No, maximum one buff per Unit (702.3)

**Q: What's the Victory Score for 2v2?**
A: 11 points (648.3)

**Q: Can I play spells on my teammate's turn in 2v2?**
A: Yes (648.8.a)

**Q: Is a 4-Might unit with a buff Mighty?**
A: Yes, 4 + 1 = 5, which is Mighty (708)

---

## Related Sections

- **Section 5: Turn Structure** - Turn flow in different modes
- **Section 9: Combat & Scoring** - Victory conditions
- **Section 8: Game Actions** - Buff action details

---

*For detailed rules, read the full section in the Core Rules document*
