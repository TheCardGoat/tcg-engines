# Card Zones

**Topic:** Where cards exist during the game and how they move between zones
**When to Use:** Questions about where cards are, how they move, what zones exist, and zone rules

## Overview
This index covers all the zones (areas) where cards exist during gameplay and the rules for how cards move between zones.

---

## The Seven Zones

### Quick Reference
1. **Deck** - Private, ordered - your library of cards
2. **Hand** - Private - cards you've drawn
3. **Play** - Public - cards actively in the game
4. **Inkwell** - Public (count), Private (identity) - your ink resource
5. **Discard** - Public - graveyard for used/banished cards
6. **Bag** - Conceptual - where triggered abilities wait
7. **Exile** - Not a standard zone, but some effects temporarily remove cards

---

## Zone Types

### Public Zones
**Summary:** All players can see cards in these zones
**Key terms:** public, visible, all players
**Rule ref:** 8.1
**Details in:** Section 8: Zones (8.1)

**Public Zones:**
- Play
- Discard
- The Bag (conceptual)
- Inkwell (number of cards is public, but cards are facedown)

---

### Private Zones
**Summary:** Only the owner can see cards in these zones
**Key terms:** private, hidden, owner only
**Rule ref:** 8.1
**Details in:** Section 8: Zones (8.1)

**Private Zones:**
- Deck
- Hand

---

## Individual Zone Rules

### Deck
**Summary:** Your library of cards you draw from
**Key terms:** deck, draw, library, shuffle, top, bottom, private
**Rule refs:** 8.2.1-8.2.x
**Details in:** Section 8: Zones (8.2)

**Rules:**
- Private zone - can't look at cards unless an effect allows
- Ordered - has a top and bottom
- Drawing takes cards from the top
- Some effects add cards to top or bottom
- Shuffling randomizes the order

**Key Actions:**
- **Draw** - Take top card and put it in your hand
- **Shuffle** - Randomize the deck order
- **Search** - Look through deck for a specific card (effect required)
- **Mill** - Put cards from top of deck to discard (effect required)

**Important:**
- Drawing from empty deck = you lose the game (3.2.1.2)
- Having an empty deck doesn't make you lose - only attempting to draw

---

### Hand
**Summary:** Cards you've drawn but haven't played yet
**Key terms:** hand, private, draw, discard, play from hand
**Rule refs:** 8.3.1-8.3.x
**Details in:** Section 8: Zones (8.3)

