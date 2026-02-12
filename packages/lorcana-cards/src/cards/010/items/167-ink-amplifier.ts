import type { ItemCard } from "@tcg/lorcana-types";

export const inkAmplifier: ItemCard = {
  abilities: [
    {
      effect: {
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
        type: "conditional",
      },
      id: "1gc-1",
      name: "ENERGY CAPTURE",
      text: "ENERGY CAPTURE Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 167,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "bcc3489fe6383dec57016732d9934c6102fcd605",
  },
  franchise: "Lorcana",
  id: "1gc",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Ink Amplifier",
  set: "010",
  text: "ENERGY CAPTURE Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
};
