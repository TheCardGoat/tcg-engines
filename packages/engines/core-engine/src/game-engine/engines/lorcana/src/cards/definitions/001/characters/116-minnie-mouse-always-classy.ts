import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minniMouseAlwaysClassy: LorcanaCharacterCardDefinition = {
  id: "nwa",

  name: "Minnie Mouse",
  title: "Always Classy",
  characteristics: ["hero", "storyborn"],
  type: "character",
  flavour: "Her fashion sense is always spot on.",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Kenneth Anderson",
  number: 116,
  set: "TFC",
  rarity: "common",
};
