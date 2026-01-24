import type { ItemCard } from "@tcg/lorcana-types";

export const sapphireChromicon: ItemCard = {
  id: "cxg",
  cardType: "item",
  name: "Sapphire Chromicon",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "005",
  text: "POWERING UP This item enters play exerted.\nSAPPHIRE LIGHT {E}, 2 {I}, Banish one of your items — Gain 2 lore.",
  cost: 4,
  cardNumber: 168,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "2e9957576c0c2c349d09a69356f9ee57db0b41c7",
  },
  abilities: [
    {
      id: "cxg-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      name: "POWERING UP",
      text: "POWERING UP This item enters play exerted.",
    },
    {
      id: "cxg-2",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "SAPPHIRE LIGHT {E}, 2 {I}, Banish one of your items — Gain 2 lore.",
    },
  ],
};
