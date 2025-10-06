// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const simbaHappygolucky: LorcanaCharacterCardDefinition = {
  id: "jl8",
  name: "Simba",
  title: "Happy-Go-Lucky",
  characteristics: ["storyborn", "hero", "prince"],
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Marco Giorgianni",
  number: 5,
  set: "006",
  rarity: "common",
};
