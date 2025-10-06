import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const genieTheEverImpressive: LorcanaCharacterCardDefinition = {
  id: "oy4",
  name: "Genie",
  title: "The Ever Impressive",
  characteristics: ["dreamborn", "ally"],
  type: "character",
  flavour:
    "You can wish for nearly anything! Do you want the short version, or should I give you the whole song and dance?",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Matt Chapman",
  number: 77,
  set: "TFC",
  rarity: "common",
};
