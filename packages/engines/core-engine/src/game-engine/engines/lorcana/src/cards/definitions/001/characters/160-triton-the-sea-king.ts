import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tritonTheSeaKing: LorcanitoCharacterCardDefinition = {
  id: "boi",

  name: "Triton",
  title: "The Sea King",
  characteristics: ["storyborn", "king"],
  type: "character",
  flavour: "Isn't ‘Because I said so’ enough of a reason?",
  inkwell: true,
  colors: ["sapphire"],
  cost: 7,
  strength: 5,
  willpower: 9,
  lore: 2,
  illustrator: "Cristian Romero",
  number: 160,
  set: "TFC",
  rarity: "uncommon",
};
