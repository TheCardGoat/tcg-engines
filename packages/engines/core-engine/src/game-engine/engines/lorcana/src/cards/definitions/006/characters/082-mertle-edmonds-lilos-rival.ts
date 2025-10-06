// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mertleEdmondsLilosRival: LorcanitoCharacterCardDefinition = {
  id: "mkl",
  name: "Mertle Edmonds",
  title: "Lilo's Rival",
  characteristics: ["storyborn"],
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Gonzalo Kenny",
  number: 82,
  set: "006",
  rarity: "uncommon",
};
