import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nalaMischievousCub: LorcanaCharacterCardDefinition = {
  id: "wow",
  name: "Nala",
  title: "Mischievous Cub",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "The Lorcana Hide-and-Seek Championship was hers for the taking.",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  willpower: 4,
  strength: 0,
  lore: 1,
  illustrator: "Shannon Hallstein",
  number: 2,
  set: "SSK",
  rarity: "uncommon",
};
