import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderFrenemy: CharacterCard = {
  id: "2t5",
  cardType: "character",
  name: "Flynn Rider",
  version: "Frenemy",
  fullName: "Flynn Rider - Frenemy",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "004",
  text: "NARROW ADVANTAGE At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 106,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0a20b1d4aed57d1908ea2d27b2a70c90e2ff9be8",
  },
  abilities: [
    {
      id: "2t5-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression:
            "you have a character in play with more {S} than each opposing character",
        },
        then: {
          type: "gain-lore",
          amount: 3,
        },
      },
      text: "NARROW ADVANTAGE At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
