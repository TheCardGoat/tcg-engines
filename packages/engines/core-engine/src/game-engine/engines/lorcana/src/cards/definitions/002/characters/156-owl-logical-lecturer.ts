import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const owlLogicalLecturer: LorcanaCharacterCardDefinition = {
  id: "iei",
  name: "Owl",
  title: "Logical Lecturer",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    "For instance, based on the quality of the light and the subtle change in wind direction, I can safely say that it is time for tea.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Agnes Christianson",
  number: 156,
  set: "ROF",
  rarity: "common",
};
