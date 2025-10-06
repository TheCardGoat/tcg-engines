import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kingStefanNewFather: LorcanaCharacterCardDefinition = {
  id: "q85",
  name: "King Stefan",
  title: "New Father",
  characteristics: ["storyborn", "mentor", "king"],
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 4,
  willpower: 7,
  illustrator: "Mike Parker",
  number: 3,
  set: "007",
  rarity: "common",
  lore: 1,
};
