# Target Helpers

Target helpers define **what** is affected by an effect. They create `CardEffectTarget` or `PlayerEffectTarget` objects.

## Source Files
- `packages/lorcana-engine/src/abilities/targets.ts`

---

## Player Targets

### `self`
**When to use:** Effect targets "you" (the player who owns the source card)

```typescript
self  // Constant
```

**Example effects:**
- Draw a card
- Gain lore
- Look at cards

---

### `opponent`
**When to use:** Effect targets "opponent"

```typescript
opponent  // Constant
```

**Example effects:**
- Opponent draws/discards
- Opponent loses lore
- Opponent reveals hand

---

### `chosenPlayer`
**When to use:** "Chosen player" (either you or opponent)

```typescript
chosenPlayer  // Constant
```

---

## Character Targets

### `chosenCharacter`
**When to use:** "Chosen character" (any character in play, yours or opponent's)

```typescript
chosenCharacter  // Constant
```

**Common in:**
- "Deal X damage to chosen character"
- "Chosen character gets +X ⬡"
- "Ready chosen character"

---

### `chosenCharacterOfYours`
**When to use:** "Chosen character of yours"

```typescript
chosenCharacterOfYours  // Constant
```

**Common in:**
- "Chosen character of yours gets +X ⬡"
- "Ready chosen character of yours"

---

### `chosenOpposingCharacter`
**When to use:** "Chosen opposing character"

```typescript
chosenOpposingCharacter  // Constant
```

**Common in:**
- "Deal X damage to chosen opposing character"
- "Chosen opposing character can't quest next turn"
- "Banish chosen opposing character"

---

### `anotherChosenCharacter`
**When to use:** "Another chosen character" (excludes self automatically)

```typescript
anotherChosenCharacter  // Constant
```

---

### `anotherChosenCharacterOfYours`
**When to use:** "Another chosen character of yours"

```typescript
anotherChosenCharacterOfYours  // Constant
```

---

### `thisCharacter`
**When to use:** "This character" (the source card itself)

```typescript
thisCharacter  // Constant
```

**Common in:**
- "This character gets +X ⬡"
- "Ready this character"
- "Banish this character"

---

### `thisCard`
**When to use:** "This card" (the source card, any type)

```typescript
thisCard  // Constant
```

---

### `allYourCharacters`
**When to use:** "Your characters" or "Each of your characters"

```typescript
allYourCharacters  // Constant
```

**Common in:**
- "Your characters get +X ⬡"
- "Ready all your characters"

---

### `yourOtherCharacters`
**When to use:** "Your other characters" (excludes self)

```typescript
yourOtherCharacters  // Constant
```

---

### `opposingCharacters`
**When to use:** "Opposing characters" or "All opposing characters"

```typescript
opposingCharacters  // Constant
```

**Common in:**
- "Deal X damage to opposing characters"
- "Exert all opposing characters"

---

### `allCharacters`
**When to use:** "All characters" (yours and opponent's)

```typescript
allCharacters  // Constant
```

---

### `allOpposingCharacters`
**When to use:** Alias for `opposingCharacters`

```typescript
allOpposingCharacters  // Constant
```

---

### `eachOpposingCharacter`
**When to use:** Alias for `allOpposingCharacters`

```typescript
eachOpposingCharacter  // Constant
```

---

### `challengingCharacter`
**When to use:** "The challenging character" (in challenge context)

```typescript
challengingCharacter  // Constant
```

---

### `targetTriggerCard`
**When to use:** The card that triggered the ability

```typescript
targetTriggerCard  // Constant
```

---

## Filtered Character Targets

### `chosenDamagedCharacter`
**When to use:** "Chosen damaged character"

```typescript
chosenDamagedCharacter  // Constant
```

---

### `chosenDamagedCharacterOfYours`
**When to use:** "Chosen damaged character of yours"

```typescript
chosenDamagedCharacterOfYours  // Constant
```

---

### `chosenReadyCharacter`
**When to use:** "Chosen ready character"

```typescript
chosenReadyCharacter  // Constant
```

---

### `chosenExertedCharacter`
**When to use:** "Chosen exerted character"

```typescript
chosenExertedCharacter  // Constant
```

---

### `chosenCharacterNamed(name)`
**When to use:** "Chosen character named [NAME]"

```typescript
chosenCharacterNamed("Elsa")
chosenCharacterNamed("Mickey Mouse")
```

---

### `yourCharactersNamed(name)`
**When to use:** "Your characters named [NAME]" (all of them)

```typescript
yourCharactersNamed("Broom")
```

---

### `chosenCharacterWithCostXorLess(cost)`
**When to use:** "Chosen character with cost X or less"

```typescript
chosenCharacterWithCostXorLess(3)  // Cost 3 or less
chosenCharacterWithCostXorLess(5)  // Cost 5 or less
```

---

### `chosenCharacterWithStrengthXorLess(str)`
**When to use:** "Chosen character with strength X or less"

```typescript
chosenCharacterWithStrengthXorLess(2)  // Strength 2 or less
chosenCharacterWithStrengthXorLess(4)  // Strength 4 or less
```

---

### `chosenCharacterCharacteristic(characteristics)`
**When to use:** "Chosen [CHARACTERISTIC] character"

```typescript
chosenCharacterCharacteristic(["hero"])  // Hero character
chosenCharacterCharacteristic(["villain"])  // Villain character
chosenCharacterCharacteristic(["pirate"])  // Pirate character
```

---

### `chosenHeroCharacter`
**When to use:** "Chosen Hero character"

```typescript
chosenHeroCharacter  // Constant
```

---

### `chosenPirateCharacter`
**When to use:** "Chosen Pirate character"

```typescript
chosenPirateCharacter  // Constant
```

---

### `chosenAlienCharacter`
**When to use:** "Chosen Alien character"

```typescript
chosenAlienCharacter  // Constant
```

---

### `allYourCharacteristicCharacters(characteristics, excludeSelf?)`
**When to use:** "Your [CHARACTERISTIC] characters"

```typescript
allYourCharacteristicCharacters(["hero"])  // All your Hero characters
allYourCharacteristicCharacters(["pirate"], true)  // All your other Pirate characters
```

---

### `allYourCharactersWithAnSpecificAbility(ability, excludeSelf?)`
**When to use:** "Your characters with [ABILITY]"

```typescript
allYourCharactersWithAnSpecificAbility("support")  // Characters with Support
allYourCharactersWithAnSpecificAbility("evasive", true)  // Other characters with Evasive
```

---

## Item Targets

### `chosenItem`
**When to use:** "Chosen item"

```typescript
chosenItem  // Constant
```

**Common in:**
- "Banish chosen item"
- "Exert chosen item"
- "Ready chosen item"

---

### `chosenItemOfYours`
**When to use:** "Chosen item of yours"

```typescript
chosenItemOfYours  // Constant
```

---

### `yourItems`
**When to use:** "Your items" (all of them)

```typescript
yourItems  // Constant
```

---

### `allOpposingItems`
**When to use:** "Opposing items" (all of them)

```typescript
allOpposingItems  // Constant
```

---

## Location Targets

### `chosenLocation`
**When to use:** "Chosen location"

```typescript
chosenLocation  // Constant
```

**Common in:**
- "Banish chosen location"
- "Move to chosen location"

---

### `chosenLocationOfYours`
**When to use:** "Chosen location of yours"

```typescript
chosenLocationOfYours  // Constant
```

---

### `yourLocations`
**When to use:** "Your locations" (all of them)

```typescript
yourLocations  // Constant
```

---

### `allOpposingLocations`
**When to use:** "Opposing locations" (all of them)

```typescript
allOpposingLocations  // Constant
```

---

## Multi-Type Targets

### `chosenItemOrLocation`
**When to use:** "Chosen item or location"

```typescript
chosenItemOrLocation  // Constant
```

---

### `chosenLocationOrItem`
**When to use:** Alias for `chosenItemOrLocation`

```typescript
chosenLocationOrItem  // Constant
```

---

### `chosenCharacterOrLocation`
**When to use:** "Chosen character or location"

```typescript
chosenCharacterOrLocation  // Constant
```

---

## Hand/Deck Targets

### `chosenCardFromYourHand`
**When to use:** "Chosen card from your hand"

```typescript
chosenCardFromYourHand  // Constant
```

---

### `allCardsFromYourHand`
**When to use:** "All cards from your hand"

```typescript
allCardsFromYourHand  // Constant
```

---

### `topCardOfYourDeck`
**When to use:** "The top card of your deck"

```typescript
topCardOfYourDeck  // Constant
```

---

### `topCardOfOpponentDeck`
**When to use:** "The top card of opponent's deck"

```typescript
topCardOfOpponentDeck  // Constant
```

---

### `topXCardsOfYourDeck(value)`
**When to use:** "The top X cards of your deck"

```typescript
topXCardsOfYourDeck(3)  // Top 3 cards
topXCardsOfYourDeck(5)  // Top 5 cards
```

---

### `topXCardsOfOpponentsDeck(value)`
**When to use:** "The top X cards of opponent's deck"

```typescript
topXCardsOfOpponentsDeck(3)  // Top 3 cards
```

---

## Special Targets

### `whileHereTarget`
**When to use:** (For Locations) "Characters here" (excludes self)

```typescript
whileHereTarget  // Constant
```

---

### `chosenCharacterOfYoursAtLocation`
**When to use:** "Chosen character of yours at a location"

```typescript
chosenCharacterOfYoursAtLocation  // Constant
```

---

### `anyNumberOfChosenCharacters`
**When to use:** "Any number of chosen characters" (up to all in play)

```typescript
anyNumberOfChosenCharacters  // Constant
```

---

### `anyNumberOfYourCharacters`
**When to use:** "Any number of your characters"

```typescript
anyNumberOfYourCharacters  // Constant
```

---

## Filter Builder Functions

### `withCostXorLess(cost)`
**When to use:** Create a cost filter

```typescript
withCostXorLess(3)  // Returns TargetFilter
```

---

### `withStrengthXorLess(str)`
**When to use:** Create a strength filter (less than or equal)

```typescript
withStrengthXorLess(4)  // Returns TargetFilter
```

---

### `withStrengthXorMore(str)`
**When to use:** Create a strength filter (greater than or equal)

```typescript
withStrengthXorMore(5)  // Returns TargetFilter
```

---

## Usage Tips

1. **Ownership:**
   - No "of yours" = Any player
   - "of yours" = Your cards only
   - "opposing" = Opponent's cards only

2. **Self Exclusion:**
   - "another" = Excludes source card
   - "other" = Excludes source card
   - No modifier = Includes source card

3. **Quantity:**
   - "chosen" = Player selects one
   - "all" / "each" = All matching targets
   - "any number" = Player chooses how many

4. **State Filters:**
   - `chosenDamagedCharacter` = Has damage
   - `chosenReadyCharacter` = Ready status
   - `chosenExertedCharacter` = Exerted status

5. **Building Custom Targets:**
   ```typescript
   const myTarget: CardEffectTarget = {
     type: "card",
     value: 1,  // or "all"
     filters: [
       { filter: "type", value: "character" },
       { filter: "zone", value: "play" },
       { filter: "owner", value: "self" }
     ]
   };
   ```

6. **Common Filter Combinations:**
   - Type + Zone + Owner (most common)
   - Add Characteristic for specific types
   - Add Attribute comparisons for cost/strength
   - Add Status for ready/exerted/damaged

---

## Related Files
- [effects.md](effects.md) - Effects that use these targets
- [triggers.md](triggers.md) - Triggers that provide targets
- [conditions.md](conditions.md) - Conditions that filter targets

