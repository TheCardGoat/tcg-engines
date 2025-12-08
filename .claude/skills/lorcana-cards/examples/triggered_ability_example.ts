/**
 * Example: Triggered Ability Implementation
 *
 * This example shows how to implement a triggered ability that fires
 * when a specific game event occurs (e.g., when a card is played).
 */

import type { TriggeredAbility } from "@lorcanito/lorcana-engine/types";

// Example 1: Simple triggered ability with single effect
// "When you play this character, draw a card."
export const drawOnPlay: TriggeredAbility = {
  type: "triggered",
  name: "Draw On Play",
  text: "When you play this character, draw a card.",
  trigger: whenYouPlayThisCharacter(),
  effects: [drawACard],
};

// Example 2: Triggered ability with targeting
// "When you play this character, deal 2 damage to chosen character."
export const damageOnPlay: TriggeredAbility = {
  type: "triggered",
  name: "Damage On Play",
  text: "When you play this character, deal 2 damage to chosen character.",
  trigger: whenYouPlayThisCharacter(),
  effects: [dealDamage(2, chosenCharacter)],
  target: chosenCharacter,
};

// Example 3: Optional triggered ability
// "When you play this character, you may draw a card."
export const optionalDraw: TriggeredAbility = {
  type: "triggered",
  name: "Optional Draw",
  text: "When you play this character, you may draw a card.",
  trigger: whenYouPlayThisCharacter(),
  optional: true, // Player can choose whether to activate
  effects: [drawACard],
};

// Example 4: Conditional triggered ability
// "When you play this character, if you have another character in play, draw a card."
export const conditionalDraw: TriggeredAbility = {
  type: "triggered",
  name: "Conditional Draw",
  text: "When you play this character, if you have another character in play, draw a card.",
  trigger: whenYouPlayThisCharacter(),
  conditions: [() => hasOtherCharacterInPlay(this.ownerId)],
  effects: [drawACard],
};

// Example 5: Quest trigger
// "Whenever this character quests, draw a card."
export const drawOnQuest: TriggeredAbility = {
  type: "triggered",
  name: "Draw On Quest",
  text: "Whenever this character quests, draw a card.",
  trigger: wheneverThisQuests(),
  effects: [drawACard],
};

// Example 6: Multiple effects
// "When you play this character, draw a card and gain 1 lore."
export const multipleEffects: TriggeredAbility = {
  type: "triggered",
  name: "Multiple Effects",
  text: "When you play this character, draw a card and gain 1 lore.",
  trigger: whenYouPlayThisCharacter(),
  effects: [drawACard, gainLore(1)],
};

// Example 7: Named character condition
// "When you play this character, if you have a character named Mickey Mouse in play, draw 2 cards."
export const namedCharacterBonus: TriggeredAbility = {
  type: "triggered",
  name: "Named Character Bonus",
  text: "When you play this character, if you have a character named Mickey Mouse in play, draw 2 cards.",
  trigger: whenYouPlayThisCharacter(),
  conditions: [() => hasCharacterInPlay("Mickey Mouse", this.ownerId)],
  effects: [drawXCards(2)],
};

// Example 8: Start of turn trigger
// "At the start of your turn, draw a card."
export const startOfTurnDraw: TriggeredAbility = {
  type: "triggered",
  name: "Start of Turn Draw",
  text: "At the start of your turn, draw a card.",
  trigger: atStartOfTurn(),
  effects: [drawACard],
};

// Example 9: Complex targeting with filter
// "When you play this character, you may deal 3 damage to chosen opposing character with 2 or less willpower."
export const complexTargeting: TriggeredAbility = {
  type: "triggered",
  name: "Complex Targeting",
  text: "When you play this character, you may deal 3 damage to chosen opposing character with 2 or less willpower.",
  trigger: whenYouPlayThisCharacter(),
  optional: true,
  effects: [dealDamage(3, chosenCharacter)],
  target: {
    type: "character",
    filter: (card) => card.willpower <= 2 && card.ownerId !== this.ownerId,
  },
};

// Example 10: Multi-stage effect
// "When you play this character, choose up to 2 of your characters. Each of those characters gets +1 strength this turn."
export const multiTarget: TriggeredAbility = {
  type: "triggered",
  name: "Multi Target Buff",
  text: "When you play this character, choose up to 2 of your characters. Each of those characters gets +1 strength this turn.",
  trigger: whenYouPlayThisCharacter(),
  effects: [
    (context) => {
      context.targets?.forEach((target) => {
        target.modifyStrength(1, { duration: "turn" });
      });
    },
  ],
  target: upToXCharactersOfYours(2),
};
