import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pumbaFriendlyWarhog: LorcanitoCharacterCardDefinition = {
  id: "b1f",
  name: "Pumbaa",
  title: "Friendly Warthog",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "You gotta put your behind in your past.",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  illustrator: "Jenna Gray",
  number: 17,
  set: "TFC",
  rarity: "common",
};
