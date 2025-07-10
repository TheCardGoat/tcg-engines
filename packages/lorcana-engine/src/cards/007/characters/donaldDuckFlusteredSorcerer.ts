import { metaAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const donaldDuckFlusteredSorcerer: LorcanitoCharacterCard = {
  id: "evp",
  name: "Donald Duck",
  title: "Flustered Sorcerer",
  characteristics: ["dreamborn", "ally", "sorcerer"],
  text: "OBFUSCATE! Opponents need 25 lore to win the game.",
  type: "character",
  abilities: [
    metaAbility({
      name: "OBFUSCATE!",
      text: "Opponents need 25 lore to win the game.",
    }),
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 7,
  strength: 5,
  willpower: 6,
  illustrator: "Eric Weik",
  number: 73,
  set: "007",
  rarity: "legendary",
  lore: 3,
};
