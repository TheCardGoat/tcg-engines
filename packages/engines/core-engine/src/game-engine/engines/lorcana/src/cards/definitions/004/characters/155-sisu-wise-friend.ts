import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sisuWiseFriend: LorcanaCharacterCardDefinition = {
  id: "lgb",
  name: "Sisu",
  title: "Wise Friend",
  characteristics: ["hero", "storyborn", "dragon", "deity"],
  type: "character",
  flavour:
    "It may feel impossible, but sometimes, you just have to take the first step, even before you're ready.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  illustrator: "Roger Pérez / Hayley Evans",
  number: 155,
  set: "URR",
  rarity: "uncommon",
};
