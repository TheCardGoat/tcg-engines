// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const principeNaveenCarefreeExplorer: LorcanaCharacterCardDefinition = {
  id: "kgi",
  name: "Prince Naveen",
  title: "Carefree Explorer",
  characteristics: ["storyborn", "hero", "prince"],
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Luca Pinielli",
  number: 10,
  set: "006",
  rarity: "common",
};
