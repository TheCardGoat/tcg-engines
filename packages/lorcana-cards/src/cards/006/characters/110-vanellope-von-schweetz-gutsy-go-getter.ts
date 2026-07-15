import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzGutsyGogetter: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "this character is at a location",
          type: "if",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "ypp-1",
      text: "AS READY AS I'LL EVER BE At the start of your turn, if this character is at a location, draw a card and gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 110,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess", "Racer"],
  cost: 3,
  externalIds: {
    ravensburger: "7d1cddbc896d563c2bd0ab7099bc2f9a464d85cc",
  },
  franchise: "Wreck It Ralph",
  fullName: "Vanellope Von Schweetz - Gutsy Go-Getter",
  id: "ypp",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Vanellope Von Schweetz",
  set: "006",
  strength: 2,
  text: "AS READY AS I'LL EVER BE At the start of your turn, if this character is at a location, draw a card and gain 1 lore.",
  version: "Gutsy Go-Getter",
  willpower: 3,
};
