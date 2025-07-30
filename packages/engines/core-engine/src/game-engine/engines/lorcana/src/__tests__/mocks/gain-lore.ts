import type { LorcanaEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { GainLoreEffect } from "~/game-engine/engines/lorcana/src/abilities/player-effect";
import type { PlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type { Ability, AbilityDuration } from "../../abilities/ability-types";

// Self player target for gaining lore
const selfPlayerTarget: PlayerTarget = {
  type: "player",
  value: "self",
};

// Simple mock ability that gains lore for a player - using new strongly typed effects
const gainOneLoreEffect: GainLoreEffect = {
  type: "gainLore",
  parameters: {
    value: 1,
    target: selfPlayerTarget,
  },
  optional: false,
};

const gainTwoLoreEffect: GainLoreEffect = {
  type: "gainLore",
  parameters: {
    value: 2,
    target: selfPlayerTarget,
  },
  optional: false,
};

// Legacy effect structure - should be removed after full migration
const gainLoreEffect = {
  type: "lore",
  parameters: {
    value: 3, // Updated from 'amount' to 'value'
  },
  duration: { type: "endOfTurn" } as AbilityDuration,
  optional: false,
};

// const gainOneLoreAbility: Ability = {
//   type: "triggered",
//   text: "When you play this character, gain 1 lore",
//   name: "GainOneLore",
//   effects: [gainOneLoreEffect],
//   timing: "onPlay",
//   condition: { type: "onEnterPlay" },
//   optional: false,
// };

// const gainTwoLoreAbility: Ability = {
//   type: "triggered",
//   text: "When you play this character, gain 2 lore",
//   name: "GainTwoLore",
//   effects: [gainTwoLoreEffect],
//   timing: "onPlay",
//   condition: { type: "onEnterPlay" },
//   optional: false,
// };

export const createMockGainLoreCard = (
  cardInstanceId: string,
  amount = 1,
): any => {
  const mockCard = {
    instanceId: cardInstanceId,
    controllerId: "player_one", // Default controller
    baseCardId: `lore_gainer_${amount}`,
    cardName: `Lore Gainer ${amount}`,
    ink: 1,
    strength: 1,
    willpower: 1,
    lore: amount, // Lore value matches the gain amount
    cardType: "character",
    inkwell: false,
    abilities: [],
  };

  return mockCard;
};

// A mock card that can be used in tests to gain lore
export const mockGainLoreCard: any = {
  id: "gain_lore_card",
  name: "Lore Gainer",
  cardType: "character",
  inkCost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkwell: false,
  abilities: [],
};

// Export the strongly typed effects for use in tests
export { gainOneLoreEffect, gainTwoLoreEffect };
