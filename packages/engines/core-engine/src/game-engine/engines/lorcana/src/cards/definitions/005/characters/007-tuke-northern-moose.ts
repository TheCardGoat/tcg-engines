import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tukeNorthernMoose: LorcanitoCharacterCardDefinition = {
  id: "lu2",
  name: "Tuke",
  title: "Northern Moose",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "I'd love a snack, but I'm kinda tied up right now.",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  illustrator: "Ron Baird",
  number: 7,
  set: "SSK",
  rarity: "common",
};
