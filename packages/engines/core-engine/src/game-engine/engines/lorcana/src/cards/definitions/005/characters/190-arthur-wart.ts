import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arthurWart: LorcanaCharacterCardDefinition = {
  id: "szj",
  name: "Arthur",
  title: "Wart",
  characteristics: ["hero", "storyborn"],
  type: "character",
  flavour:
    "That boy's get real spark. Lots of spirit. Throws himself heart and soul into everything he does.\n−Merlin",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Kasia Brzezinska",
  number: 190,
  set: "SSK",
  rarity: "uncommon",
};
