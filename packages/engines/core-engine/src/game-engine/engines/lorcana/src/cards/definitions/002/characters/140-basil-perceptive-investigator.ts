import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const basilPerceptiveInvestigator: LorcanitoCharacterCardDefinition = {
  id: "j48",

  name: "Basil",
  title: "Perceptive Investigator",
  characteristics: ["hero", "storyborn", "detective"],
  type: "character",
  flavour: "There is no question: something is afoot in the Great Illuminary.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Roger Perez",
  number: 140,
  set: "ROF",
  rarity: "common",
};
