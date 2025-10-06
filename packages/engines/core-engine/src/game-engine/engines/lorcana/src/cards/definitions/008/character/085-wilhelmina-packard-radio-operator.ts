import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wilhelminaPackardRadioOperator: LorcanaCharacterCardDefinition = {
  id: "hpp",
  name: "Wilhelmina Packard",
  title: "Radio Operator",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 3,
  willpower: 4,
  illustrator: "Aurélie Lise-Anne",
  number: 85,
  set: "008",
  rarity: "common",
  lore: 1,
};
