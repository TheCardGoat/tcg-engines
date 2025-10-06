import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const berliozMischievousKitten: LorcanaCharacterCardDefinition = {
  id: "ow3",
  name: "Berlioz",
  title: "Mischievous Kitten",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 5,
  illustrator: "Geoffrey Boudout",
  number: 99,
  set: "007",
  rarity: "common",
  lore: 1,
};
