import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kidaAtlantean: LorcanaCharacterCardDefinition = {
  id: "sro",
  name: "Kida",
  title: "Atlantean",
  characteristics: ["hero", "storyborn", "princess"],
  type: "character",
  flavour: "Welcome to the Inklands. (Atlantean language)",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Nicoletta Baldari",
  number: 6,
  set: "ITI",
  rarity: "common",
};
