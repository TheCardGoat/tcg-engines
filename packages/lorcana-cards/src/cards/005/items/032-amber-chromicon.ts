import type { ItemCard } from "@tcg/lorcana-types";

export const amberChromicon: ItemCard = {
  id: "1yv",
  cardType: "item",
  name: "Amber Chromicon",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "005",
  text: "AMBER LIGHT {E} — Remove up to 1 damage from each of your characters.",
  cost: 2,
  cardNumber: 32,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ff6fa7884f48d5a7efc043dc128bbb578edad508",
  },
  abilities: [
    {
      id: "1yv-1",
      type: "activated",
      effect: {
        type: "remove-damage",
        amount: 1,
        upTo: true,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "AMBER LIGHT {E} — Remove up to 1 damage from each of your characters.",
    },
  ],
};
