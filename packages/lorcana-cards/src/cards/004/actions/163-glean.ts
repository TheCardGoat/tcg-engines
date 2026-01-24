import type { ActionCard } from "@tcg/lorcana-types";

export const glean: ActionCard = {
  id: "wm3",
  cardType: "action",
  name: "Glean",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "Banish chosen item. Its player gains 2 lore.",
  cost: 1,
  cardNumber: 163,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "758b111d188a6788401552ca32e2c72ad9d31998",
  },
  abilities: [
    {
      id: "wm3-1",
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
      text: "Banish chosen item. Its player gains 2 lore.",
    },
  ],
};
