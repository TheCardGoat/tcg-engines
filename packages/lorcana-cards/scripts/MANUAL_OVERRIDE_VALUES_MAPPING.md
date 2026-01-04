# Manual Override Values Mapping

This document shows the correct numeric values extracted from `lorcast-input.json` that should replace `{d}` placeholders in `manual-overrides.ts`.

## Summary
- **Total entries**: 95
- **Found with values**: 11
- **Found (no {d} placeholders)**: 8
- **Not found**: 76

## Entries with Numeric Values

### 1. Prince John's Mirror
**Text**: `YOU LOOK REGAL If you have a character named Prince John in play, you pay {d} {I} less to play this item. A FEELING OF POWER At the end of each opponent's turn, if they have more than {d} cards in their hand, they discard until they have {d} cards in their hand.`

**Values**: `[1, 3, 3]`

**Replacements needed**:
- Line 73: `amount: 0, // {d} placeholder` → `amount: 1,`
- Line 100: `value: 0, // {d} placeholder` → `value: 3,`
- Line 91: `amount: 0, // Until hand size` → `amount: 3,` (discard until hand size is 3)

---

### 2. Recovered Page
**Text**: `WHAT IS TO COME When you play this item, look at the top {d} cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order. WHISPERED POWER {d} {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.`

**Values**: `[4, 1]`

**Replacements needed**:
- Line 193: `amount: 0, // {d}` → `amount: 4,`
- Line 208: `ink: 0, banishSelf: true }, // {d}` → `ink: 1, banishSelf: true },`

---

### 3. Illuminary Tunnels
**Text**: `SUBTERRANEAN NETWORK While you have a character here, this location gets +{d} {L} for each other location you have in play. LOCUS While you have a character here, you pay {d} {I} less to play locations.`

**Values**: `[1, 1]`

**Replacements needed**:
- Line 233: `modifier: { type: "locations-in-play", controller: "you" },` - This is a dynamic modifier, but the base value should be 1
- Line 244: `amount: 0, cardType: "location" }, // {d}` → `amount: 1, cardType: "location" },`

---

### 4. Shenzi
**Text**: `STICK AROUND FOR DINNER This character gets +{d} {S} for each other Hyena character you have in play. WHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain {d} lore.`

**Values**: `[1, 2]`

**Replacements needed**:
- Line 261: The modifier is dynamic, but check if there's a base value
- Line 281: `amount: 0 }, // {d}` → `amount: 2 },`

---

### 5. Demona
**Text**: `AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than {d} cards in their hand draws until they have {d}. STONE BY DAY If you have {d} or more cards in your hand, this character can't ready.`

**Values**: `[3, 3, 3]`

**Replacements needed**:
- Line 302: `{ type: "draw-until-hand-size", size: 0 }, // {d}` → `{ type: "draw-until-hand-size", size: 3 },`
- Line 322: `value: 0, // {d}` → `value: 3,`

---

### 6. Goliath (DUSK TO DAWN)
**Text**: `DUSK TO DAWN At the end of each player's turn, if they have more than {d} cards in their hand, they choose and discard cards until they have {d}. If they have fewer than {d} cards in their hand, they draw until they have {d}.`

**Values**: `[2, 2, 2, 2]`

**Replacements needed**:
- Line 512: `value: 0,` → `value: 2,` (greater-than condition)
- Line 514: `size: 0, chosen: true }, // {d}` → `size: 2, chosen: true },`
- Line 523: `value: 0,` → `value: 2,` (less-than condition)
- Line 525: `size: 0 }, // {d}` → `size: 2 },`

---

### 7. The Queen
**Text**: `GATHERER OF THE WICKED When you play this character, look at the top {d} cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.`

**Values**: `[3]`

**Replacements needed**:
- Line 542: `amount: 0, // {d}` → `amount: 3,`

---

### 8. The Black Cauldron
**Text**: `THE CAULDRON CALLS {E}, {d} {I} — Put a character card from your discard under this item faceup. RISE AND JOIN ME! {E}, {d} {I} — This turn, you may play characters from under this item.`

**Values**: `[1, 1]`

**Replacements needed**:
- Line 643: `ink: 0 }, // {d}` → `ink: 1 },`
- Line 657: `ink: 0 }, // {d}` → `ink: 1 },`

---

### 9. Pacha
**Text**: `HELPFUL SUPPLIES At the start of your turn, if you have an item in play, gain {d} lore. PERFECT DIRECTIONS At the start of your turn, if you have a location in play, gain {d} lore.`

**Values**: `[1, 1]`

**Replacements needed**:
- Line 746: `amount: 0 }, // {d}` → `amount: 1 },`
- Line 761: `amount: 0 }, // {d}` → `amount: 1 },`

---

### 10. Goliath (BE CAREFUL, ALL OF YOU)
**Text**: `BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain {d} lore. STONE BY DAY If you have {d} or more cards in your hand, this character can't ready.`

**Values**: `[1, 3]`

**Replacements needed**:
- Line 785: `amount: 0 }, // {d}` → `amount: 1 },`
- Line 803: `value: 0,` → `value: 3,`

---

### 11. Donald Duck
**Text**: `HUMBLE PIE When you play this character, if you used Shift to play him, each opponent loses {d} lore. RAGING DUCK While an opponent has {d} or more lore, this character gets +{d} {S}.`

**Values**: `[2, 10, 6]`

**Replacements needed**:
- Line 818: `amount: 0, target: "EACH_OPPONENT" }, // {d}` → `amount: 2, target: "EACH_OPPONENT" },`
- Line 830: `modifier: 0,` → `modifier: 6,` (strength modifier)
- Line 837: `right: { type: "constant", value: 0 },` → `right: { type: "constant", value: 10 },` (lore comparison)

---

## Next Steps

1. Review each entry above
2. Update the corresponding lines in `manual-overrides.ts`
3. Verify the replacements match the actual card texts
4. Run tests to ensure the changes are correct

