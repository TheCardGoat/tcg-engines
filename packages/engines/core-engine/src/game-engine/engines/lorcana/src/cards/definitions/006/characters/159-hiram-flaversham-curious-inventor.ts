// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hiramFlavershamCuriousInventor: LorcanaCharacterCardDefinition = {
  id: "h7c",
  name: "Hiram Flaversham",
  title: "Intrigued Inventor",
  characteristics: ["storyborn", "ally", "inventor"],
  type: "character",
  inkwell: false,
  colors: ["sapphire"],
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 3,
  illustrator: "Stefano Spagnuolo",
  number: 159,
  set: "006",
  rarity: "rare",
};
