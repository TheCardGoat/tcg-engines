import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liloMakingAWish: LorcanaCharacterCardDefinition = {
  id: "ep8",
  name: "Lilo",
  title: "Making a Wish",
  characteristics: ["hero", "storyborn"],
  type: "character",
  flavour: "A falling star . . . I have to make a wish!",
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 2,
  illustrator: "Dave Beauchene",
  number: 9,
  set: "TFC",
  rarity: "rare",
};
