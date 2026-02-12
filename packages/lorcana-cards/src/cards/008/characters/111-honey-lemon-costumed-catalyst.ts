import type { CharacterCard } from "@tcg/lorcana-types";

export const honeyLemonCostumedCatalyst: CharacterCard = {
  abilities: [
    {
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
      id: "1h9-1",
      name: "LET'S DO THIS!",
      text: "LET'S DO THIS! Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 111,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Inventor"],
  cost: 4,
  externalIds: {
    ravensburger: "c001c7ba8f36751f50f1faa854d4d3a307a0e02c",
  },
  franchise: "Big Hero 6",
  fullName: "Honey Lemon - Costumed Catalyst",
  id: "1h9",
  inkType: ["emerald", "sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Honey Lemon",
  set: "008",
  strength: 3,
  text: "LET'S DO THIS! Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.",
  version: "Costumed Catalyst",
  willpower: 3,
};
