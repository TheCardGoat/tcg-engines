import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auroraRegalPrincess: LorcanitoCharacterCardDefinition = {
  id: "b2e",
  reprints: ["gc3"],

  name: "Aurora",
  title: "Regal Princess",
  characteristics: ["hero", "storyborn", "princess"],
  type: "character",
  flavour:
    "„They say if you dream a thing more than once,\u0003 it‘s sure to come true!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Samanta Erdini",
  number: 140,
  set: "TFC",
  rarity: "uncommon",
};
