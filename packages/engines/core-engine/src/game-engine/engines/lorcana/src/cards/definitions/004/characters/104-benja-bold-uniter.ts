import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const benjaBoldUniter: LorcanaCharacterCardDefinition = {
  id: "pti",
  name: "Benja",
  title: "Bold Uniter",
  characteristics: ["storyborn", "king", "mentor"],
  type: "character",
  flavour: "We must work together to heal the entanglements.",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  illustrator: "Eri Welli",
  number: 104,
  set: "URR",
  rarity: "common",
};
