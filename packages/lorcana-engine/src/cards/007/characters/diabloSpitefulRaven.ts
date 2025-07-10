import {
  challengerAbility,
  evasiveAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const diabloSpitefulRaven: LorcanitoCharacterCard = {
  id: "lzu",
  name: "Diablo",
  title: "Spiteful Raven",
  characteristics: ["storyborn", "ally"],
  text: "Evasive\nChallenger +2",
  type: "character",
  inkwell: true,
  colors: ["amethyst", "emerald"],
  cost: 2,
  strength: 1,
  willpower: 2,
  illustrator: "Mike Packer",
  number: 66,
  set: "007",
  rarity: "uncommon",
  lore: 1,
  abilities: [evasiveAbility, challengerAbility(2)],
};
