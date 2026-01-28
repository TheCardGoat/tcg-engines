# Section 8: Game Actions

**Rule References:** 586-619
**Full Document:** `references/21_40_Riftbound_Core_Rules_2025_06_02.md` and `references/41_60_Riftbound_Core_Rules_2025_06_02.md`

## Overview
This section covers all game actions, the difference between discretionary and limited actions, and movement rules.

---

## 586-589: Action Types

### General Rules (587-588)
- Game Actions are actions players may perform
- Unless specified, may only perform actions on your turn

### Discretionary Actions (589.1)
- Can be performed any time during your turn in **Neutral Open State**
- Any number can be taken (if conditions met and costs paid)
- Cannot result in forbidden actions or illegal game states

### Limited Actions (589.2)
- Can only be taken when instructed by spell, ability, or turn progression
- Cannot be performed at-will

---

## 591: Draw

**Type:** Limited Action

### How It Works
- Take single card from top of Main Deck
- Add to Hand

### When You Draw
- Draw Step of Beginning Phase (draw 1)
- When instructed by game effects

### Format
"Draw X" = Draw X cards

### Empty Deck (591.4)
If drawing more than available:
1. Draw as many as possible
2. Perform Burn Out
3. Draw remaining cards needed

---

## 592: Exhaust

**Type:** Limited Action

### How It Works
- Mark non-spell Game Object as "spent"
- Rotate card 90 degrees (lengthwise orientation)
- Already exhausted = cannot exhaust again

### As a Cost
- Must be able to complete the action
- Exhaust symbol (⬇) = "Exhaust this/me"

---

## 593: Ready

**Type:** Limited Action

### How It Works
- Mark non-spell Game Object as available
- Rotate card 90 degrees (vertical orientation)

### When You Ready
- Awaken Phase (ready all you control)
- When instructed by effects

---

## 594: Recycle

**Type:** Limited Action

### How It Works
- Take cards from specific zone
- Put on bottom of corresponding deck:
  - Main Deck cards → Main Deck
  - Runes → Rune Deck

### As a Cost
- Must be able to complete the action

### Multiple Cards (594.5)
- Main Deck: Random order
- Rune Deck: Owner's choice of order

### Format
"Recycle X from [Zone]"

---

## 595: Play

**Type:** Discretionary Action (or Limited when instructed)

### How It Works
- Pay costs associated with card
- See Section 6 for full process

### As Limited Action
- When instructed by game effects
- Follow normal steps except as noted by effect

### Play Triggers (595.4)
- Trigger when card finishes being played
- If card is countered, it wasn't played (no triggers)

---

## 596: Move

**Type:** Limited Action (Standard Move is Discretionary)

### How It Works
- Game Object moves between two Locations on the Board
- Instantaneous (no in-between state)
- Does NOT use the Chain, cannot be Reacted to

### Standard Move (Discretionary)
- Cost: Exhaust the Unit(s)
- Effect: Move the Unit(s)

---

## 597: Hide

**Type:** Discretionary Action

### How It Works
- Place card facedown at Battlefield you control
- Requires Hidden keyword on card
- Facedown card properties defined by effect that placed it

### Revealing Hidden Cards (597.4)
If facedown card would go to Private/Secret zone or game ends:
- Owner reveals it to all players

---

## 598: Discard

**Type:** Limited Action

### How It Works
- Move card from Hand directly to Trash
- Does NOT activate normal rules text
- Player chooses which cards (can use Private Information)

### As a Cost
- Must be able to complete the action

### As an Effect
- Discard as many as possible
- If instructed to discard more than in hand, ignore excess

### Format
"Discard X"

---

## 599: Stun

**Type:** Limited Action

### How It Works
- Select Unit(s) on Board
- Render them Stunned (binary state)
- Already Stunned = cannot Stun again

### Stunned Effects
- Does NOT contribute Might to combat damage
- Still requires full Might in damage to be killed
- Loses Stunned status at beginning of next Ending Step

---

## 600: Reveal

**Type:** Limited Action

### How It Works
- Present card to all players from Private/Secret zone
- Temporary state (not a zone)
- Cards remain in original zone while revealed

### Voluntary Showing
- Players can show Private info voluntarily
- Does NOT count as revealing (no triggers)

### Format
"Reveal X cards from [zone]"

---

