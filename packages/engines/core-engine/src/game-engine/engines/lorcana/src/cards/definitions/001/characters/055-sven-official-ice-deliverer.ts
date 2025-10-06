import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const svenOficialIceDeliverer: LorcanitoCharacterCardDefinition = {
  id: "kar",
  reprints: ["tf5"],
  name: "Sven",
  title: "Official Ice Deliverer",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "Reindeer comin’ through!\n−Kristoff",
  inkwell: true,
  colors: ["amethyst"],
  cost: 6,
  strength: 5,
  willpower: 7,
  lore: 1,
  illustrator: "Jared Nickerl",
  number: 55,
  set: "TFC",
  rarity: "uncommon",
};
