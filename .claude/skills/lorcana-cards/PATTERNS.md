# Lorcana Card Implementation Patterns

This document provides quick reference patterns for implementing Disney Lorcana TCG cards. For detailed helper documentation, see the [helpers-index/](helpers-index/) directory.

## Quick Links

- **[Comprehensive Helper Index](helpers-index/README.md)** - Start here for full documentation
- **[Triggers](helpers-index/triggers.md)** - When abilities activate
- **[Effects](helpers-index/effects.md)** - What abilities do
- **[Targets](helpers-index/targets.md)** - What effects target
- **[Conditions](helpers-index/conditions.md)** - Requirements for abilities
- **[While Abilities](helpers-index/while-abilities.md)** - Continuous effects
- **[Costs](helpers-index/costs.md)** - Costs for activated abilities

---

## Common Implementation Patterns

### Pattern 1: Simple "When You Play This Character" Effect

**Card Text:** "When you play this character, draw a card."

```typescript
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

export const abilityName: TriggeredAbility = whenYouPlayThisCharacter({
  name: "Ability Name",
  text: "When you play this character, draw a card.",
  effects: [drawACard],
});
```

---

### Pattern 2: "Whenever You Play A Character" Trigger

**Card Text:** "Whenever you play a character, you may deal 2 damage to chosen opposing character."

```typescript
import { wheneverYouPlayACharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { dealDamageToChosenOpposingCharacter } from "@lorcanito/lorcana-engine/effects/effects";

export const abilityName: TriggeredAbility = wheneverYouPlayACharacter({
  name: "Ability Name",
  text: "Whenever you play a character, you may deal 2 damage to chosen opposing character.",
  effects: [dealDamageToChosenOpposingCharacter(2)],
  optional: true,
});
```

---

### Pattern 3: "While You Have [CHARACTER NAME]" Continuous Ability

**Card Text:** "While you have a character named Dale in play, this character gains **Support**."

```typescript
import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";

export const workTogether: GainAbilityStaticAbility = whileYouHaveACharacterNamedThisCharGains({
  name: "Work Together",
  text: "While you have a character named Dale in play, this character gains **Support**.",
  characterName: "Dale",
  ability: { type: "keyword", keyword: "support" },
});
```

---

### Pattern 4: "At The Start Of Your Turn" Effect

**Card Text:** "At the start of your turn, draw a card."

```typescript
import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

export const abilityName: TriggeredAbility = atTheStartOfYourTurn({
  name: "Ability Name",
  text: "At the start of your turn, draw a card.",
  effects: [drawACard],
});
```

---

### Pattern 5: Conditional "If You Have X Characters" Trigger

**Card Text:** "When this character quests, if you have 3 or more characters in play, draw a card."

```typescript
import { whenThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { haveXorMoreCharactersInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";

export const abilityName: TriggeredAbility = whenThisCharacterQuests({
  name: "Ability Name",
  text: "When this character quests, if you have 3 or more characters in play, draw a card.",
  effects: [drawACard],
  conditions: [haveXorMoreCharactersInPlay(3)],
});
```

---

### Pattern 6: "While [CONDITION]" Attribute Bonus

**Card Text:** "While you have another character in play, this character gets +2 ⬡."

```typescript
import { whileYouHaveAnotherCharacterInPlayThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";

export const abilityName: StaticAbilityWithEffect = whileYouHaveAnotherCharacterInPlayThisCharacterGets({
  name: "Ability Name",
  text: "While you have another character in play, this character gets +2 ⬡.",
  attribute: "strength",
  amount: 2,
});
```

---

### Pattern 7: Activated "Exert" Ability

**Card Text:** "↷ — Draw a card."

```typescript
import { exertCharCost } from "@lorcanito/lorcana-engine/abilities/abilities";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

export const abilityName: ActivatedAbility = {
  type: "activated",
  name: "Ability Name",
  text: "↷ — Draw a card.",
  costs: [exertCharCost(1)],
  effects: [drawACard],
};
```

---

### Pattern 8: Multiple Effects

**Card Text:** "When you play this character, draw a card and deal 2 damage to chosen opposing character."

```typescript
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { drawACard, dealDamageToChosenOpposingCharacter } from "@lorcanito/lorcana-engine/effects/effects";

export const abilityName: TriggeredAbility = whenYouPlayThisCharacter({
  name: "Ability Name",
  text: "When you play this character, draw a card and deal 2 damage to chosen opposing character.",
  effects: [
    drawACard,
    dealDamageToChosenOpposingCharacter(2),
  ],
});
```

---

### Pattern 9: Custom Target Effect

**Card Text:** "When you play this character, deal 3 damage to chosen character."

```typescript
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";

export const abilityName: TriggeredAbility = whenYouPlayThisCharacter({
  name: "Ability Name",
  text: "When you play this character, deal 3 damage to chosen character.",
  effects: [dealDamageEffect(3, chosenCharacter)],
});
```

---

### Pattern 10: Complex Conditional While Ability

**Card Text:** "During your turn, while you have 10 or more cards in your inkwell, this character gets +4 ◊."

```typescript
import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";

export const abilityName: StaticAbilityWithEffect = whileConditionThisCharacterGets({
  name: "Ability Name",
  text: "During your turn, while you have 10 or more cards in your inkwell, this character gets +4 ◊.",
  attribute: "lore",
  amount: 4,
  conditions: [
    duringYourTurn,
    {
      type: "filter",
      comparison: { operator: "gte", value: 10 },
      filters: [
        { filter: "zone", value: "inkwell" },
        { filter: "owner", value: "self" },
      ],
    },
  ],
});
```

