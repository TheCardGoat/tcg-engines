import type { LocationCard } from "@tcg/lorcana-types";

export const theBayouMysteriousSwamp: LocationCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          chosen: true,
          target: "CONTROLLER",
          type: "discard",
        },
        type: "optional",
      },
      id: "2bw-1",
      name: "SHOW ME THE WAY",
      text: "SHOW ME THE WAY Whenever a character quests while here, you may draw a card, then choose and discard a card.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 204,
  cardType: "location",
  cost: 1,
  externalIds: {
    ravensburger: "0866169143a67960533bef9ce3153b052defaa05",
  },
  franchise: "Princess and the Frog",
  fullName: "The Bayou - Mysterious Swamp",
  id: "2bw",
  inkType: ["steel"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "The Bayou",
  set: "003",
  text: "SHOW ME THE WAY Whenever a character quests while here, you may draw a card, then choose and discard a card.",
  version: "Mysterious Swamp",
};
