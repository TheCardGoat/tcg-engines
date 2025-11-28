# While/Continuous Ability Helpers

While ability helpers define **continuous effects** that are active as long as a condition is met. They create `StaticAbility` objects (specifically `StaticAbilityWithEffect` or `GainAbilityStaticAbility`).

## Source Files
- `packages/lorcana-engine/src/abilities/whileAbilities.ts`

---

## "While...Gets" Abilities (Attribute Modification)

### `whileConditionThisCharacterGets()`
**When to use:** "While [CONDITION], this character gets +X [ATTRIBUTE]"

```typescript
whileConditionThisCharacterGets({
  name: string,
  text: string,
  conditions: Condition[],
  
  // Option 1: Use attribute/amount
  attribute: "strength" | "willpower" | "lore",
  amount: number,
  
  // Option 2: Use custom effects
  effects: Effect[]
})
```

**Example card texts:**
- "While you have another character in play, this character gets +2 ⬡."
- "While you have more cards in hand than each opponent, this character gets +2 ◊."
- "While you have 10 or more cards in your inkwell, this character gets +4 ◊."

---

### `whileYouHaveAnotherCharacterInPlayThisCharacterGets()`
**When to use:** "While you have another character in play, this character gets +X [ATTRIBUTE]"

```typescript
whileYouHaveAnotherCharacterInPlayThisCharacterGets({
  name: string,
  text: string,
  attribute?: "strength" | "willpower" | "lore",  // Default: "strength"
  amount?: number  // Default: 2
})
```

---

### `whileYouHaveMoreItemsInPlayThanEachOpponentThisCharacterGets()`
**When to use:** "While you have more items in play than each opponent, this character gets +X [ATTRIBUTE]"

```typescript
whileYouHaveMoreItemsInPlayThanEachOpponentThisCharacterGets({
  name: string,
  text: string,
  attribute: "strength" | "willpower" | "lore",
  amount: number
})
```

---

### `whileNoOtherCharacterHasQuestedThisCharacterGets()`
**When to use:** "During your turn, if no other character has quested this turn, this character gets +X [ATTRIBUTE]"

```typescript
whileNoOtherCharacterHasQuestedThisCharacterGets({
  name: string,
  text: string,
  attribute?: "strength" | "willpower" | "lore",  // Default: "lore"
  amount?: number  // Default: 3
})
```

---

### `whileYouHaveNOrMoreCharactersWithNameInPlayThisCharacterGets()`
**When to use:** "While you have X or more characters named [NAME] in play, this character gets +X [ATTRIBUTE]"

```typescript
whileYouHaveNOrMoreCharactersWithNameInPlayThisCharacterGets({
  name: string,
  text: string,
  characterName: string,  // e.g., "Broom"
  amount?: number,  // Default: 2 (characters in play)
  attribute?: "strength" | "willpower" | "lore",  // Default: "lore"
  attributeAmount?: number  // Default: 2 (bonus)
})
```

**Example:** "While you have 2 or more Broom characters in play, this character gets +2 ◊."

---

### `whileYouHaveAnotherCharacterWithCharacteristicThisCharacterGets()`
**When to use:** "If you have another [CHARACTERISTIC] character in play, this character gets +X [ATTRIBUTE]"

```typescript
whileYouHaveAnotherCharacterWithCharacteristicThisCharacterGets({
  name: string,
  text: string,
  attribute?: "strength" | "willpower" | "lore",  // Default: "lore"
  amount?: number,  // Default: 1
  characteristics?: Characteristics[],  // Default: ["hero"]
  minAmount?: number  // Default: 2 (total including self)
})
```

**Example:** "If you have another Hero character in play, this character gets +1 ◊."

---

### `whileCharacterIsAtLocationItGets()`
**When to use:** "While this character is at a location, it gets +X [ATTRIBUTE]"

```typescript
whileCharacterIsAtLocationItGets({
  name: string,
  text: string,
  effects: AttributeEffect[]
})
```

---

### `whileThisCharacterHasDamageGets()`
**When to use:** "While this character is damaged, [it] gets +X [ATTRIBUTE]"

