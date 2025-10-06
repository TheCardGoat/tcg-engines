import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bambiPrinceOfTheForest: LorcanaCharacterCardDefinition = {
  id: "ax8",
  name: "Bambi",
  title: "Prince of the Forest",
  characteristics: ["storyborn", "hero", "prince"],
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 3,
  willpower: 2,
  illustrator: "Heidi Neubauer",
  number: 57,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
