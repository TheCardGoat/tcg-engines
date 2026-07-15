# Keywords Quick Reference

**Topic:** All keyword abilities with brief explanations
**When to Use:** Quick lookup for keyword mechanics

## Overview
This index provides a quick reference for all keyword abilities in Riftbound.

---

## All Keywords Alphabetically

### Accelerate
**Type:** Optional Additional Cost (Units)
**Effect:** Pay 1[C] when playing to enter ready instead of exhausted
**Rule ref:** 717
**Stacks:** No

**How it Works:**
- Pay 1 Power (matching unit's domain) as additional cost
- Unit enters ready instead of exhausted
- Only during playing process, not on board

---

### Action
**Type:** Permission keyword
**Effect:** Can be played/activated during Showdowns on any player's turn
**Rule ref:** 718
**Stacks:** No

**How it Works:**
- Grants permission to play during Showdown Open State
- Does NOT restrict normal timing (still works during your turn)
- Units with Action still have normal play restrictions

---

### Assault
**Type:** Passive Ability (Units)
**Effect:** +X Might while attacking
**Format:** "Assault [X]" (default X = 1)
**Rule ref:** 719
**Stacks:** Yes (add values)

**How it Works:**
- Active only while Unit has Attacker designation
- Applied at start of Showdown Step
- Multiple instances add together

**Example:** Assault + Assault 3 = +4 Might while attacking

---

### Deathknell
**Type:** Triggered Ability (Permanents)
**Effect:** "When I die, [Effect]"
**Format:** "Deathknell — [Effect]"
**Rule ref:** 720
**Stacks:** Separate triggers

**How it Works:**
- Triggers when Permanent is Killed and sent to Trash
- Does NOT trigger if death is replaced (e.g., recalled instead)
- Multiple Deathknell abilities trigger separately

---

### Deflect
**Type:** Passive Ability (Permanents)
**Effect:** Opponents pay +X Power to target this
**Format:** "Deflect [X]" (default X = 1)
**Rule ref:** 721
**Stacks:** Yes (add values)

**How it Works:**
- Mandatory additional cost for opponent's targeting spells/abilities
- Power can be any domain
- Multiple instances add together

---

### Ganking
**Type:** Passive Ability (Units)
**Effect:** Can move from Battlefield to Battlefield
**Rule ref:** 722
**Stacks:** No

**How it Works:**
- Adds new destination option to Standard Move
- Does NOT restrict other movement options
- No additional cost

**Normal Move:** Base ↔ Battlefield
**With Ganking:** Base ↔ Battlefield ↔ Battlefield

---

### Hidden
**Type:** Permission keyword (Spells, Units, Gear)
**Effect:** Hide facedown at Battlefield, play for free later with Reaction
**Rule ref:** 723
**Stacks:** No

**How it Works:**
1. Pay 1[C] (matching Domain Identity) to hide facedown
2. Starting next player's turn, gains Reaction
3. Can play ignoring base cost
4. Targets must be at that Battlefield

**Key Points:**
- Hiding is NOT playing (no Chain)
- Playing from Hidden IS playing (creates Chain)
- Can still play normally for full cost

---

### Legion
**Type:** Conditional keyword
**Effect:** Bonus if you've played another Main Deck card this turn
**Format:** "Legion - [Text]"
**Rule ref:** 724
**Stacks:** N/A (condition-based)

**How it Works:**
- Check: Have you played another Main Deck card this turn?
- If yes, apply the Legion text
- All Legion abilities satisfied by one prior card

**Example:**
> "Legion - Deal 2 additional damage"
> If you played any card before this spell, deal the extra damage.

---

### Reaction
**Type:** Permission keyword
**Effect:** Can be played/activated during Closed States on any player's turn
**Rule ref:** 725
**Stacks:** No

**How it Works:**
- Grants ALL Action permissions PLUS Closed State permission
- Can respond to spells/abilities on the Chain
- Does NOT restrict normal timing

**Timing Hierarchy:**
- Normal cards: Your turn, Neutral Open only
- Action: + Showdowns
- Reaction: + Closed States (any time)

---

### Shield
**Type:** Passive Ability (Units)
**Effect:** +X Might while defending
**Format:** "Shield [X]" (default X = 1)
**Rule ref:** 726
**Stacks:** Yes (add values)

**How it Works:**
- Active only while Unit has Defender designation
- Applied at start of Showdown Step
- Multiple instances add together

**Example:** Shield + Shield 3 = +4 Might while defending

---

### Tank
**Type:** Passive Ability (Units)
**Effect:** Must be assigned lethal damage first in Combat
**Rule ref:** 727
**Stacks:** No

**How it Works:**
- During damage assignment, Tank units must receive lethal damage first
- If multiple Tanks, can choose order among them
- Non-Tank units can't receive damage until all Tanks have lethal

**Example:**
> Attacker has 7 damage to assign
> Defender has: 3-Might Tank, 2-Might Tank, 4-Might unit
> Must assign 3 to first Tank, then 2 to second Tank, then 2 to other unit

---

### Temporary
**Type:** Triggered Ability (Permanents)
**Effect:** Killed at start of controller's Beginning Phase
**Rule ref:** 728
**Stacks:** No

**How it Works:**
- Triggers at controller's Beginning Phase, before Scoring
- Automatic - cannot be prevented by controller
- Common on tokens (e.g., Sprite tokens)

---

### Vision
**Type:** Triggered Ability (Permanents)
**Effect:** When played, look at top card of deck, may recycle it
**Rule ref:** 729
**Stacks:** Separate triggers

**How it Works:**
- Triggers when permanent enters Board
- Look at top card of Main Deck
- Choose: Keep on top OR recycle to bottom
- Multiple Vision = multiple looks (same card if not recycled)

---

## Keywords by Function

### Combat Keywords
| Keyword | Effect |
|---------|--------|
| Assault | +X Might attacking |
| Shield | +X Might defending |
| Tank | Must be damaged first |

### Timing Keywords
| Keyword | When You Can Play |
|---------|-------------------|
| Action | + Showdowns |
| Reaction | + Showdowns + Closed States |
| Hidden | Play from facedown with Reaction |

### Cost Keywords
| Keyword | Effect |
|---------|--------|
| Accelerate | Pay extra to enter ready |
| Deflect | Opponents pay extra to target |

### Movement Keywords
| Keyword | Effect |
|---------|--------|
| Ganking | Move Battlefield → Battlefield |

### Conditional Keywords
| Keyword | Effect |
|---------|--------|
| Legion | Bonus if played another card |

### Death/Entry Keywords
| Keyword | Effect |
|---------|--------|
| Deathknell | Effect when killed |
| Temporary | Killed at Beginning Phase |
| Vision | Look at deck when played |

---

## Stacking Summary

### Keywords That Stack (Add Values)
- Assault
- Shield
- Deflect

### Keywords That Trigger Separately
- Deathknell
- Vision

### Keywords That Don't Stack
- All others (multiple instances are redundant)

---

## Common Questions

**Q: Can I use Accelerate after playing the unit?**
A: No, only during the playing process

**Q: Does Assault work when defending?**
A: No, only while attacking

**Q: Can Reaction cards be played on my turn?**
A: Yes, Reaction grants additional timing, doesn't restrict

**Q: What if I have two Tanks?**
A: Choose which Tank receives damage first, then the other

**Q: Does Hidden ignore all costs?**
A: Only base cost - additional costs still apply

**Q: Do multiple Assault keywords stack?**
A: Yes, add the values together

---

## Related Sections

- **Section 11: Keywords** - Full keyword rules
- **Section 7: Abilities** - Ability types
- **Section 9: Combat** - Combat keywords in action

---

*For detailed rules, read the full section in the Core Rules document*
