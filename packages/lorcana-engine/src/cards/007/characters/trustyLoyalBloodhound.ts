import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const trustyLoyalBloodhound: LorcanitoCharacterCard = {
  id: "kcq",
  name: "Trusty",
  title: "Loyal Bloodhound",
  characteristics: ["storyborn", "ally"],
  text: "Support",
  type: "character",
  abilities: [supportAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Yu Nguyen",
  number: 6,
  set: "007",
  rarity: "common",
  lore: 1,
};
