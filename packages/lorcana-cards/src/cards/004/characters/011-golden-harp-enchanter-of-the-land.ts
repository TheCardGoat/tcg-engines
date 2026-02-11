import type { CharacterCard } from "@tcg/lorcana-types";

export const goldenHarpEnchanterOfTheLand: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you didn't play a song this turn",
        },
        then: {
          type: "banish",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      id: "1vy-1",
      text: "STOLEN AWAY At the end of your turn, if you didn't play a song this turn, banish this character.",
      type: "action",
    },
  ],
  cardNumber: 11,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "f4f450832cdc1e0cb2bf7a119554af0e031d4a98",
  },
  fullName: "Golden Harp - Enchanter of the Land",
  id: "1vy",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Golden Harp",
  set: "004",
  strength: 1,
  text: "STOLEN AWAY At the end of your turn, if you didn't play a song this turn, banish this character.",
  version: "Enchanter of the Land",
  willpower: 4,
};
