# Effect Helpers

Effect helpers define **what happens** when an ability resolves. They create effect objects that modify the game state.

## Source Files
- `packages/lorcana-engine/src/effects/effects.ts`

---

## Draw Effects

### `drawACard`
**When to use:** "Draw a card"

```typescript
drawACard  // Constant - no function call needed
```

---

### `drawXCards(amount)`
**When to use:** "Draw X cards"

```typescript
drawXCards(2)  // Draw 2 cards
drawXCards(3)  // Draw 3 cards
```

---

### `opponentDrawXCards(amount)`
**When to use:** "Opponent draws X cards"

```typescript
opponentDrawXCards(1)  // Opponent draws a card
```

---

### `drawCardsUntilYouHaveXCardsInHand(amount)`
**When to use:** "Draw cards until you have X cards in hand"

```typescript
drawCardsUntilYouHaveXCardsInHand(5)  // Draw cards until you have 5 in hand
```

---

## Damage Effects

### `dealDamageEffect(amount, target)`
**When to use:** "Deal X damage to [target]"

```typescript
dealDamageEffect(2, chosenCharacter)
dealDamageEffect(3, chosenOpposingCharacter)
```

---

### `dealDamageToChosenCharacter(amount)`
**When to use:** "Deal X damage to chosen character"

```typescript
dealDamageToChosenCharacter(2)
dealDamageToChosenCharacter(4)
```

---

### `dealDamageToChosenOpposingCharacter(amount)`
**When to use:** "Deal X damage to chosen opposing character"

```typescript
dealDamageToChosenOpposingCharacter(2)
```

---

### `putDamageEffect(amount, target, upTo?)`
**When to use:** "Put X damage on [target]" (different from dealing damage for card interactions)

```typescript
putDamageEffect(2, chosenCharacter)
putDamageEffect(3, chosenOpposingCharacter, true)  // "up to 3 damage"
```

---

## Heal/Remove Damage Effects

### `healEffect(amount, target, subEffect?, upTo?)`
**When to use:** "Remove X damage from [target]"

```typescript
healEffect(2, chosenCharacter)
healEffect(3, chosenDamagedCharacter, undefined, true)  // "up to 3 damage"
```

---

### `removeDamageEffect(amount, target, upTo?)`
**When to use:** Alias for `healEffect` - "Remove X damage from [target]"

```typescript
removeDamageEffect(2, chosenCharacter)
```

---

## Banish Effects

### `banishChosenCharacter`
**When to use:** "Banish chosen character"

```typescript
banishChosenCharacter  // Constant
```

---

### `banishChosenOpposingCharacter`
**When to use:** "Banish chosen opposing character"

```typescript
banishChosenOpposingCharacter  // Constant
```

---

### `banishChosenCharacterOfYours`
**When to use:** "Banish chosen character of yours"

```typescript
banishChosenCharacterOfYours  // Constant
```

---

### `banishChosenItem`
**When to use:** "Banish chosen item"

```typescript
banishChosenItem  // Constant
```

---

### `banishChosenItemOrLocation`
**When to use:** "Banish chosen item or location"

```typescript
banishChosenItemOrLocation  // Constant
```

---

### `banishThisCharacter`
**When to use:** "Banish this character"

```typescript
banishThisCharacter  // Constant
```

---

### `mayBanish(target)`
**When to use:** Create custom banish effect with any target

```typescript
mayBanish(chosenCharacter)
mayBanish(chosenLocation)
```

---

## Discard Effects

### `discardACard`
**When to use:** "Discard a card"

```typescript
discardACard  // Constant - you discard from your hand
```

---

### `discardTwoCards`
**When to use:** "Discard 2 cards"

```typescript
discardTwoCards  // Constant
```

---

### `discardYourHand`
**When to use:** "Discard your hand" or "Discard all cards in your hand"

```typescript
discardYourHand  // Constant
```

---

### `opponentDiscardsACard(filters?, random?)`
**When to use:** "Opponent discards a card"

```typescript
opponentDiscardsACard()  // Opponent chooses
opponentDiscardsACard([], true)  // Random discard
```

---

### `opponentDiscardsARandomCard`
**When to use:** "Opponent discards a random card"

```typescript
opponentDiscardsARandomCard  // Constant
```

---

## Move/Return to Hand Effects

### `returnToHand({filters, excludeSelf?})`
**When to use:** "Return [card] to hand"

```typescript
returnToHand({ filters: [{ filter: "type", value: "character" }] })
```

---

### `returnCardToHand(target)`
**When to use:** Create custom return effect

```typescript
returnCardToHand(chosenCharacter)
returnCardToHand(chosenItem)
```

---

### `returnThisCardToHand`
**When to use:** "Return this card to hand"

```typescript
returnThisCardToHand  // Constant
```

---

### `returnCharacterFromDiscardToHand`
**When to use:** "Return a character card from discard to hand"

```typescript
returnCharacterFromDiscardToHand  // Constant
```

---

### `returnChosenCharacterToHand()`
**When to use:** "Return chosen character to hand"

```typescript
returnChosenCharacterToHand()
```

