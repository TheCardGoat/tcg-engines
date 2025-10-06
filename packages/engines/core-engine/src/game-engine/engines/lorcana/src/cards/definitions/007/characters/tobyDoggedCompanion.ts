import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tobyDoggedCompanion: LorcanaCharacterCardDefinition = {
  id: "e4r",
  name: "Toby",
  title: "Dogged Companion",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: false,
  colors: ["ruby"],
  cost: 1,
  strength: 3,
  willpower: 1,
  illustrator: "Gaku Kumatori",
  number: 131,
  set: "007",
  rarity: "common",
  lore: 1,
};
