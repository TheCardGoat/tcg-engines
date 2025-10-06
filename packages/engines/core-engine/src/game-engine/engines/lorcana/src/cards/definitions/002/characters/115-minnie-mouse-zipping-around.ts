import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseZippingAround: LorcanaCharacterCardDefinition = {
  id: "d3n",

  name: "Minnie Mouse",
  title: "Zipping Around",
  characteristics: ["hero", "storyborn"],
  type: "character",
  flavour: "Zero to fun in under three seconds!",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Ellie Horie",
  number: 115,
  set: "ROF",
  rarity: "common",
};
