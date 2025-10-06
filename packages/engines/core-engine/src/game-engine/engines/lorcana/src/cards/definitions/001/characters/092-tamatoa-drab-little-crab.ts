import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tamatoaDrabLittleCrab: LorcanaCharacterCardDefinition = {
  id: "pme",
  name: "Tamatoa",
  title: "Drab Little Crab",
  characteristics: ["dreamborn"],
  type: "character",
  flavour:
    "Someday, I'll grow up to be the most crabulous crustacean the world has ever seen!",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Jeff Murchie",
  number: 92,
  set: "TFC",
  rarity: "uncommon",
};
