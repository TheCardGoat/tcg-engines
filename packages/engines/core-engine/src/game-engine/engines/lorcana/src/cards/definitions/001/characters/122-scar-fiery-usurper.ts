import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scarFieryUsurper: LorcanitoCharacterCardDefinition = {
  id: "fsu",
  name: "Scar",
  title: "Fiery Usurper",
  characteristics: ["dreamborn", "villain"],
  type: "character",
  flavour: "Consumed by the flames of ambition.",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  illustrator: "Amber Kommavongsa",
  number: 122,
  set: "TFC",
  rarity: "common",
};
