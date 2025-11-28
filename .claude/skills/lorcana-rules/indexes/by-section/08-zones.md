# Section 8: Zones

**Rule References:** 8.1 - 8.7
**Full Document:** `references/disney-lorcana-comprehensive-rules/Disney_Lorcana_Comprehensive_Rules_082225_EN_251019_220309.md` (Section 8)

## Overview
This section covers the different zones (areas) where cards exist during gameplay and the rules for each zone.

---

## 8.1. General
**Summary:** Common rules for all zones
**Key terms:** zones, public zones, private zones, fail to find
**Rule refs:** 8.1.1-8.1.x

### Zone Types:

**Public Zones** - All players can see cards
- Play
- Discard
- The Bag (conceptual)

**Private Zones** - Only the owner can see cards
- Deck
- Hand

**Fail to Find** (8.1.x) - When searching a zone, you can fail to find even if valid targets exist

---

## 8.2. Deck
**Summary:** Your library of cards you draw from
**Key terms:** deck, draw, private zone, top, bottom, shuffle
**Rule refs:** 8.2.1-8.2.x

**Rules:**
- Private zone - you can't look at cards in your deck
- Cards are ordered (has a top and bottom)
- Drawing takes cards from the top
- Some effects add cards to top or bottom of deck (8.2.x)
- Must be shuffled at game start (Section 3.1.3)
- Drawing from empty deck = you lose (Section 3.2.1.2)

**Adding Cards to Deck (8.2.x):**
- **To top** - Card becomes the new top card
- **To bottom** - Card goes below all other cards
- Order matters when adding multiple cards

---

## 8.3. Hand
**Summary:** Cards you've drawn but haven't played
**Key terms:** hand, private zone, draw, discard, play cards from hand
**Rule refs:** 8.3.1-8.3.x

**Rules:**
- Private zone - opponents can't see your hand
- No maximum hand size
- Start with 7 cards (Section 3.1.5)
- Draw 1 card each turn (except starting player's first turn)
- Cards are normally played from hand (Section 4.3.4)
- "Draw" only means taking cards from deck to hand
- "Put into hand" is not the same as drawing

---

## 8.4. Play
**Summary:** Where cards go when they're played and active in the game
**Key terms:** play, in play, public zone, enters play, leaves play
**Rule refs:** 8.4.1-8.4.x

**Rules:**
- Public zone - all players can see cards in play
- Characters, items, and locations enter play when played
- Actions don't enter play - they resolve then go to discard
- Cards are face-up and visible to all players

**In Play (8.4.x):**
- A card is "in play" if it's in the play zone
- Most abilities only work while the card is in play
- Characters must be in play to quest, challenge, or use most abilities

**Leaving Play (8.4.x):**
- When a card leaves play, it goes to another zone (usually discard)
- Banished cards go to discard
- Returned cards go to hand
- Damage and effects on the card are removed when it leaves play
- If a card in a stack leaves play, all cards in the stack leave together (Section 5.1.7)

---

## 8.5. Inkwell
**Summary:** Where ink cards are stored to pay for other cards
**Key terms:** inkwell, ink, facedown, ready, exerted, once per turn
**Rule refs:** 8.5.1-8.5.x

**Rules:**
- Public zone - opponents know how many ink cards you have
- Cards are placed facedown (specific card identity is hidden)
- Can add one card per turn during Main Phase (Section 4.3.3)
- Only cards with inkwell symbol (⬡) can be added
- Each ink card counts as 1 ink
- Ink cards ready during your Ready step
- Exert ink cards to pay costs

**Important:**
- The number of ink cards is public information
- The specific cards in your inkwell are private (facedown)
- Ink cards stay in inkwell - they're not discarded when used

---

## 8.6. Discard
**Summary:** Where cards go when played, banished, or discarded
**Key terms:** discard, discard pile, public zone, banished
**Rule refs:** 8.6.1-8.6.x

**Rules:**
- Public zone - all players can see all cards in all discard piles
- Each player has their own discard pile
- Cards go here when:
  - Actions are played and resolve
  - Characters/items/locations are banished
  - Cards are discarded from hand
  - Cards are discarded from deck

**Important:**
- All cards in discard are public information
- Cards in discard are generally not in any specific order
- Some effects can retrieve cards from discard

---

## 8.7. Bag
**Summary:** Conceptual zone where triggered abilities wait to resolve
**Key terms:** the bag, triggered abilities, resolve, active player chooses, priority
**Rule refs:** 8.7.1-8.7.x

**Rules:**
- Not a physical zone - a way to visualize triggered ability resolution
- Triggered abilities go into "the bag" when triggered
- Only triggered abilities use the bag - activated and static abilities don't
- Action card effects don't use the bag (they resolve immediately)

### How the Bag Works:
1. When a triggered ability's condition is met, it goes into the bag
2. The ability waits in the bag until it's time to resolve
3. Active player chooses which ability from the bag to resolve next
4. That ability resolves completely
5. Game state check happens
6. If bag has more abilities, repeat from step 3
7. Once bag is empty, game continues

### Multiple Abilities in Bag:
- Active player's abilities and opponent's abilities can both be in the bag
- Active player always chooses which to resolve next
- Each ability resolves completely before the next one starts

### Priority System:
- Active player has priority - they choose resolution order
- This gives a small advantage to the active player
- Strategic: Active player can choose order to maximize their benefit

**Important:**
- See Section 1.7 for conceptual overview
- This section (8.7) has detailed resolution rules
- Triggered abilities WAIT in the bag - they don't resolve instantly

---

## Zone Movement Summary

```
Deck → Hand (draw)
Hand → Play (play character/item/location)
Hand → Discard (play action, or discard effect)
Hand → Inkwell (put into inkwell action)
Play → Discard (banished, or leaves play)
Play → Hand (returned to hand effects)
Play → Deck (returned to deck effects)
Discard → Hand (retrieve effects)
Discard → Deck (shuffle back effects)
Discard → Play (play from discard effects)
```

---

## Common Questions This Section Answers

**Q: Can I look at cards in my deck?**
A: No, deck is a private zone - you can't look unless an effect says so (8.2)

**Q: Is there a maximum hand size?**
A: No (8.3)

**Q: Do actions go into play?**
A: No, they resolve from hand then go to discard (8.4, 6.3.1.2)

**Q: Can my opponent see my hand?**
A: No, hand is a private zone (8.3)

**Q: Can my opponent see how much ink I have?**
A: Yes, the number of ink cards is public, but the specific cards are facedown (8.5)

**Q: What happens to damage when a character leaves play?**
A: Damage is removed - cards have no "memory" of their previous state (8.4)

**Q: Can I choose the order to resolve triggered abilities?**
A: Yes, if you're the active player - you choose from the bag (8.7)

**Q: Do action effects go into the bag?**
A: No, action effects resolve immediately (8.7, 6.3.1.2)

**Q: What if a card is banished but has a "when banished" ability?**
A: The ability still triggers (floating triggered ability) and goes into the bag (7.4)

---

## Related Sections

- **Section 1.7: The Bag** - Conceptual overview
- **Section 1.9: Game State Check** - When required actions happen
- **Section 3.1: Starting a Game** - Initial zone setup
- **Section 4.2.3: Draw** - Drawing cards from deck
- **Section 4.3.3: Inkwell** - Adding cards to inkwell
- **Section 4.3.4: Play a Card** - Moving cards from hand to play
- **Section 7.4: Triggered Abilities** - Abilities that use the bag

---

*For detailed rules, read the full section in the comprehensive rules document*
