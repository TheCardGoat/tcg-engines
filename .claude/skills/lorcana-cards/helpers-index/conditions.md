# Condition Helpers

Condition helpers define **requirements** that must be met for abilities to trigger, resolve, or remain active. They create `Condition` objects.

## Source Files
- `packages/lorcana-engine/src/abilities/conditions/conditions.ts`

---

## Character Name Conditions

### `ifYouHaveCharacterNamed(name)`
**When to use:** "If you have a character named [NAME] in play"

```typescript
ifYouHaveCharacterNamed("Elsa")
ifYouHaveCharacterNamed("Mickey Mouse")
```

---

### `whileYouHaveCharacterNamed(name)`
**When to use:** Alias for `ifYouHaveCharacterNamed`

```typescript
whileYouHaveCharacterNamed("Dale")
```

---

### `notHaveCharacterNamed(name)`
**When to use:** "If you don't have a character named [NAME] in play"

```typescript
notHaveCharacterNamed("Captain")
```

---

## Character Count Conditions

### `haveXorMoreCharactersInPlay(numCharactersMin)`
**When to use:** "If you have X or more characters in play"

```typescript
haveXorMoreCharactersInPlay(3)  // 3 or more characters
haveXorMoreCharactersInPlay(5)  // 5 or more characters
```

---

## Characteristic Conditions

### `ifYouHaveAnotherPirate`
**When to use:** "If you have another Pirate character in play"

```typescript
ifYouHaveAnotherPirate  // Constant
```

---

### `ifYouHaveAnInventor`
**When to use:** "If you have an Inventor character in play"

```typescript
ifYouHaveAnInventor  // Constant
```

---

### `haveCaptainInPlay`
**When to use:** "If you have a Captain character in play"

```typescript
haveCaptainInPlay  // Constant
```

---

### `dontHaveCaptainInPlay`
**When to use:** "If you don't have a Captain character in play"

```typescript
dontHaveCaptainInPlay  // Constant
```

---

### `have3orMorePuppiesInPlay`
**When to use:** "If you have 3 or more Puppy characters in play"

```typescript
have3orMorePuppiesInPlay  // Constant
```

---

### `haveElsaInPlay`
**When to use:** "If you have a character named Elsa in play"

```typescript
haveElsaInPlay  // Constant
```

---

## Ability Conditions

### `whileYouHaveCharacterWithAbility(ability)`
**When to use:** "While you have a character with [ABILITY] in play"

```typescript
whileYouHaveCharacterWithAbility("support")  // Character with Support
whileYouHaveCharacterWithAbility("bodyguard")  // Character with Bodyguard
```

---

## Item/Card Conditions

### `haveItemInPlay`
**When to use:** "If you have an item in play"

```typescript
haveItemInPlay  // Constant
```

---

### `haveItemInDiscard`
**When to use:** "If you have an item card in your discard"

```typescript
haveItemInDiscard  // Constant
```

---

### `haveMoreItemsThanOpponent`
**When to use:** "While you have more items in play than each opponent"

```typescript
haveMoreItemsThanOpponent  // Constant
```

---

### `ifYouHaveACardInYourDiscardNamed(name)`
**When to use:** "If you have a card named [NAME] in your discard"

```typescript
ifYouHaveACardInYourDiscardNamed("Be Prepared")
```

---

## Turn-Based Conditions

### `duringYourTurn`
**When to use:** "During your turn"

```typescript
duringYourTurn  // Constant
```

---

### `duringOpponentsTurn`
**When to use:** "During opponent's turn"

```typescript
duringOpponentsTurn  // Constant
```

---

### `youDidntPutAnyCardsIntoYourInkwellThisTurn`
**When to use:** "If you didn't put any cards into your inkwell this turn"

```typescript
youDidntPutAnyCardsIntoYourInkwellThisTurn  // Constant
```

---

### `opponentHasDrawnXCardsThisTurn(count)`
**When to use:** "If opponent has drawn X cards this turn"

```typescript
opponentHasDrawnXCardsThisTurn(2)  // Opponent drew 2 cards
```

---

## Character State Conditions

### `ifThisCharacterIsExerted`
**When to use:** "If this character is exerted" or "While this character is exerted"

```typescript
ifThisCharacterIsExerted  // Constant
```

---

### `whileThisCharacterIsExerted`
**When to use:** Alias for `ifThisCharacterIsExerted`

```typescript
whileThisCharacterIsExerted  // Constant
```

---

### `ifThisCharacterIsAtALocation`
**When to use:** "If this character is at a location"

```typescript
ifThisCharacterIsAtALocation  // Constant
```

---

### `whileCharacterIsAtLocation`
**When to use:** Alias for `ifThisCharacterIsAtALocation`

```typescript
whileCharacterIsAtLocation  // Constant
```

---

### `unlessItIsAtALocation`
**When to use:** "Unless it is at a location" (negated condition)

```typescript
unlessItIsAtALocation  // Constant
```

---

