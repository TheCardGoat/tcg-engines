# Turn Actions

**Topic:** Turn phases, discretionary actions, limited actions, priority, focus, states
**When to Use:** Questions about what you can do during your turn

## Overview
This index covers turn structure, what actions you can take, and when you can take them.

---

## Turn Phases Summary

```
START OF TURN
├── Awaken Phase ─────── Ready all your Game Objects
├── Beginning Phase
│   ├── Beginning Step ─ "Start of turn" effects
│   └── Scoring Step ─── Hold scoring (Battlefields you control)
├── Channel Phase ────── Channel 2 runes
└── Draw Phase ───────── Draw 1 card, Rune Pool empties

ACTION PHASE ─────────── Take Discretionary Actions
                         (Combat/Showdowns when triggered)

END OF TURN
├── Ending Step ──────── "End of turn" effects
├── Expiration Step ──── Clear damage, expire "this turn" effects
└── Cleanup Step ─────── Perform Cleanup, Rune Pool empties
```

---

## Game States

The turn is always in one of four states:

| State | Showdown? | Chain? | What Can Be Played |
|-------|-----------|--------|-------------------|
| **Neutral Open** | No | No | Any card (on your turn) |
| **Neutral Closed** | No | Yes | Reaction only |
| **Showdown Open** | Yes | No | Action or Reaction |
| **Showdown Closed** | Yes | Yes | Reaction only |

### Default State
- **Neutral Open** during your Action Phase
- This is when you can play cards and use abilities normally

---

## Action Types

### Discretionary Actions
**Rule refs:** 589.1

Actions you can choose to take during your turn in Neutral Open State.

| Action | Description |
|--------|-------------|
| **Play** | Play cards from hand (paying costs) |
| **Standard Move** | Exhaust Unit(s) to move them |
| **Hide** | Place Hidden card facedown at Battlefield |
| **Activate Abilities** | Use activated abilities on your Game Objects |

**Requirements:**
- Must be your turn
- Must be in Neutral Open State
- Must meet conditions and pay costs
- Cannot create illegal game states

### Limited Actions
**Rule refs:** 589.2

Actions you can only take when instructed.

| Action | When Instructed |
|--------|-----------------|
| Draw | Draw Phase, card effects |
| Exhaust | Costs, card effects |
| Ready | Awaken Phase, card effects |
| Recycle | Card effects, costs |
| Discard | Card effects, costs |
| Channel | Channel Phase, card effects |
| Move | Card effects (Standard Move is Discretionary) |
| Stun | Card effects |
| Reveal | Card effects |
| Counter | Card effects |
| Buff | Card effects |
| Banish | Card effects |
| Kill | Card effects, damage |
| Add | Card effects, rune abilities |

---

## Priority and Focus

### Priority
**Rule refs:** 512

Permission to take Discretionary Actions.

**When you have Priority:**
- Neutral Open State during your Action Phase
- Showdown State when you have Focus
- Closed State when you control next Chain item
- Closed State when previous player passes to you

### Focus
**Rule refs:** 513

Permission to act during Showdown Open State.

**Key Rules:**
- Gaining Focus grants Priority
- Passing Priority keeps Focus
- No Focus during Neutral State

---

## What You Can Do Each Phase

### Awaken Phase
- Ready all Game Objects you control (automatic)

### Beginning Phase
- "Start of turn" effects trigger
- Score Battlefields you control (Hold)

### Channel Phase
- Channel 2 runes from Rune Deck
- Perform instructed actions from Game Objects

### Draw Phase
- Draw 1 card
- If deck empty: Burn Out first, then draw
- Rune Pool empties at end

### Action Phase
**This is your main phase for taking actions:**
- Play cards (Units, Gear, Spells)
- Use Standard Move (exhaust Units to move)
- Activate abilities on your Game Objects
- Hide cards with Hidden keyword
- Combat and Showdowns occur here when triggered

### End of Turn
- "End of turn" effects trigger
- All damage clears from Units
- "This turn" effects expire
- Rune Pool empties

---

## Playing Cards

### When You Can Play
- Your turn
- Neutral Open State (default)
- Action Phase

### Exceptions
| Keyword | Additional Timing |
|---------|-------------------|
| **Action** | During Showdowns (any player's turn) |
| **Reaction** | During Closed States AND Showdowns (any player's turn) |

### Where Units Can Be Played
- Your Base
- A Battlefield you control

### Where Gear Can Be Played
- Your Base only

---

## Standard Move

**Rule refs:** 140

### How It Works
1. Choose one or more Units you control
2. Exhaust them (cost)
3. Move them to a valid destination

### Valid Destinations
| From | To | Requires |
|------|-----|----------|
| Base | Battlefield | - |
| Battlefield | Base | - |
| Battlefield | Battlefield | Ganking keyword |

### Restrictions
- Cannot move to Battlefield with 2 other players' Units
- Cannot perform during Closed State
- Cannot perform during Showdown

### Multiple Units
- Can move multiple Units simultaneously
- All must go to same destination
- Origins can be different

---

## Activated Abilities

**Rule refs:** 576-581

### When You Can Activate
- Your turn
- Open State
- Not during Showdown (unless Action/Reaction)

### Format
`[Cost] : [Effect]`

**Example:** `[2]: Draw 1` = Pay 2 Energy to draw 1 card

### Common Costs
- Energy/Power
- Exhaust (⬇ symbol)
- Discard cards
- Kill/Banish

---

## Common Questions

**Q: Can I play cards on my opponent's turn?**
A: Only with Reaction keyword (any Closed State) or Action keyword (during Showdowns)

**Q: When can I use activated abilities?**
A: Your turn, Open State, not during Showdown (unless Action/Reaction)

**Q: Can I move Units during a Showdown?**
A: No, Standard Move cannot be performed during Showdowns (140.1.c)

**Q: How many actions can I take per turn?**
A: Unlimited Discretionary Actions, as long as you can pay costs and meet conditions

**Q: When does my Rune Pool empty?**
A: End of Draw Phase and end of Expiration Step

**Q: Can I play a Unit to a Battlefield I don't control?**
A: No, Units can only be played to your Base or Battlefields you control

---

## Related Sections

- **Section 5: Turn Structure** - Detailed phase rules
- **Section 6: Chains & Showdowns** - Playing cards process
- **Section 8: Game Actions** - All action definitions

---

*For detailed rules, read the full section in the Core Rules document*
