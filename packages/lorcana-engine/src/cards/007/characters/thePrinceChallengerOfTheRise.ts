import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const thePrinceChallengerOfTheRise: LorcanitoCharacterCard = {
  id: "yba",
  name: "The Prince",
  title: "Vigilant Suitor",
  characteristics: ["storyborn", "hero", "prince"],
  text: "Bodyguard ",
  type: "character",
  abilities: [bodyguardAbility],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  strength: 0,
  willpower: 5,
  illustrator: "João Moura",
  number: 24,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