---

## Implementation Checklist

When implementing a card ability:

1. **[ ] Identify the trigger:**
   - "When" = One-time trigger (whenYouPlayThisCharacter, whenThisCharacterQuests)
   - "Whenever" = Repeating trigger (wheneverYouPlayACharacter)
   - "At" = Phase trigger (atTheStartOfYourTurn, atTheEndOfYourTurn)
   - "While" = Continuous effect (whileConditionThisCharacterGets)
   - No trigger = Static ability or activated ability

2. **[ ] Identify the effect(s):**
   - Draw cards (drawACard, drawXCards)
   - Deal damage (dealDamageEffect, dealDamageToChosenCharacter)
   - Banish (banishChosenCharacter, banishChosenItem)
   - Modify attributes (chosenCharacterGetsStrength)
   - Grant abilities (chosenCharacterGainsEvasive)
   - Etc.

3. **[ ] Identify the target(s):**
   - Chosen character (chosenCharacter)
   - Chosen opposing character (chosenOpposingCharacter)
   - This character (thisCharacter)
   - All your characters (allYourCharacters)
   - Self (for player effects)
   - Etc.

4. **[ ] Identify conditions (if any):**
   - "If you have..." (ifYouHaveCharacterNamed, haveXorMoreCharactersInPlay)
   - "During your turn" (duringYourTurn)
   - "While this character is exerted" (whileThisCharacterIsExerted)
   - Etc.

5. **[ ] Identify costs (if activated ability):**
   - Exert (exertCharCost)
   - Discard (discardCharCost)
   - Banish (banishItemCost)
   - Etc.

6. **[ ] Check for optional ("may"):**
   - Set `optional: true`

7. **[ ] Check for once per turn:**
   - Set `oncePerTurn: true`

---

## Common Keywords

Quick reference for keyword abilities:

| Keyword | Usage |
|---------|-------|
| **Evasive** | `chosenCharacterGainsEvasive` or `{ type: "keyword", keyword: "evasive" }` |
| **Rush** | `chosenCharacterGainsRush` or `{ type: "keyword", keyword: "rush" }` |
| **Support** | `chosenCharacterGainsSupport("turn")` or `{ type: "keyword", keyword: "support" }` |
| **Bodyguard** | `chosenCharacterGainsBodyguard` or `{ type: "keyword", keyword: "bodyguard" }` |
| **Ward** | `chosenCharacterGainsWard` or `{ type: "keyword", keyword: "ward" }` |
| **Challenger +X** | `chosenCharacterGainsChallenger(2)` or `{ type: "keyword", keyword: "challenger", amount: 2 }` |
| **Reckless** | `choseCharacterGainsReckless` or `{ type: "keyword", keyword: "reckless" }` |
| **Resist +X** | `chosenCharacterGainsResist(1)` or `{ type: "keyword", keyword: "resist", amount: 1 }` |
| **Singer X** | `{ type: "keyword", keyword: "singer", amount: 4 }` |

---

## Import Paths Quick Reference

```typescript
// Triggers
import { whenYouPlayThisCharacter, whenThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { wheneverYouPlayACharacter, wheneverThisQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { atTheStartOfYourTurn, atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";

// Effects
import { 
  drawACard, 
  drawXCards, 
  dealDamageEffect, 
  dealDamageToChosenCharacter,
  banishChosenCharacter,
  chosenCharacterGetsStrength,
  chosenCharacterGainsEvasive,
} from "@lorcanito/lorcana-engine/effects/effects";

// Targets
import { 
  chosenCharacter, 
  chosenOpposingCharacter, 
  thisCharacter, 
  allYourCharacters,
  self,
} from "@lorcanito/lorcana-engine/abilities/targets";

// Conditions
import { 
  ifYouHaveCharacterNamed, 
  haveXorMoreCharactersInPlay,
  duringYourTurn,
  whileThisCharacterIsExerted,
} from "@lorcanito/lorcana-engine/abilities/conditions/conditions";

// While Abilities
import { 
  whileYouHaveACharacterNamedThisCharGains,
  whileConditionThisCharacterGets,
} from "@lorcanito/lorcana-engine/abilities/whileAbilities";

// Costs
import { 
  exertCharCost, 
  discardCharCost, 
  banishItemCost,
} from "@lorcanito/lorcana-engine/abilities/abilities";
```

---

## Resources

- **Full Helper Index**: [helpers-index/README.md](helpers-index/README.md)
- **Card Implementation Skill**: [SKILLS.md](SKILLS.md)
- **Test Guide**: [TEST_GUIDE.md](TEST_GUIDE.md) *(if exists)*
- **Common Issues**: [COMMON_ISSUES.md](COMMON_ISSUES.md) *(if exists)*

---

## Tips

1. **Start with similar cards**: Use the llm-index to find similar cards and copy their patterns
2. **Use TypeScript types**: Let TypeScript guide you to the right parameters
3. **Test incrementally**: Write one test at a time and make it pass
4. **Follow TDD**: Write tests BEFORE implementing abilities
5. **Use descriptive names**: Ability names should match the card text
6. **Keep it simple**: Use built-in helpers whenever possible
7. **Match exact text**: The `text` field should match the card's printed ability text exactly
