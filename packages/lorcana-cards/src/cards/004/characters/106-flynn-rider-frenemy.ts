import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderFrenemy: CharacterCard = {
  abilities: [
    {
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
      id: "2t5-1",
      text: "NARROW ADVANTAGE At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
      type: "action",
    },
  ],
  cardNumber: 106,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 2,
  externalIds: {
    ravensburger: "0a20b1d4aed57d1908ea2d27b2a70c90e2ff9be8",
  },
  franchise: "Tangled",
  fullName: "Flynn Rider - Frenemy",
  id: "2t5",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Flynn Rider",
  set: "004",
  strength: 2,
  text: "NARROW ADVANTAGE At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
  version: "Frenemy",
  willpower: 2,
};
