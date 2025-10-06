import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const monstroWhaleOfAWhale: LorcanaCharacterCardDefinition = {
  id: "rdj",
  name: "Monstro",
  title: "Whale of a Whale",
  characteristics: ["storyborn"],
  type: "character",
  flavour:
    "The great beast breached the surface of the Azurite Sea, and the cry went out, Monstro! Monstro!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  illustrator: "Ivan Shavrin",
  number: 52,
  set: "SSK",
  rarity: "uncommon",
};
