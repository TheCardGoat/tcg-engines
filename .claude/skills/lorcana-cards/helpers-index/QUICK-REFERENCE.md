# Quick Reference - Lorcana Helper Functions

**One-page quick reference for the most commonly used helpers.**

---

## 🎯 Triggers (When/Whenever/At)

| Card Text Pattern | Helper Function |
|-------------------|----------------|
| "When you play this character..." | `whenYouPlayThisCharacter({ effects, ... })` |
| "When this character quests..." | `whenThisCharacterQuests({ effects, ... })` |
| "Whenever you play a character..." | `wheneverYouPlayACharacter({ effects, ... })` |
| "Whenever this character quests..." | `wheneverThisQuests({ effects, ... })` |
| "At the start of your turn..." | `atTheStartOfYourTurn({ effects, ... })` |
| "At the end of your turn..." | `atTheEndOfYourTurn({ effects, ... })` |

---

## 💥 Effects (What Happens)

| Card Text Pattern | Helper Function |
|-------------------|----------------|
| "Draw a card" | `drawACard` |
| "Draw X cards" | `drawXCards(2)` |
| "Deal X damage to chosen character" | `dealDamageToChosenCharacter(2)` |
| "Deal X damage to chosen opposing character" | `dealDamageToChosenOpposingCharacter(2)` |
| "Remove X damage from chosen character" | `healEffect(2, chosenCharacter)` |
| "Banish chosen character" | `banishChosenCharacter` |
| "Banish chosen opposing character" | `banishChosenOpposingCharacter` |
| "Banish chosen item" | `banishChosenItem` |
| "Discard a card" | `discardACard` |
| "Opponent discards a card" | `opponentDiscardsACard()` |
| "Return to hand" | `returnCardToHand(target)` |
| "Exert chosen character" | `exertChosenCharacter` |
| "Exert chosen opposing character" | `exertChosenOpposingCharacter` |
| "Ready chosen character" | `readyChosenCharacter` |
| "Ready another chosen character" | `readyAnotherChosenCharacter` |
| "You gain X lore" | `youGainLore(2)` |
| "Opponent loses X lore" | `opponentLoseLore(2)` |
| "Chosen character gets +X ⬡" | `chosenCharacterGetsStrength(2)` |
| "This character gets +X ⬡" | `thisCharacterGetsStrength(2)` |
| "Chosen character gains **Evasive**" | `chosenCharacterGainsEvasive` |
| "Chosen character gains **Rush**" | `chosenCharacterGainsRush` |
| "Chosen character gains **Support**" | `chosenCharacterGainsSupport("turn")` |
| "Chosen character gains Challenger +X" | `chosenCharacterGainsChallenger(2)` |

---

## 🎯 Targets (What/Who)

| Card Text Pattern | Helper Constant |
|-------------------|-----------------|
| "Chosen character" | `chosenCharacter` |
| "Chosen character of yours" | `chosenCharacterOfYours` |
| "Chosen opposing character" | `chosenOpposingCharacter` |
| "Another chosen character" | `anotherChosenCharacter` |
| "This character" | `thisCharacter` |
| "This card" | `thisCard` |
| "Your characters" / "All your characters" | `allYourCharacters` |
| "Your other characters" | `yourOtherCharacters` |
| "Opposing characters" | `opposingCharacters` |
| "Chosen item" | `chosenItem` |
| "Chosen location" | `chosenLocation` |
| "You" (player) | `self` |
| "Opponent" (player) | `opponent` |

---

## ⚖️ Conditions (If/While Requirements)

| Card Text Pattern | Helper Function |
|-------------------|----------------|
| "If you have a character named X..." | `ifYouHaveCharacterNamed("Elsa")` |
| "If you have X or more characters..." | `haveXorMoreCharactersInPlay(3)` |
| "During your turn" | `duringYourTurn` |
| "While this character is exerted" | `whileThisCharacterIsExerted` |
| "While this character is at a location" | `whileCharacterIsAtLocation` |
| "If you have no cards in your hand" | `haveNoCardsInYourHand` |
| "While you have an item in play" | `haveItemInPlay` |

---

## 🔄 While/Continuous Abilities

| Card Text Pattern | Helper Function |
|-------------------|----------------|
| "While you have a character named X, this character gains [ABILITY]" | `whileYouHaveACharacterNamedThisCharGains({ characterName: "Dale", ability: ... })` |
| "While you have another character in play, this character gets +X ⬡" | `whileYouHaveAnotherCharacterInPlayThisCharacterGets({ attribute: "strength", amount: 2 })` |
| "While [CONDITION], this character gets +X [ATTR]" | `whileConditionThisCharacterGets({ conditions: [...], attribute: "strength", amount: 2 })` |

---

## 💰 Costs (Activated Abilities)

| Card Text Pattern | Helper Function |
|-------------------|----------------|
| "↷" (Exert this character) | `exertCharCost(1)` |
| "Exert X characters" | `exertCharCost(2)` |
| "Discard X cards" | `{ type: "discard", amount: 1 }` |
| "Banish this item" | `banishItemCost(1)` |

---

## 📦 Common Import Paths

```typescript
// Triggers
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { wheneverYouPlayACharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";

// Effects
import { drawACard, dealDamageToChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";

// Targets
import { chosenCharacter, thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";

// Conditions
import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";

// While Abilities
import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";

// Costs
import { exertCharCost } from "@lorcanito/lorcana-engine/abilities/abilities";
```

---

## 🚀 Quick Start Template

```typescript
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

export const abilityName: TriggeredAbility = whenYouPlayThisCharacter({
  name: "Ability Name",
  text: "When you play this character, draw a card.",
  effects: [drawACard],
  optional: false,  // Set true for "you may"
});
```

---

## 🔗 Full Documentation

For complete details on each helper:
- **[Full Index](README.md)** - Overview and navigation
- **[Triggers](triggers.md)** - All trigger helpers
- **[Effects](effects.md)** - All effect helpers
- **[Targets](targets.md)** - All target helpers
- **[Conditions](conditions.md)** - All condition helpers
- **[While Abilities](while-abilities.md)** - Continuous effect helpers
- **[Costs](costs.md)** - Cost helpers for activated abilities
- **[Patterns](../PATTERNS.md)** - Common implementation patterns

