// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tukTukBigBuddy: LorcanaCharacterCardDefinition = {
  id: "kxy",
  name: "Tuk Tuk",
  title: "Big Buddy",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  illustrator: "Mariana Moreno",
  number: 184,
  set: "006",
  rarity: "uncommon",
};
