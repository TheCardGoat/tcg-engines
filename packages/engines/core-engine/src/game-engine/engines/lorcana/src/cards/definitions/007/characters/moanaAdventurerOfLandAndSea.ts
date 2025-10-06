import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const moanaAdventurerOfLandAndSea: LorcanaCharacterCardDefinition = {
  id: "nde",
  name: "Moana",
  title: "Adventurer of Land and Sea",
  characteristics: ["storyborn", "hero", "princess"],
  type: "character",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 6,
  illustrator: "Anna Stosik",
  number: 156,
  set: "007",
  rarity: "common",
  lore: 1,
};
