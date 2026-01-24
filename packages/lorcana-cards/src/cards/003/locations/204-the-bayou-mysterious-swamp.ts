import type { LocationCard } from "@tcg/lorcana-types";

export const theBayouMysteriousSwamp: LocationCard = {
  id: "2bw",
  cardType: "location",
  name: "The Bayou",
  version: "Mysterious Swamp",
  fullName: "The Bayou - Mysterious Swamp",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "003",
  text: "SHOW ME THE WAY Whenever a character quests while here, you may draw a card, then choose and discard a card.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 204,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0866169143a67960533bef9ce3153b052defaa05",
  },
  abilities: [
    {
      id: "2bw-1",
      type: "triggered",
      name: "SHOW ME THE WAY",
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      text: "SHOW ME THE WAY Whenever a character quests while here, you may draw a card, then choose and discard a card.",
    },
  ],
};
