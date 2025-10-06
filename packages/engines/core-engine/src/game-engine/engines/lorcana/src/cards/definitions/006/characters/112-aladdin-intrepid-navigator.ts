// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aladdinIntrepidNavigator: LorcanaCharacterCardDefinition = {
  id: "j94",
  name: "Aladdin",
  title: "Fearless Navigator",
  characteristics: ["storyborn", "hero", "prince"],
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Lava Hidzebaar",
  number: 112,
  set: "006",
  rarity: "common",
};
