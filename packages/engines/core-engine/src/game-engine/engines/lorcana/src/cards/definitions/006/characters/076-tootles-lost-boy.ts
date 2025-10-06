// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tootlesLostBoy: LorcanaCharacterCardDefinition = {
  id: "rad",
  name: "Tootles",
  title: "Lost Boy",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Taranesh",
  number: 76,
  set: "006",
  rarity: "common",
};
