import type { ItemCard } from "@tcg/lorcana-types";

export const sapphireChromicon: ItemCard = {
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "cxg-1",
      name: "POWERING UP",
      text: "POWERING UP This item enters play exerted.",
      type: "static",
    },
    {
      cost: { exert: true },
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "cxg-2",
      text: "SAPPHIRE LIGHT {E}, 2 {I}, Banish one of your items — Gain 2 lore.",
      type: "activated",
    },
  ],
  cardNumber: 168,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "2e9957576c0c2c349d09a69356f9ee57db0b41c7",
  },
  franchise: "Lorcana",
  id: "cxg",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Sapphire Chromicon",
  set: "005",
  text: "POWERING UP This item enters play exerted.\nSAPPHIRE LIGHT {E}, 2 {I}, Banish one of your items — Gain 2 lore.",
};