```typescript
whileThisCharacterHasDamageGets({
  name: string,
  text: string,
  effects: Effect[]
})
```

---

### `whileThisCharacterHasNoDamageGets()`
**When to use:** "While this character has no damage, [it] gets +X [ATTRIBUTE]"

```typescript
whileThisCharacterHasNoDamageGets({
  name: string,
  text: string,
  effects: Effect[]
})
```

---

## "While...Gains" Abilities (Ability Grant)

### `whileConditionThisCharacterGains()`
**When to use:** "While [CONDITION], this character gains [ABILITY]"

```typescript
whileConditionThisCharacterGains({
  name: string,
  text: string,
  conditions: Condition[],
  ability: StaticAbility | ActivatedAbility | TriggeredAbility | StaticAbilityWithEffect
})
```

**Example card texts:**
- "While you have another character in play, this character gains **Evasive**."
- "During your turn, this character gains **Evasive**."

---

### `whileYouHaveACharacterNamedThisCharGains()`
**When to use:** "While you have a character named [NAME] in play, this character gains [ABILITY]"

```typescript
whileYouHaveACharacterNamedThisCharGains({
  name: string,
  text: string,
  characterName: string,
  ability: StaticAbility | ActivatedAbility | TriggeredAbility,
  conditions?: Condition[]  // Optional additional conditions
})
```

**Examples:**
- "While you have a character named Snow White in play, this character gains **Bodyguard**."
- "While you have a character named Dale in play, this character gains **Support**."
- "While you have a character named Gazelle in play, this character gains Singer 6."
- "While you have a character named Hades in play, this character gains Challenger +2."

---

### `whileYouHaveACharacterNamedThisCharGets()`
**When to use:** "While you have a character named [NAME] in play, this character gets [EFFECTS]" (not just attributes)

```typescript
whileYouHaveACharacterNamedThisCharGets({
  name: string,
  text: string,
  characterName: string,
  effects: Effect[],
  conditions?: Condition[]
})
```

---

### `whileYouHaveAnotherXCharacteristicInPlayThisCharacterGains()`
**When to use:** "While you have another [CHARACTERISTIC] character in play, this character gains [ABILITY]"

```typescript
whileYouHaveAnotherXCharacteristicInPlayThisCharacterGains({
  name: string,
  text: string,
  ability: GainAbilityStaticAbility["gainedAbility"],
  characteristics?: Characteristics[]  // Default: []
})
```

**Example:** "While you have another Pirate character in play, this character gains Challenger +3."

---

### `whileCharacterIsAtLocationItGains()`
**When to use:** "While this character is at a location, [it] gains [ABILITY]"

```typescript
whileCharacterIsAtLocationItGains({
  name: string,
  text: string,
  ability: StaticAbility | ActivatedAbility | TriggeredAbility
})
```

---

### `whileThisCharacterHasNoDamageGains()`
**When to use:** "While this character has no damage, [it] gains [ABILITY]"

```typescript
whileThisCharacterHasNoDamageGains({
  name: string,
  text: string,
  ability: ActivatedAbility | StaticAbility | TriggeredAbility
})
```

---

## "While..." on Other Targets

### `whileConditionOnThisCharacterTargetsGain()`
**When to use:** "While [CONDITION on this character], [OTHER TARGETS] gain [ABILITY]"

```typescript
whileConditionOnThisCharacterTargetsGain({
  name: string,
  text: string,
  conditions: Condition[],
  ability: GainAbilityStaticAbility["gainedAbility"] | StaticAbilityWithEffect,
  target: CardEffectTarget
})
```

**Example card texts:**
- "While this character is exerted, your Ally characters gain +1 ⬡."
- "While this character is exerted, opposing characters can't quest."
- "While this character is exerted, opposing characters with **Evasive** gain **Reckless**."
- "While this character is exerted, your characters named Koda can't be challenged."

---

### `targetCardsGains()`
**When to use:** General helper for "[TARGETS] gain [ABILITY]" (no condition on source)

