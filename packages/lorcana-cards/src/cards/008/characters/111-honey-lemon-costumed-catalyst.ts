import type { CharacterCard } from "@tcg/lorcana-types";

export const honeyLemonCostumedCatalyst: CharacterCard = {
  id: "1h9",
  cardType: "character",
  name: "Honey Lemon",
  version: "Costumed Catalyst",
  fullName: "Honey Lemon - Costumed Catalyst",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "008",
  text: "LET'S DO THIS! Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 111,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c001c7ba8f36751f50f1faa854d4d3a307a0e02c",
  },
  abilities: [
    {
      id: "1h9-1",
      type: "triggered",
      name: "LET'S DO THIS!",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you used Shift to play them",
        },
        then: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "LET'S DO THIS! Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
};
