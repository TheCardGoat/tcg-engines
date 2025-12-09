import type { ItemCard } from "@tcg/lorcana";

export const baymaxsChargingStation: ItemCard = {
  id: "zom",
  cardType: "item",
  name: "Baymax's Charging Station",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  text: "ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
  cost: 3,
  cardNumber: 180,
  inkable: true,
  externalIds: {
    ravensburger: "809b5752ee2de600186f4bd616bff5e0ec7a1806",
  },
  abilities: [
    {
      id: "zom-1",
      text: "ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
      name: "ENERGY CONVERTER",
      type: "triggered",
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
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
};
