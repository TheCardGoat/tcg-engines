import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const thomasOmalleyFelineCharmer: LorcanitoCharacterCard = {
  id: "q6a",
  name: "Thomas O'malley",
  title: "Feline Charmer",
  characteristics: ["storyborn", "hero"],
  text: "Ward",
  type: "character",
  abilities: [wardAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 4,
  willpower: 2,
  illustrator: "Kasia Brzezinska",
  number: 88,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
