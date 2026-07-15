# Section 7: Zones

**Comprehensive Rules Version 2.0.1** - Rule References 7.1-7.7

## Overview

This section covers all zones where cards exist during gameplay: Deck, Hand, Play, Inkwell, Discard, and the Bag (a non-physical zone for triggered abilities).

---

## 7.1 General

**Rule refs:** 7.1.1-7.1.6

**Key Concepts:**

- All zones are separate from one another
- Zones are either public (known to all) or private (hidden)
- A card can exist in only one zone at a time
- Only cards in Play zone are considered "in play"

### Public vs Private Zones

**Public Zones (7.1.2):**

- Cards are publicly known
- Players can look at or count cards at any time
- Public zones: Play, Discard, Bag

**Private Zones (7.1.3):**

- Cards aren't publicly known
- Players can count cards but can't look at them
- Private zones: Hand, Deck, Inkwell

### Leaving Play (7.1.6)

- When card enters any zone from play
- All gained effects, damage, and characteristics removed
- Card becomes "new card"

---

## 7.2 Deck

**Rule refs:** 7.2.1-7.2.3.1

The deck is the pile of cards you draw from.

### 7.2.1 Definition

- Set of cards you start game with
- Where you draw cards from
- Remain facedown at all times

### 7.2.2 Private Zone Rules

- Cards remain facedown in single pile
- Can't look at or change order during game
- Can count remaining cards at any time

### 7.2.3 Adding Cards "In Any Order"

- If faceup cards added to deck "in any order"
- Order must be known by all players

### 7.2.3.1 Stacks Being Added

- Faceup cards in stacks can be combined and freely ordered
- No states applied until cards added to deck
- Includes facedown cards in stacks

---

## 7.3 Hand

**Rule refs:** 7.3.1-7.3.4

The hand is where drawn cards are held.

### 7.3.1 Definition

- Where drawn cards are held
- Can add cards by effects other than drawing
- Start game with 7 cards (opening hand)

### 7.3.2 Private Zone Rules

- Can look at your own hand
- Can't look at opponent's hand
- Can count number of cards in any hand
- Can rearrange however you like

### 7.3.3 Hand Size

- No maximum hand size
- Minimum: 0 cards

### 7.3.4 Discarding

- Choose indicated number of cards from hand
- Put them into your discard pile

---

## 7.4 Play

**Rule refs:** 7.4.1-7.4.3

The Play zone is where your active cards are.

### 7.4.1 Definition

- Where characters, items, and locations are played
- Actions are here only while resolving
- Can't play cards into opponent's Play zone

### 7.4.2 Public Zone Rules

- Can look at any player's cards in play
- Can count number of cards
- Can rearrange your Play zone if clear to all

### 7.4.2.1 Facedown Cards in Play

- Considered private information
- Can count facedown cards
- Can't look at them unless rule/effect allows

### 7.4.3 Leaving Play

- When 1+ cards would leave play
- First check for triggered abilities from them leaving
- Triggered abilities "see" other cards leaving with source

---

## 7.5 Inkwell

**Rule refs:** 7.5.1-7.5.6

The inkwell is where your ink resources are.

### 7.5.1 Definition

- Where cards used as ink are kept
- Each ink card represents 1 ink
- Nothing on front of ink card affects ink it generates

### 7.5.2 Entering Inkwell

- Cards put into inkwell facedown and ready
- Each card is separate instance

### 7.5.3 No Limit

- No limit to number of cards in inkwell

### 7.5.4 Private Zone Rules

- Can't look at cards in inkwell (even your own)
- Can count number of cards
- Must keep facedown and separate from other zones

### 7.5.5 Additional Ink

- Effects allowing additional ink follow normal inking process

### 7.5.6 Effects Putting Cards into Inkwell

- Cards not revealed
- Not required to have inkwell symbol
- Enter facedown as ink

---

## 7.6 Discard

**Rule refs:** 7.6.1-7.6.3

The discard is where cards that have left play are held.

### 7.6.1 Definition

- Also called "discard pile" or "Discard zone"
- Where banished/discarded cards go

### 7.6.2 Public Zone Rules

- Cards remain faceup at all times
- In single pile
- Can look at and count any player's discard
- Can rearrange your own discard

### 7.6.3 Multiple Cards Entering

- If multiple cards enter discard at same time
- Player puts them in discard in any order

---

## 7.7 Bag

**Rule refs:** 7.7.1-7.7.7

The bag is a non-physical zone where triggered abilities wait to resolve.

### 7.7.1 Definition

- Not a physical space
- Only where triggered abilities wait to resolve
- Organizes how effects resolve

### 7.7.2 What Goes in Bag

- Only triggered abilities
- Activated abilities, resolving actions, playing cards don't go in bag

### 7.7.3 Adding to Bag

**When Condition Met (7.7.3.1):**

- Ability added by player whose card generated it
- Multiple abilities added simultaneously
- If added during resolving effect, waits until effect finishes

### 7.7.4 Resolving from Bag

Continuous process until bag empty:

1. **Check which players have abilities** (7.7.4.1)
2. **Active player resolves one** (7.7.4.2) - If they have abilities, choose one and fully resolve
3. **Repeat if more** (7.7.4.3) - If active player has more, continue
4. **Pass the bag** (7.7.4.4) - When active player done, next player in turn order resolves
5. **Continue until empty** (7.7.4.5) - Repeat through all players until no abilities remain

### 7.7.5 Currently Resolving Player

- Abilities added by current resolving player seen by next bag check
- Can be chosen to resolve next

### 7.7.6 Other Players

- Abilities added by other players wait
- Resolve when that player's turn comes

### 7.7.7 Player Leaves Game

- All their abilities in bag cease to exist

---

## Quick Reference

| Zone        | Public/Private     | Key Rules                                            |
| ----------- | ------------------ | ---------------------------------------------------- |
| **Deck**    | Private            | Facedown, can't change order, count allowed          |
| **Hand**    | Private            | Look at yours only, no maximum, min 0                |
| **Play**    | Public             | Look at all, facedown cards private                  |
| **Inkwell** | Private            | Facedown, can't look at all, no limit                |
| **Discard** | Public             | Faceup, rearrange yours, multiple cards in any order |
| **Bag**     | N/A (Non-physical) | Triggered abilities only, resolve by player priority |

---

## Zone Movement Summary

**From → To: What Happens**

- **Hand → Play:** Card played, enters play (action resolves immediately)
- **Hand → Inkwell:** Card inked, becomes ink resource
- **Play → Discard:** Card banished, damage/effects removed
- **Deck → Hand:** Draw card
- **Any zone → Play:** Effects that put cards into play

---

## Related Sections

- **Game State Check:** Section 1.8 for when cards leave play
- **Turn Actions:** Section 4 for actions that move cards between zones
- **Abilities:** Section 6 for triggered abilities in bag
- **Drawing:** Section 1.12 for drawing from deck

---

_See full rules in: `references/disney-lorcana-comprehensive-rules/Disney-Lorcana-Comprehensive-Rules.md`_
