import type {
  Ability,
  AbilityDuration,
  Effect,
} from "../../abilities/ability-types";

// Simple mock ability that gains lore for a player
const gainOneLoreEffect: Effect = {
  type: "gainLore",
  parameters: {
    amount: 1,
  },
  optional: false,
};

const gainTwoLoreEffect: Effect = {
  type: "gainLore",
  parameters: {
    amount: 2,
  },
  optional: false,
};

const gainLoreEffect = {
  type: "lore",
  parameters: {
    value: 3,
  },
  duration: { type: "endOfTurn" } as AbilityDuration,
  optional: false,
};

const gainOneLoreAbility: Ability = {
  type: "triggered",
  text: "When you play this character, gain 1 lore",
  name: "GainOneLore",
  effects: [gainOneLoreEffect],
  timing: "onPlay",
  condition: { type: "onEnterPlay" },
  optional: false,
};

const gainTwoLoreAbility: Ability = {
  type: "triggered",
  text: "When you play this character, gain 2 lore",
  name: "GainTwoLore",
  effects: [gainTwoLoreEffect],
  timing: "onPlay",
  condition: { type: "onEnterPlay" },
  optional: false,
};

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
    abilities: [amount === 1 ? gainOneLoreAbility : gainTwoLoreAbility],
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
  abilities: [gainOneLoreAbility],
};
