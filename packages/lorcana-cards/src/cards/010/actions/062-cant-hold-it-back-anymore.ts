import type { ActionCard } from "@tcg/lorcana-types";

export const cantHoldItBackAnymore: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "exert",
      },
      id: "1ry-1",
      text: "Exert chosen opposing character. Move all damage counters from all other characters to that character.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 62,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "e68e3ed8d5077f0403fa94bae8428fa62dd34f26",
  },
  franchise: "Frozen",
  id: "1ry",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Can't Hold It Back Anymore",
  set: "010",
  text: "Exert chosen opposing character. Move all damage counters from all other characters to that character.",
};
