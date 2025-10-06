// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const montereyJackGoodheartedRanger: LorcanitoCharacterCardDefinition = {
  id: "vjx",
  name: "Monterey Jack",
  title: "Good-Hearted Ranger",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 0,
  willpower: 7,
  lore: 2,
  illustrator: "Simone Buonfantino",
  number: 13,
  set: "006",
  rarity: "rare",
};
