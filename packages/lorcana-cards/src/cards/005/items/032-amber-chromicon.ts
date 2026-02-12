import type { ItemCard } from "@tcg/lorcana-types";

export const amberChromicon: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "1yv-1",
      text: "AMBER LIGHT {E} — Remove up to 1 damage from each of your characters.",
      type: "activated",
    },
  ],
  cardNumber: 32,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "ff6fa7884f48d5a7efc043dc128bbb578edad508",
  },
  franchise: "Lorcana",
  id: "1yv",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Amber Chromicon",
  set: "005",
  text: "AMBER LIGHT {E} — Remove up to 1 damage from each of your characters.",
};
