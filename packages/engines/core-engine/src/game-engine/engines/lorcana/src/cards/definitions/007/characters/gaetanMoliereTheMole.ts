import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gaetanMoliereTheMole: LorcanaCharacterCardDefinition = {
  id: "otx",
  name: "Gaetan Moliere",
  title: "The Mole",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 4,
  illustrator: "Sualo Nate",
  number: 158,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
