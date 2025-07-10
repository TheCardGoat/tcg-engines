import {
  bodyguardAbility,
  resistAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const tukTukDisarminglyCute: LorcanitoCharacterCard = {
  id: "v8s",
  name: "Tuk Tuk",
  title: "Disarmingly Cute",
  characteristics: ["storyborn", "ally"],
  text: "Bodyguard\nResist +2",
  type: "character",
  abilities: [bodyguardAbility, resistAbility(2)],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  strength: 0,
  willpower: 1,
  illustrator: "Maria Dresden",
  number: 187,
  set: "007",
  rarity: "rare",
  lore: 1,
};