**Rules:**
- Private zone - opponents can't see your hand
- No maximum hand size
- Start with 7 cards
- Draw 1 each turn (except starting player's turn 1)
- Cards are normally played from hand

**Key Actions:**
- **Draw** - Add cards from deck to hand
- **Discard** - Put cards from hand to discard
- **Play** - Play cards from hand (pay cost)
- **Put into Hand** - Effects that add cards to hand (not the same as drawing)

**Important Distinction:**
- "Draw a card" = take from deck specifically
- "Put into hand" = add to hand from any zone

---

### Play
**Summary:** Where cards are when they're active in the game
**Key terms:** play, in play, public, enter play, leave play
**Rule refs:** 8.4.1-8.4.x
**Details in:** Section 8: Zones (8.4)

**Rules:**
- Public zone - all players see all cards
- Characters, items, and locations go here when played
- Actions don't enter play - they resolve and go to discard
- Cards are face-up and visible

**Card States in Play:**
- Ready or Exerted
- Damaged or Undamaged
- At a location or not
- In a stack or not (Shift)

**Entering Play:**
- Characters, items, locations enter when played
- Cards enter play ready
- "When played" abilities trigger

**Leaving Play:**
- Banished → discard
- Returned to hand
- Returned to deck
- Put into discard by an effect
- All damage and effects on the card are removed
- If in a stack, all cards in stack leave together

**Memory Rules:**
- Cards have no "memory" of previous states
- If a card leaves and returns, it's a new instance
- Damage, counters, effects all gone

---

### Inkwell
**Summary:** Your ink resource pool for paying costs
**Key terms:** inkwell, ink, facedown, ready, exert, once per turn
**Rule refs:** 8.5.1-8.5.x
**Details in:** Section 8: Zones (8.5)

**Rules:**
- Semi-public: Number of ink cards is public, but cards are facedown
- Can add one card per turn (during Main Phase)
- Only cards with inkwell symbol (⬡) can be added
- Each ink card counts as 1 ink
- Ink cards ready during your Ready step
- Exert ink cards to pay costs

**Key Actions:**
- **Add to Inkwell** - Put card facedown (once per turn, 4.3.3)
- **Exert Ink** - Turn ink card sideways to pay costs
- **Ready Ink** - Happens automatically in Ready step

**Important:**
- Ink cards stay in inkwell permanently (not discarded when used)
- Each card = 1 ink regardless of its printed cost
- Can't remove cards from inkwell (normally)

---

### Discard
**Summary:** Graveyard for used, banished, and discarded cards
**Key terms:** discard, graveyard, banished, public
**Rule refs:** 8.6.1-8.6.x
**Details in:** Section 8: Zones (8.6)

**Rules:**
- Public zone - all players can see all cards
- Each player has their own discard pile
- Cards are face-up

**How Cards Get Here:**
- Actions after resolving
- Banished characters/items/locations
- Discarded from hand
- Discarded from deck
- Effects that put cards in discard

**Key Actions:**
- **Retrieve** - Some effects return cards from discard to hand or play
- **Examine** - Can look through discard at any time

**Important:**
- All information is public
- No specific order required (though players often keep them ordered)

---

### The Bag
**Summary:** Conceptual zone where triggered abilities wait to resolve
**Key terms:** the bag, triggered abilities, priority, active player
**Rule refs:** 8.7.1-8.7.x, 1.7
**Details in:** Section 8: Zones (8.7), Section 1: Concepts (1.7)

**See "Abilities and Effects" topic index for complete bag rules**

**Quick Summary:**
- Not a physical zone - conceptual
- Only triggered abilities use the bag
- Active player chooses which ability to resolve next
- Each ability resolves completely before the next
- Game state check after each ability
- Once bag is empty, game continues

**What Goes in the Bag:**
- Triggered abilities only
- Not activated abilities
- Not static abilities
- Not action card effects (resolve immediately)

---

## Card Movement Flowchart

### Common Movements:

**Deck → Hand**
- Drawing cards (4.2.3, 8.3)

**Hand → Play**
- Playing characters, items, locations (4.3.4)

**Hand → Discard**
- Playing actions (4.3.4)
- Discarding (effect required)

**Hand → Inkwell**
- Putting card into inkwell (4.3.3)

**Play → Discard**
- Banished (damage, effects)
- Destroyed by effects
- Actions after resolving

**Play → Hand**
- Bounced by effects
- Returned by abilities

**Play → Deck**
- Returned by effects (top or bottom)

**Discard → Hand**
- Retrieved by effects

**Discard → Play**
- Reanimated by effects

**Discard → Deck**
- Shuffled back by effects

---

## Zone Visibility

### What Players Can See:

**Your Deck:**
- Private - you can't look unless an effect allows
- Count is public

**Your Hand:**
- Private - only you can see
- Count is public

**Play:**
- Public - everyone sees everything

**Your Inkwell:**
- Count is public
- Cards are facedown (identity is private)

**Discard Piles:**
- Public - everyone can see all cards
- Can examine at any time

---

## Important Zone Concepts

### "In Play" vs Other Zones
**Summary:** Most abilities only work while in play
**Key terms:** in play, not in play, zone matters
**Rule ref:** 8.4

**Default Rule:** Abilities only work while the card is in play
**Exception:** Must be specifically stated (e.g., "While in your discard...")

**Examples:**
- "This character gets +1 Strength" - only works in play
- "While this card is in your discard, your characters get +1 Strength" - works from discard (unusual)

---

### Card Memory
**Summary:** Cards don't remember their previous states
**Key terms:** no memory, new card, leaves play
**Rule ref:** 8.4

**Rules:**
- When a card leaves play, all damage, counters, and effects are removed
- If it returns to play, it's treated as a completely new card
- No "memory" of what happened before

**Example:**
- Character has 3 damage, returned to hand
- If played again, it has 0 damage (fresh start)

---

### Fail to Find
**Summary:** When searching private zones, can choose not to find
**Key terms:** fail to find, search, private zones
**Rule ref:** 8.1

**Rule:** When searching a private zone (deck, hand), you can fail to find even if valid targets exist

**Why:** Prevents revealing information about your private zones

---

## Common Zone Questions

**Q: Can I look at my deck?**
A: No, unless an effect specifically allows it (8.2)

**Q: Is there a maximum hand size?**
A: No (8.3)

**Q: Do actions go into play?**
A: No, they resolve from hand then go to discard (8.4, 6.3)

**Q: Can my opponent see my hand?**
A: No, hand is a private zone (8.3)

**Q: Can I see how much ink my opponent has?**
A: Yes, the number is public (but cards are facedown) (8.5)

**Q: What happens to damage when a card leaves play?**
A: All damage is removed (8.4)

**Q: Can I look through discard piles?**
A: Yes, discards are public zones (8.6)

**Q: If I return a damaged character to hand and play it again, does it keep the damage?**
A: No, it's a new card with no damage (8.4)

**Q: Do ink cards in my inkwell count toward the 4-copy limit?**
A: No, deck building limits only apply to your deck construction

**Q: Can I choose the order of my discard pile?**
A: The rules don't require a specific order, but players often keep them ordered for convenience

---

## Zone-Based Effects

### Effects That Care About Zones:

**"When this enters play"**
- Triggers when card goes from hand (or other zone) to play

**"When this leaves play"**
- Triggers when card goes from play to any other zone
- Floating triggered ability (still resolves after leaving)

**"While in your discard"**
- Rare - abilities that work from discard
- Must be specifically stated

**"From your hand"**
- Effects that specifically interact with hand

**"From your deck"**
- Effects that search or interact with deck

---

## Related Sections

- **Section 8: Zones** - Complete zone rules
- **Section 1.7: The Bag** - The bag conceptual zone
- **Section 3.1: Starting a Game** - Initial zone setup
- **Section 4: Turn Structure** - How cards move during turns
- **Abilities and Effects Index** - The bag and triggered abilities

---

*For detailed rules, see the referenced sections in the comprehensive rules document*