### `whileThere AreXOrMoreDamagedCharacter(numCharacters)`
**When to use:** "While there are X or more damaged characters in play"

```typescript
whileThereAreXOrMoreDamagedCharacter(2)  // 2 or more damaged characters
whileThereAreXOrMoreDamagedCharacter(3)  // 3 or more damaged characters
```

---

### `whileADamagedCharacterIsInPlay`
**When to use:** "While a damaged character is in play"

```typescript
whileADamagedCharacterIsInPlay  // Constant
```

---

### `whileAnotherDamagedCharacterIsInPlay`
**When to use:** "While another damaged character is in play" (excludes self)

```typescript
whileAnotherDamagedCharacterIsInPlay  // Constant
```

---

### `youHaveDamagedCharacter`
**When to use:** "If you have a damaged character in play"

```typescript
youHaveDamagedCharacter  // Constant
```

---

### `whileYouHaveTwoOrMoreCharactersExerted`
**When to use:** "While you have 2 or more exerted characters"

```typescript
whileYouHaveTwoOrMoreCharactersExerted  // Constant
```

---

## Hand/Card Count Conditions

### `haveNoCardsInYourHand`
**When to use:** "If you have no cards in your hand"

```typescript
haveNoCardsInYourHand  // Constant
```

---

### `haveCardsInYourHand`
**When to use:** "If you have cards in your hand" (opposite of above)

```typescript
haveCardsInYourHand  // Constant
```

---

### `haveMoreCardsThanOpponent`
**When to use:** "While you have more cards in hand than each opponent"

```typescript
haveMoreCardsThanOpponent  // Constant
```

---

## Location Conditions

### `ifYouHaveACharacterHere`
**When to use:** (For Locations) "While you have a character here"

```typescript
ifYouHaveACharacterHere  // Constant
```

---

## Song Conditions

### `xOrMoreCharsSangThisSongCondition(numChars)`
**When to use:** "If X or more characters sang this song"

```typescript
xOrMoreCharsSangThisSongCondition(2)  // 2 or more singers
xOrMoreCharsSangThisSongCondition(3)  // 3 or more singers
```

---

## Building Custom Conditions

### Filter Condition Pattern
```typescript
const myCondition: Condition = {
  type: "filter",
  comparison: {
    operator: "gte",  // "gte" | "lte" | "eq" | "gt" | "lt"
    value: 1
  },
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
    { filter: "characteristics", value: ["hero"] }
  ]
};
```

---

## Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `"gte"` | Greater than or equal (≥) | 3 or more characters |
| `"lte"` | Less than or equal (≤) | 2 or fewer characters |
| `"eq"` | Equal (=) | Exactly 1 character |
| `"gt"` | Greater than (>) | More than 2 characters |
| `"lt"` | Less than (<) | Less than 4 characters |

---

## Condition Types

### `"filter"` - Count cards matching filters
```typescript
{
  type: "filter",
  comparison: { operator: "gte", value: 2 },
  filters: [...]
}
```

### `"hand"` - Check hand count
```typescript
{
  type: "hand",
  player: "self",  // or "opponent"
  amount: 0  // or "gt" for comparison
}
```

### `"during-turn"` - Check whose turn
```typescript
{
  type: "during-turn",
  value: "self"  // or "opponent"
}
```

### `"exerted"` - Check if source is exerted
```typescript
{
  type: "exerted"
}
```

### `"char-is-at-location"` - Check if at a location
```typescript
{
  type: "char-is-at-location"
}
```

### `"damage"` - Check damage on source
```typescript
{
  type: "damage",
  comparison: { operator: "eq", value: 0 }  // No damage
}
```

### `"this-turn"` - Check if action happened this turn
```typescript
{
  type: "this-turn",
  value: "inked",  // or other action
  target: "self",
  negate: true  // Didn't happen
}
```

---

## Usage Tips

1. **Conditions vs Triggers:**
   - **Triggers** = WHEN ability happens
   - **Conditions** = IF ability can happen

2. **Multiple Conditions:**
   ```typescript
   conditions: [
     duringYourTurn,
     haveXorMoreCharactersInPlay(3)
   ]
   ```
   All conditions must be true (AND logic)

3. **Negation:**
   Use `negate: true` to invert a condition

4. **Common Patterns:**
   - **Character count:** Use `haveXorMoreCharactersInPlay`
   - **Named character:** Use `ifYouHaveCharacterNamed`
   - **Turn timing:** Use `duringYourTurn` / `duringOpponentsTurn`
   - **Character state:** Use `whileThisCharacterIsExerted` / `whileCharacterIsAtLocation`

5. **Where to Use Conditions:**
   - In triggered abilities: Checked when trigger occurs
   - In while abilities: Checked continuously
   - In resolution layers: Checked before resolving effects

---

## Related Files
- [triggers.md](triggers.md) - Triggers that use conditions
- [while-abilities.md](while-abilities.md) - While abilities that use conditions
- [effects.md](effects.md) - Effects that resolve when conditions are met

