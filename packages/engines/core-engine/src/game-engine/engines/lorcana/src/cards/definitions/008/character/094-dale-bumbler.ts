import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daleBumbler: LorcanaCharacterCardDefinition = {
  id: "tep",
  name: "Dale",
  title: "Bumbler",
  characteristics: ["storyborn", "hero"],
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 3,
  illustrator: "Wouter Bruneel",
  number: 94,
  set: "008",
  rarity: "common",
  lore: 1,
};
