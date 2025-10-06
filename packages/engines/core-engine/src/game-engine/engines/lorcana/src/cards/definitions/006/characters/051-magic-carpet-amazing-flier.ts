// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicCarpetAmazingFlier: LorcanaCharacterCardDefinition = {
  id: "f37",
  name: "Magic Carpet",
  title: "Amazing Flier",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 3,
  illustrator: "Ron Baird",
  number: 51,
  set: "006",
  rarity: "uncommon",
};
