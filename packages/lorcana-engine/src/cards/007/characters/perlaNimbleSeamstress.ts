import {
  evasiveAbility,
  supportAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const perlaNimbleSeamstress: LorcanitoCharacterCard = {
  id: "t6h",
  name: "Perla",
  title: "Nimble Seamstress",
  characteristics: ["storyborn", "ally"],
  text: "Evasive\nSupport ",
  type: "character",
  abilities: [evasiveAbility, supportAbility],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amber", "emerald"],
  cost: 3,
  strength: 3,
  willpower: 2,
  illustrator: "Kapik",
  number: 32,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
