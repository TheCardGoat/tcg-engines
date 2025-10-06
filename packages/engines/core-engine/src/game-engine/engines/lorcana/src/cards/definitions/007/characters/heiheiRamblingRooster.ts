import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heiheiRamblingRooster: LorcanaCharacterCardDefinition = {
  id: "pfq",
  name: "Heihei",
  title: "Rambling Rooster",
  characteristics: ["dreamborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 2,
  willpower: 2,
  illustrator: "Alan Batson",
  number: 185,
  set: "007",
  rarity: "common",
  lore: 1,
};
