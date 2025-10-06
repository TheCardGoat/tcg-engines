import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaQueenRegent: LorcanitoCharacterCardDefinition = {
  id: "oqx",
  name: "Elsa",
  title: "Queen Regent",
  characteristics: ["hero", "queen", "sorcerer", "storyborn"],
  type: "character",
  flavour: "I never knew what I was capable of.",
  inkwell: true,
  colors: ["amethyst"],
  illustrator: "Duyen Nguyen / Aubrey Archer",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  number: 40,
  set: "TFC",
  rarity: "common",
};
