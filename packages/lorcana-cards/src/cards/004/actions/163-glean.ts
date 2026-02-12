import type { ActionCard } from "@tcg/lorcana-types";

export const glean: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["item"],
        },
        type: "banish",
      },
      id: "wm3-1",
      text: "Banish chosen item. Its player gains 2 lore.",
      type: "action",
    },
  ],
  cardNumber: 163,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "758b111d188a6788401552ca32e2c72ad9d31998",
  },
  franchise: "Beauty and the Beast",
  id: "wm3",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Glean",
  set: "004",
  text: "Banish chosen item. Its player gains 2 lore.",
};
