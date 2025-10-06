import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pinocchioStarAttraction: LorcanitoCharacterCardDefinition = {
  id: "z8x",

  name: "Pinocchio",
  title: "Star Attraction",
  characteristics: ["hero", "storyborn"],
  type: "character",
  flavour:
    "With that personality, that profile, that physique . . . \nWhy, I can see your name in lights, lights six feet high. \n−Honest John",
  colors: ["amethyst"],
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 3,
  illustrator: "Kapik",
  number: 56,
  set: "ROF",
  rarity: "rare",
};
