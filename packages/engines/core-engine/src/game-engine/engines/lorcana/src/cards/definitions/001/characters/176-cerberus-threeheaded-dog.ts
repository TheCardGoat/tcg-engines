import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cerberusThreeHeadedDog: LorcanitoCharacterCardDefinition = {
  id: "zie",
  name: "Cerberus",
  title: "Three-Headed Dog",
  characteristics: ["storyborn"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  illustrator: "Oleg Yurkov",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  number: 176,
  set: "TFC",
  rarity: "common",
};
