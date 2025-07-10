import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const robinHoodEyeForDetail: LorcanitoCharacterCard = {
  id: "fz9",
  name: "Robin Hood",
  title: "Eye for Detail",
  characteristics: ["storyborn", "hero"],
  text: "Support",
  type: "character",
  abilities: [supportAbility],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "Mariana Moreno",
  number: 170,
  set: "007",
  rarity: "common",
  lore: 1,
};