## 601: Counter

**Type:** Limited Action

### How It Works
- Negate execution of card being played
- Countered card does nothing, goes to Trash
- Countered card is NOT considered played
- Costs are NOT refunded

### Format
"Counter [card or ability on chain]"

---

## 602: Buff

**Type:** Limited Action

### How It Works
- Place Buff counter on Unit
- If Unit already has Buff, doesn't get another
- Can still choose buffed Unit (but won't be buffed again)

### Format
"Buff [one or more units]"

---

## 603: Banish

**Type:** Limited Action

### How It Works
- Place card from any zone into Banishment
- NOT a subset of Kill or Discard
- Effects can reference cards they banished

### Format
"Banish [one or more permanents or cards]"

---

## 604: Kill

**Type:** Limited Action

### How It Works
- Permanent goes from Board to Trash
- **Active Kill:** Instructed by effect or cost
- **Passive Kill:** Result of lethal damage or other state

### Requirements
- Only "Killed" if origin was on the Board
- NOT a subset of Move

### Format
"Kill [one or more permanents]"

---

## 605: Add

**Type:** Limited Action

### How It Works
- Put resources into Rune Pool
- Spells/abilities that Add resolve immediately (can't be reacted to)
- Add Reactions can be activated during cost payment

### Format
- "Add [2]" = Add 2 Energy
- "Add [Y]" = Add 1 Order Power
- "Add [1][G]" = Add 1 Energy and 1 Calm Power

---

## 606: Channel

**Type:** Limited Action

### How It Works
- Take rune(s) from top of Rune Deck
- Put on Board

### When You Channel
- Channel Phase (channel 2)
- When instructed by effects

### Format
"Channel X rune(s)"

---

## 607: Burn Out

**Type:** Limited Action (Replacement Effect)

### When It Occurs
Attempting while Main Deck is empty:
- Draw cards
- Look at/reveal cards from Main Deck
- Put cards from Main Deck to Trash

### Process
1. Shuffle Trash into Main Deck
2. Choose opponent to gain 1 point
3. Perform original action

### Repeated Burn Out (607.3)
If deck remains empty, can burn out repeatedly until opponent wins.

---

## 608-619: Movement & Recalls

### Movement Rules (608-615)
- Permanent changing position on Board = Move
- Zone changes are NOT Moves
- Instantaneous (no in-between state)
- Cannot be Reacted to
- Invalid Destinations: Battlefields with 2 other players' Units

### Recalls (616-619)
- Permanent changes location WITHOUT being a Move
- Does NOT trigger Move abilities
- Cannot be prevented by Move restrictions
- Gear at Battlefield is Recalled to Base during Cleanup

---

## Action Summary Table

| Action | Type | Key Rule |
|--------|------|----------|
| Draw | Limited | 591 |
| Exhaust | Limited | 592 |
| Ready | Limited | 593 |
| Recycle | Limited | 594 |
| Play | Discretionary/Limited | 595 |
| Move | Limited (Standard is Discretionary) | 596 |
| Hide | Discretionary | 597 |
| Discard | Limited | 598 |
| Stun | Limited | 599 |
| Reveal | Limited | 600 |
| Counter | Limited | 601 |
| Buff | Limited | 602 |
| Banish | Limited | 603 |
| Kill | Limited | 604 |
| Add | Limited | 605 |
| Channel | Limited | 606 |
| Burn Out | Limited | 607 |

---

## Common Questions

**Q: Can I discard cards whenever I want?**
A: No, Discard is a Limited Action - only when instructed (598.2)

**Q: What's the difference between Kill and Banish?**
A: Kill sends to Trash from Board. Banish sends to Banishment from any zone. They're separate actions (603.2.a)

**Q: Can I react to a Move?**
A: No, Moves don't use the Chain and can't be Reacted to (609.3.c)

**Q: What happens when I Burn Out?**
A: Shuffle trash into deck, opponent gains 1 point, then complete original action (607.2)

**Q: Can I Stun an already Stunned unit?**
A: You can choose it, but it won't become Stunned again (599.1.a.1)

---

## Related Sections

- **Section 5: Turn Structure** - When actions can be taken
- **Section 6: Chains & Showdowns** - Playing cards process
- **Section 9: Combat** - Combat-specific actions

---

*For detailed rules, read the full section in the Core Rules document*
