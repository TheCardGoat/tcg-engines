import type { ItemCard } from "@tcg/lorcana-types";

export const inkAmplifier: ItemCard = {
  id: "1gc",
  cardType: "item",
  name: "Ink Amplifier",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "010",
  text: "ENERGY CAPTURE Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  cardNumber: 167,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bcc3489fe6383dec57016732d9934c6102fcd605",
  },
  abilities: [
    {
      id: "1gc-1",
      type: "triggered",
      name: "ENERGY CAPTURE",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "it's the second card they've drawn this turn",
        },
        then: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
      },
      text: "ENERGY CAPTURE Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
};
