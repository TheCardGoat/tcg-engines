import type { ItemCard } from "@tcg/lorcana-types";

export const baymaxsChargingStation: ItemCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you used Shift to play them",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "zom-1",
      name: "ENERGY CONVERTER",
      text: "ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 180,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "809b5752ee2de600186f4bd616bff5e0ec7a1806",
  },
  franchise: "Big Hero 6",
  id: "zom",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Baymax's Charging Station",
  set: "007",
  text: "ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
};
