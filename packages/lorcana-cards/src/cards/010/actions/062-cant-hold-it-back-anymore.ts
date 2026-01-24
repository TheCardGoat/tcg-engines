import type { ActionCard } from "@tcg/lorcana-types";

export const cantHoldItBackAnymore: ActionCard = {
  id: "1ry",
  cardType: "action",
  name: "Can't Hold It Back Anymore",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "010",
  text: "Exert chosen opposing character. Move all damage counters from all other characters to that character.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 62,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e68e3ed8d5077f0403fa94bae8428fa62dd34f26",
  },
  abilities: [
    {
      id: "1ry-1",
      type: "action",
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Exert chosen opposing character. Move all damage counters from all other characters to that character.",
    },
  ],
};
