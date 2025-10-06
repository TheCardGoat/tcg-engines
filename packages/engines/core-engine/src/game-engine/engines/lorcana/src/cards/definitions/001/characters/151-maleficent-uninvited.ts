import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maleficentUninvited: LorcanaCharacterCardDefinition = {
  id: "ncw",

  name: "Maleficent",
  title: "Uninvited",
  characteristics: ["dreamborn", "sorcerer", "villain"],
  type: "character",
  flavour: "She had no invitation−and needed no introduction.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 3,
  illustrator: "Gaku Kumatori",
  number: 151,
  set: "TFC",
  rarity: "rare",
};
