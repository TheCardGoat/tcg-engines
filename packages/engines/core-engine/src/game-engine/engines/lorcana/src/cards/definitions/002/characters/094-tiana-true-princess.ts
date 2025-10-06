import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tianaTruePrincess: LorcanitoCharacterCardDefinition = {
  id: "fdi",
  name: "Tiana",
  title: "True Princess",
  characteristics: ["hero", "storyborn", "princess"],
  type: "character",
  flavour: "Finding your true self will set your heart aglow.",
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 5,
  willpower: 3,
  lore: 3,
  illustrator: "Casey Robin",
  number: 94,
  set: "ROF",
  rarity: "uncommon",
};
