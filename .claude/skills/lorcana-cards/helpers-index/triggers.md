# Trigger Helpers

Trigger helpers define **when** an ability activates. They create `TriggeredAbility` objects.

## Source Files
- `packages/lorcana-engine/src/abilities/whenAbilities.ts`
- `packages/lorcana-engine/src/abilities/wheneverAbilities.ts`
- `packages/lorcana-engine/src/abilities/atTheAbilities.ts`

---

## "When" Triggers (One-Time)

### `whenYouPlayThisCharacter()`
**When to use:** "When you play this character..."

```typescript
whenYouPlayThisCharacter({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean,
  costs?: Cost[],
  conditions?: Condition[]
})
```

**Example card texts:**
- "When you play this character, draw a card."
- "When you play this character, you may deal 2 damage to chosen character."

---

### `whenThisCharacterQuests()`
**When to use:** "When this character quests..."

```typescript
whenThisCharacterQuests({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean
})
```

**Example card texts:**
- "When this character quests, draw a card."
- "When this character quests, you may ready another chosen character."

---

### `whenYouShiftThisOntoACharacter()` / `whenPlayOnThisCard()`
**When to use:** "When you shift this on/onto a character..." or shift-related triggers

```typescript
whenPlayOnThisCard({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean,
  shifterTargetFilters: TargetFilter[],
  shiftedTargetFilters: TargetFilter[]
})
```

**Example card texts:**
- "When you play this on a character, draw 2 cards."
- "When this character is shifted onto another character, banish chosen opposing character."

---

### `whenXIsBanished()`
**When to use:** "When [target] is banished..."

```typescript
whenXIsBanished({
  name: string,
  text: string,
  effects: Effect[],
  triggerFilter: TargetFilter[],
  optional?: boolean,
  conditions?: Condition[]
})
```

**Example card texts:**
- "When this character is banished, draw a card."
- "When an item you own is banished, you may draw a card."

---

### `whenYouMoveACharacterHere()`
**When to use:** (For Locations) "When you move a character here..."

```typescript
whenYouMoveACharacterHere({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean,
  conditions?: Condition[],
  target?: CardEffectTarget,
  movingFrom?: "hand" | "play" | "deck" | etc.
})
```

**Example card texts:**
- "When you move a character here, that character gets +2 ⬡ this turn."
- "When you move a Princess character here, draw a card."

---

## "Whenever" Triggers (Repeating)

### `wheneverYouPlayACharacter()`
**When to use:** "Whenever you play a character..."

```typescript
wheneverYouPlayACharacter({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean,
  conditions?: Condition[],
  excludeSelf?: boolean,
  hasShifted?: boolean
})
```

**Example card texts:**
- "Whenever you play a character, you may remove up to 2 damage from chosen character."
- "Whenever you play a Floodborn character, draw a card."

---

### `wheneverAnotherYouPlayAnotherCharacter()`
**When to use:** "Whenever you play **another** character..." (excludes self automatically)

---

### `wheneverYouPlayAnItem()`
**When to use:** "Whenever you play an item..."

```typescript
wheneverYouPlayAnItem({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean
})
```

---

### `wheneverYouPlayAnAction()`
**When to use:** "Whenever you play an action..."

```typescript
wheneverYouPlayAnAction({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean
})
```

---

### `wheneverYouPlayASong()`
**When to use:** "Whenever you play a song..."

```typescript
wheneverYouPlayASong({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean
})
```

---

### `wheneverThisQuests()`
**When to use:** "Whenever this character quests..."

```typescript
wheneverThisQuests({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean,
  conditions?: Condition[]
})
```

**Example card texts:**
- "Whenever this character quests, you may draw a card."

---

### `wheneverCharacterChallenges()` / `wheneverCharacterChallengesAndBanishes()`
**When to use:** "Whenever this character challenges..." or "...banishes a character in a challenge..."

```typescript
wheneverCharacterChallenges({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean
})
```

---

### `wheneverOneOfYourCharactersIsBanishedInAChallenge()`
**When to use:** "Whenever one of your characters is banished in a challenge..."

```typescript
wheneverOneOfYourCharactersIsBanishedInAChallenge({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean,
  triggerFilter?: TargetFilter[],
  conditions?: Condition[]
})
```

---

### `wheneverACardIsPutIntoYourInkwell()`
**When to use:** "Whenever a card is put into your inkwell..."

```typescript
wheneverACardIsPutIntoYourInkwell({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean,
  oncePerTurn?: boolean
})
```

---

### `wheneverYouReadyThisCharacter()`
**When to use:** "Whenever you ready this character..."

```typescript
wheneverYouReadyThisCharacter({
  name: string,
  text: string,
  effects: Effect[],
  conditions?: Condition[],
  optional?: boolean,
  oncePerTurn?: boolean
})
```

---

### `wheneverIsExerted()`
**When to use:** "Whenever [target] is exerted..."

```typescript
wheneverIsExerted({
  name: string,
  text: string,
  effects: Effect[],
  target: CardEffectTarget,
  optional?: boolean
})
```

---

### `wheneverIsReturnedToHand()`
**When to use:** "Whenever [target] is returned to hand..."

```typescript
wheneverIsReturnedToHand({
  name: string,
  text: string,
  effects: Effect[],
  target: CardEffectTarget,
  optional?: boolean,
  from?: Zones
})
```

---

## "At" Triggers (Phase-Based)

### `atTheStartOfYourTurn()`
**When to use:** "At the start of your turn..."

```typescript
atTheStartOfYourTurn({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean,
  conditions?: Condition[],
  oncePerTurn?: boolean,
  doesItTriggerFromDiscard?: boolean
})
```

**Example card texts:**
- "At the start of your turn, draw a card."
- "At the start of your turn, if you have no cards in hand, draw 2 cards."

---

### `atTheEndOfYourTurn()`
**When to use:** "At the end of your turn..."

```typescript
atTheEndOfYourTurn({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean,
  conditions?: Condition[]
})
```

---

### `atTheEndOfOpponentTurn()`
**When to use:** "At the end of opponent's turn..."

```typescript
atTheEndOfOpponentTurn({
  name: string,
  text: string,
  effects: Effect[],
  optional?: boolean,
  conditions?: Condition[]
})
```

---

## Common Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Ability name (displayed to players) |
| `text` | `string` | Ability text (exact card text) |
| `effects` | `Effect[]` | Array of effects to execute |
| `optional` | `boolean` | True for "you may" abilities |
| `conditions` | `Condition[]` | Array of conditions that must be met |
| `costs` | `Cost[]` | Costs to pay when triggered |
| `oncePerTurn` | `boolean` | True for "once per turn" abilities |
| `excludeSelf` | `boolean` | Exclude the source card from trigger |

---

## Usage Tips

1. **"When" vs "Whenever":**
   - **When** = Triggers once (usually on play or quest)
   - **Whenever** = Can trigger multiple times per turn

2. **Optional abilities:** Set `optional: true` for "you may" text

3. **Once per turn:** Set `oncePerTurn: true` for abilities with that restriction

4. **Conditions:** Use conditions for "if" clauses (e.g., "if you have 3 or more characters in play")

5. **Costs:** Use costs for abilities that require payment before triggering

---

## Related Files
- [effects.md](effects.md) - What happens when triggered
- [conditions.md](conditions.md) - When triggers are valid
- [targets.md](targets.md) - What the effects target

