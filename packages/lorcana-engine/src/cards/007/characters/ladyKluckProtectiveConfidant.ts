import {
  bodyguardAbility,
  wardAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const ladyKluckProtectiveConfidant: LorcanitoCharacterCard = {
  id: "m5f",
  name: "Lady Kluck",
  title: "Protective Confidant",
  characteristics: ["storyborn", "ally"],
  text: "Bodyguard\nWard",
  type: "character",
  abilities: [bodyguardAbility, wardAbility],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["sapphire", "steel"],
  cost: 5,
  strength: 2,
  willpower: 7,
  illustrator: "Mariana Moreno",
  number: 172,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
