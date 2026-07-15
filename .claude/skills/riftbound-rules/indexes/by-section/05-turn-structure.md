# Section 5: Turn Structure

**Rule References:** 500-526
**Full Document:** `references/21_40_Riftbound_Core_Rules_2025_06_02.md`

## Overview
This section covers turn phases, game states, priority, focus, and cleanup procedures.

---

## 501-506: The Turn

### Basic Flow (502-506)
- Play continues cyclically until one player wins
- Phases are rigid, but actions within phases can be in any order
- Game Actions are performed one at a time, executed completely
- Game Actions cannot be performed simultaneously
- Turn Player changes when all phases complete

### Simultaneous Effects (503.2.a)
If multiple actions/effects/triggers activate simultaneously:
- Turn Order determines sequence

---

## 507-510: States of the Turn

The turn is always in one of four states:

### Showdown State vs Neutral State (508)
| State | Condition | Card Restrictions |
|-------|-----------|-------------------|
| **Showdown** | Showdown in progress | Only Action or Reaction |
| **Neutral** | No Showdown | Normal timing rules |

### Open State vs Closed State (509)
| State | Condition | Card Restrictions |
|-------|-----------|-------------------|
| **Closed** | Chain exists | Only Reaction |
| **Open** | No Chain | Normal timing rules |

### Combined States (510)
| State | Showdown? | Chain? | What Can Be Played |
|-------|-----------|--------|-------------------|
| **Neutral Open** | No | No | Any card (on your turn) |
| **Neutral Closed** | No | Yes | Reaction only |
| **Showdown Open** | Yes | No | Action or Reaction |
| **Showdown Closed** | Yes | Yes | Reaction only |

---

## 511-513: Priority and Focus

### Priority (512)
Permission to take Discretionary Actions.

**When you receive Priority:**
- Neutral Open State during your Action Phase
- Showdown State when you gain Focus
- Closed State when you control next item on Chain
- Closed State when you're next Relevant Player and current player passes

**No Priority = No Discretionary Actions**
(But Limited Actions can still be taken when instructed)

### Focus (513)
Permission to take Discretionary Actions during Showdown Open State.

**Key Rules:**
- Gaining Focus also grants Priority
- Passing Priority retains Focus
- No Focus during Neutral State

---

## 514-517: Phases of the Turn

### Start of Turn (515)

#### 1. Awaken Phase (515.1)
- Ready all Game Objects you control that can be readied

#### 2. Beginning Phase (515.2)
- **Beginning Step** - "At the start of Beginning Phase" effects
- **Scoring Step** - Holding occurs (score Battlefields you control)

#### 3. Channel Phase (515.3)
- Channel 2 runes from Rune Deck
- If fewer than 2 available, channel as many as possible

#### 4. Draw Phase (515.4)
- Draw 1 card
- If deck empty, Burn Out first, then draw
- **Rune Pool empties** at end of Draw Phase

### Action Phase (516)

- No defined structure
- Take any number of Discretionary Actions
- Neutral Open State (only Turn Player can play cards/abilities)
- **Teammates** (in team modes) can also play spells/abilities

#### Structured Sub-Phases:
- **Combat** - When opposing Units at same Battlefield
- **Showdowns** - During Combat or when moving to empty Battlefield

### End of Turn Phase (517)

#### 1. Ending Step (517.1)
- "At the end of turn" effects

#### 2. Expiration Step (517.2)
- Clear all marked damage from all Units
- All "this turn" effects expire simultaneously
- **Rune Pool empties**

#### 3. Cleanup Step (517.3)
- Perform a Cleanup

#### 4. Loop Check (517.4)
- If damage or new "this turn" effects occurred, return to Expiration Step

#### 5. Turn Passes (517.5)
- Next player in Turn Order becomes Turn Player

---

## 518-526: Cleanups

### When Cleanups Occur (519)
- After an item on the Chain resolves
- After a Move completes
- After a Showdown completes
- After a Combat completes

### Cleanup Steps (520-526)

1. **Kill damaged Units** (520) - Units with damage ≥ Might go to trash
2. **Remove combat status** (521) - Clear Attacker/Defender from Units not at Combat location
3. **Execute state-based effects** (522) - "While" and "As long as" effects
4. **Remove orphaned Hidden cards** (523) - Hidden cards without controller's Unit at Battlefield go to trash
5. **Mark Pending Combats** (524) - At Battlefields with opposing Units
6. **Trigger Showdowns** (525) - At uncontrolled Contested Battlefields (Neutral Open only)
7. **Trigger Combats** (526) - At Battlefields with Pending Combat (Neutral Open only)

---

## Turn Phase Summary

```
START OF TURN
├── Awaken Phase (Ready your stuff)
├── Beginning Phase
│   ├── Beginning Step (Start effects)
│   └── Scoring Step (Hold scoring)
├── Channel Phase (Get 2 runes)
└── Draw Phase (Draw 1, pool empties)

ACTION PHASE
├── Take Discretionary Actions
├── Combat (when triggered)
└── Showdowns (when triggered)

END OF TURN
├── Ending Step (End effects)
├── Expiration Step (Clear damage, expire effects, pool empties)
└── Cleanup Step
```

---

## Common Questions

**Q: When can I play cards?**
A: During your Action Phase in Neutral Open State (or with Action/Reaction keywords at other times)

**Q: When does damage clear?**
A: At the Expiration Step of End of Turn and after Combat resolution

**Q: When do I channel runes?**
A: During Channel Phase, you channel 2 runes

**Q: When does my Rune Pool empty?**
A: At end of Draw Phase and at end of Expiration Step

**Q: Can my opponent play cards during my turn?**
A: Only with Reaction keyword, or during Showdowns with Action keyword

**Q: What triggers a Cleanup?**
A: Chain resolution, Move completion, Showdown completion, Combat completion

---

## Related Sections

- **Section 6: Chains & Showdowns** - Detailed chain and showdown rules
- **Section 8: Game Actions** - What actions you can take
- **Section 9: Combat** - Combat phase details

---

*For detailed rules, read the full section in the Core Rules document*
