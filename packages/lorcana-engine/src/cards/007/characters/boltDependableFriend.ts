import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const boltDependableFriend: LorcanitoCharacterCard = {
  id: "wzy",
  name: "Bolt",
  title: "Dependable Friend",
  characteristics: ["storyborn", "hero"],
  text: "Support",
  type: "character",
  abilities: [supportAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 4,
  illustrator: "Ellie Horie",
  number: 18,
  set: "007",
  rarity: "common",
  lore: 2,
};
