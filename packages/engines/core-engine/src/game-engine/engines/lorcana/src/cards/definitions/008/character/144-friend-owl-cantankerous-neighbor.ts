import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const friendOwlCantankerousNeighbor: LorcanaCharacterCardDefinition = {
  id: "vso",
  name: "Friend Owl",
  title: "Cantankerous Neighbor",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "James Rey Sanchez",
  number: 144,
  set: "008",
  rarity: "super_rare",
  lore: 2,
};
