import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const candleheadDedicatedRacer: LorcanitoCharacterCard = {
  id: "rqj",
  name: "Candlehead",
  title: "Dedicated Racer",
  characteristics: ["storyborn", "ally", "racer"],
  text: "WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "WINNING ISN'T EVERYTHING",
      text: "When this character is banished, you may remove up to 2 damage from chosen character.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Xapik",
  number: 17,
  set: "007",
  rarity: "common",
  lore: 1,
};