```typescript
targetCardsGains({
  name: string,
  text: string,
  ability: GainAbilityStaticAbility["gainedAbility"] | StaticAbilityWithEffect,
  target: CardEffectTarget,
  conditions?: Condition[]
})
```

---

## Special Cases

### `whileYouHaveNoCardsInHandThisCharacterCanChallengeReadyChars()`
**When to use:** "While you have no cards in your hand, this character can challenge ready characters"

```typescript
whileYouHaveNoCardsInHandThisCharacterCanChallengeReadyChars({
  name: string,
  text: string
})
```

---

### `whileYouHaveCharactersHere()`
**When to use:** (For Locations) "While you have characters here, [ABILITY]"

```typescript
whileYouHaveCharactersHere({
  name?: string,
  text?: string,
  ability: StaticAbility | ActivatedAbility | TriggeredAbility,
  conditions?: Condition[]
})
```

---

### `whileYouHaveNoCaptainsInPlay()`
**When to use:** "While you have no Captain characters in play, [ABILITY]"

```typescript
whileYouHaveNoCaptainsInPlay({
  name: string,
  text: string,
  ability: StaticAbility | ActivatedAbility | TriggeredAbility,
  conditions?: Condition[]
})
```

---

## Predefined Static Abilities

### `thisMissionIsCursed`
**When to use:** "This character doesn't ready at the start of the turn"

```typescript
thisMissionIsCursed  // Constant - RestrictionStaticAbility
```

---

## Usage Tips

1. **"Gets" vs "Gains":**
   - **Gets** = Attribute modification (⬡, ◊, ⚔)
   - **Gains** = Ability grant (Evasive, Support, Challenger, etc.)

2. **Condition Checking:**
   - While abilities check conditions continuously
   - Effect applies when conditions are true
   - Effect stops when conditions become false

3. **Stacking:**
   - Multiple while abilities can stack
   - Same attribute bonuses add together
   - Abilities granted multiple times don't stack (unless numeric like Challenger)

4. **Common Patterns:**
   ```typescript
   // Pattern 1: Simple conditional bonus
   whileConditionThisCharacterGets({
     name: "Ability Name",
     text: "While you have 3 or more characters in play, this character gets +2 ⬡.",
     attribute: "strength",
     amount: 2,
     conditions: [haveXorMoreCharactersInPlay(3)]
   })
   
   // Pattern 2: Named character requirement
   whileYouHaveACharacterNamedThisCharGains({
     name: "Work Together",
     text: "While you have a character named Dale in play, this character gains **Support**.",
     characterName: "Dale",
     ability: { type: "keyword", keyword: "support" }
   })
   ```

5. **Effect Types You Can Grant:**
   - Keywords: `{ type: "keyword", keyword: "evasive" }`
   - Numeric Keywords: `{ type: "keyword", keyword: "challenger", amount: 2 }`
   - Triggered Abilities: Full `TriggeredAbility` objects
   - Activated Abilities: Full `ActivatedAbility` objects
   - Static Effects: Full `StaticAbilityWithEffect` objects

6. **Target Scope:**
   - `thisCharacter` = Only the source
   - `allYourCharacters` = All your characters (including source if applicable)
   - Custom targets via `target` parameter

---

## Common Ability Objects to Grant

```typescript
// Evasive
{ type: "keyword", keyword: "evasive" }

// Rush
{ type: "keyword", keyword: "rush" }

// Support
{ type: "keyword", keyword: "support" }

// Bodyguard
{ type: "keyword", keyword: "bodyguard" }

// Ward
{ type: "keyword", keyword: "ward" }

// Reckless
{ type: "keyword", keyword: "reckless" }

// Challenger +X
{ type: "keyword", keyword: "challenger", amount: 2 }

// Singer X
{ type: "keyword", keyword: "singer", amount: 4 }

// Resist +X
{ type: "keyword", keyword: "resist", amount: 1 }
```

---

## Related Files
- [conditions.md](conditions.md) - Conditions used in while abilities
- [effects.md](effects.md) - Effects that can be applied
- [targets.md](targets.md) - Targets for while abilities
- [triggers.md](triggers.md) - Triggered abilities vs static abilities