---

### `returnChosenCharacterWithCostLess(cost)`
**When to use:** "Return chosen character with cost X or less to hand"

```typescript
returnChosenCharacterWithCostLess(3)  // Cost 3 or less
```

---

## Exert/Ready Effects

### `exertChosenCharacter`
**When to use:** "Exert chosen character"

```typescript
exertChosenCharacter  // Constant
```

---

### `exertChosenOpposingCharacter`
**When to use:** "Exert chosen opposing character"

```typescript
exertChosenOpposingCharacter  // Constant
```

---

### `exertChosenItem`
**When to use:** "Exert chosen item"

```typescript
exertChosenItem  // Constant
```

---

### `exertAllOpposingCharacters`
**When to use:** "Exert all opposing characters"

```typescript
exertAllOpposingCharacters  // Constant
```

---

### `readyChosenCharacter`
**When to use:** "Ready chosen character"

```typescript
readyChosenCharacter  // Constant
```

---

### `readyAnotherChosenCharacter`
**When to use:** "Ready another chosen character"

```typescript
readyAnotherChosenCharacter  // Constant
```

---

### `readyChosenItem`
**When to use:** "Ready chosen item"

```typescript
readyChosenItem  // Constant
```

---

### `readyThisCharacter`
**When to use:** "Ready this character"

```typescript
readyThisCharacter  // Constant
```

---

### `readyYourOtherCharacters`
**When to use:** "Ready your other characters"

```typescript
readyYourOtherCharacters  // Constant
```

---

## Lore Effects

### `youGainLore(amount)`
**When to use:** "You gain X lore"

```typescript
youGainLore(1)
youGainLore(2)
```

---

### `opponentLoseLore(amount)`
**When to use:** "Opponent loses X lore"

```typescript
opponentLoseLore(1)
opponentLoseLore(2)
```

---

## Attribute Modification Effects

### `chosenCharacterGetsStrength(amount, duration?)`
**When to use:** "Chosen character gets +X ⬡"

```typescript
chosenCharacterGetsStrength(2)  // This turn (default)
chosenCharacterGetsStrength(3, "next_turn")  // Until next turn
chosenCharacterGetsStrength(-2)  // Loses 2 strength
```

---

### `thisCharacterGetsStrength(amount)`
**When to use:** "This character gets +X ⬡"

```typescript
thisCharacterGetsStrength(2)
thisCharacterGetsStrength(4)
```

---

### `thisCharacterGetsLore(amount)`
**When to use:** "This character gets +X ◊"

```typescript
thisCharacterGetsLore(1)
thisCharacterGetsLore(2)
```

---

### `chosenCharacterGetLoreThisTurn(amount)`
**When to use:** "Chosen character gets +X ◊ this turn"

```typescript
chosenCharacterGetLoreThisTurn(2)
```

---

### `yourOtherCharactersGainStrengthThisTurn(amount)`
**When to use:** "Your other characters get +X ⬡ this turn"

```typescript
yourOtherCharactersGainStrengthThisTurn(1)
```

---

### `opponentCharactersLoseStrengthThisTurn(amount)`
**When to use:** "Opposing characters get -X ⬡ this turn"

```typescript
opponentCharactersLoseStrengthThisTurn(2)
```

---

## Gain Ability Effects

### `chosenCharacterGainsRush`
**When to use:** "Chosen character gains Rush"

```typescript
chosenCharacterGainsRush  // Constant
```

---

### `chosenCharacterGainsEvasive`
**When to use:** "Chosen character gains Evasive"

```typescript
chosenCharacterGainsEvasive  // Constant
```

---

### `chosenCharacterGainsBodyguard`
**When to use:** "Chosen character gains Bodyguard"

```typescript
chosenCharacterGainsBodyguard  // Constant
```

---

### `chosenCharacterGainsWard`
**When to use:** "Chosen character gains Ward"

```typescript
chosenCharacterGainsWard  // Constant
```

---

### `chosenCharacterGainsChallenger(amount)`
**When to use:** "Chosen character gains Challenger +X"

```typescript
chosenCharacterGainsChallenger(2)
chosenCharacterGainsChallenger(3)
```

---

### `chosenCharacterGainsSupport(duration?)`
**When to use:** "Chosen character gains Support"

```typescript
chosenCharacterGainsSupport("turn")  // This turn
chosenCharacterGainsSupport("static")  // Permanent
```

---

### `chosenCharacterGainsResist(amount, duration?)`
**When to use:** "Chosen character gains Resist +X"

```typescript
chosenCharacterGainsResist(1)
chosenCharacterGainsResist(2, "next_turn")
```

---

### `choseCharacterGainsReckless`
**When to use:** "Chosen character gains Reckless"

```typescript
choseCharacterGainsReckless  // Constant
```

---

## Restriction Effects

### `chosenOpposingCharacterCantQuestNextTurn`
**When to use:** "Chosen opposing character can't quest next turn"

```typescript
chosenOpposingCharacterCantQuestNextTurn  // Constant
```

---

### `chosenOpposingCharacterCantReadyNextTurn`
**When to use:** "Chosen opposing character can't ready at the start of their next turn"

