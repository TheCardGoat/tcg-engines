import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mufasaRespectedKing: LorcanaCharacterCardDefinition = {
  id: "ns2",
  name: "Mufasa",
  title: "Respected King",
  characteristics: ["storyborn", "mentor", "king"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 4,
  willpower: 4,
  illustrator: "Amarndo MacFarlane",
  number: 196,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
