import type {
  AbilityEffect,
  LorcanitoActionCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import { atEndOfTurnBanishItself } from "@lorcanito/lorcana-engine/abilities/abilities";
import {
  chosenCharacterGetsStrength,
  drawACard,
} from "@lorcanito/lorcana-engine/effects/effects";

export type LorcanaActionCardDefinition = any;

const gainAbilityEffect: AbilityEffect = {
  type: "ability",
  ability: "custom",
  modifier: "add",
  duration: "turn",
  customAbility: atEndOfTurnBanishItself,
  target: {
    type: "card",
    value: "all",
    filters: [{ filter: "source", value: "target" }],
  },
};

const dependentAbilities: ResolutionAbility = {
  type: "resolution",
  effects: [chosenCharacterGetsStrength(5), gainAbilityEffect],
  dependentEffects: true,
};

export const candyDrift: LorcanaActionCardDefinition = {
  id: "sf4",
  name: "Candy Drift",
  characteristics: ["action"],
  text: "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
  type: "action",
  inkwell: true,
  colors: ["amber", "ruby"],
  cost: 2,
  illustrator: "Stefano Spagnuolo",
  number: 39,
  set: "008",
  rarity: "uncommon",
  abilities: [{ type: "resolution", effects: [drawACard] }, dependentAbilities],
};