```typescript
chosenOpposingCharacterCantReadyNextTurn  // Constant
```

---

### `chosenCharacterCantChallengeDuringNextTurn`
**When to use:** "Chosen character can't challenge during your next turn"

```typescript
chosenCharacterCantChallengeDuringNextTurn  // Constant
```

---

## Cost Reduction Effects

### `youPayXLessToPlayNextCharThisTurn(amount, filters?)`
**When to use:** "You pay X ⬡ less to play your next character this turn"

```typescript
youPayXLessToPlayNextCharThisTurn(2)
youPayXLessToPlayNextCharThisTurn(3, [{ filter: "characteristics", value: ["hero"] }])
```

---

### `youPayXLessToPlayNextItemThisTurn(amount)`
**When to use:** "You pay X ⬡ less to play your next item this turn"

```typescript
youPayXLessToPlayNextItemThisTurn(2)
```

---

### `youPayXLessToPlayNextActionThisTurn(amount)`
**When to use:** "You pay X ⬡ less to play your next action this turn"

```typescript
youPayXLessToPlayNextActionThisTurn(2)
```

---

## Scry/Deck Manipulation Effects

### `lookAtTopCardOfYourDeckAndPutItOnTopOrBottom`
**When to use:** "Look at the top card of your deck. Put it on the top or bottom of your deck"

```typescript
lookAtTopCardOfYourDeckAndPutItOnTopOrBottom  // Constant
```

---

### `revealTopOfDeckPutInHandOrDeck({tutorFilters, mode, onTargetMatchEffects?, target?})`
**When to use:** "Reveal the top card of your deck. If it's [type], put it into your hand. Otherwise put it on top/bottom."

```typescript
revealTopOfDeckPutInHandOrDeck({
  tutorFilters: [{ filter: "type", value: "character" }],
  mode: "top"
})
```

---

## Move to Inkwell Effects

### `putThisCardIntoYourInkwellExerted`
**When to use:** "Put this card into your inkwell exerted"

```typescript
putThisCardIntoYourInkwellExerted  // Constant
```

---

### `putTopCardOfYourDeckIntoYourInkwellExerted`
**When to use:** "Put the top card of your deck into your inkwell exerted"

```typescript
putTopCardOfYourDeckIntoYourInkwellExerted  // Constant
```

---

## Shuffle Effects

### `shuffleThisCardIntoYourDeck`
**When to use:** "Shuffle this card into your deck"

```typescript
shuffleThisCardIntoYourDeck  // Actually an array: [MoveCardEffect, ShuffleDeckEffect]
```

---

## Mill Effects

### `millOwnXCards(amount)`
**When to use:** "Put the top X cards of your deck into your discard"

```typescript
millOwnXCards(2)  // Mill 2 cards from your deck
```

---

### `millOpponentXCards(amount)`
**When to use:** "Put the top X cards of opponent's deck into their discard"

```typescript
millOpponentXCards(3)  // Mill 3 cards from opponent's deck
```

---

## Move Damage Effects

### `moveDamageEffect({amount, from, to, upTo?, conditions?})`
**When to use:** "Move X damage from [source] to [target]"

```typescript
moveDamageEffect({
  amount: 2,
  from: chosenDamagedCharacter,
  to: chosenOpposingCharacter
})
```

---

## Combined Effects

### `exertAndCantReady(target)`
**When to use:** "Exert [target]. They can't ready at the start of their next turn."

```typescript
exertAndCantReady(chosenOpposingCharacter)
```

**Returns:** `[ExertEffect, CardRestrictionEffect]`

---

### `readyAndCantQuest(target, nonAccumulative?)`
**When to use:** "Ready [target]. They can't quest this turn."

```typescript
readyAndCantQuest(chosenCharacter)
```

**Returns:** `[CardRestrictionEffect, ExertEffect]`

---

### `readyAndCantQuestOrChallenge(target)`
**When to use:** "Ready [target]. They can't quest or challenge this turn."

```typescript
readyAndCantQuestOrChallenge(chosenCharacter)
```

**Returns:** `[ExertEffect, CardRestrictionEffect, CardRestrictionEffect]`

---

## Usage Tips

1. **Constants vs Functions:** Some effects are constants (e.g., `drawACard`), others are functions (e.g., `drawXCards(2)`)

2. **Effect Arrays:** Most abilities take an array of effects: `effects: [drawACard, dealDamageToChosenCharacter(2)]`

3. **Target Included:** Some effects have targets built-in (e.g., `dealDamageToChosenCharacter`), others need a target parameter

4. **Duration:** Attribute and ability effects often have a `duration` parameter:
   - `"turn"` - Until end of this turn
   - `"next_turn"` - Until end of next turn
   - `"static"` - Permanent (while ability is active)
   - `"challenge"` - During this challenge only

5. **"Up To":** For optional amounts, set `upTo: true`

---

## Related Files
- [targets.md](targets.md) - What to target with effects
- [triggers.md](triggers.md) - When effects execute
- [conditions.md](conditions.md) - Conditions for effects

