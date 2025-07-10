import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const pongoDearOldDad: LorcanitoCharacterCard = {
  id: "xzn",
  name: "Pongo",
  title: "Dear Old Dad",
  characteristics: ["storyborn", "hero"],
  text: "FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.",
  type: "character",
  abilities: [
    atTheStartOfYourTurn({
      name: "FOUND YOU, YOU LITTLE RASCAL",
      text: "At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.",
      optional: true,
      effects: [
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "inkwell" },
              { filter: "characteristics", value: ["puppy"] },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amber", "sapphire"],
  cost: 6,
  strength: 5,
  willpower: 5,
  illustrator: "Cécile Carre",
  number: 29,
  set: "007",
  rarity: "super_rare",
  lore: 2,
};
