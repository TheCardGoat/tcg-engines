import type { ItemCard } from "@tcg/lorcana-types";

export const scrump: ItemCard = {
  id: "88v",
  cardType: "item",
  name: "Scrump",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.",
  cost: 2,
  cardNumber: 33,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1db87a0f3feb2b0a4a3818b87f46013e9c354cd8",
  },
  abilities: [
    {
      id: "88v-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "YOUR_CHARACTERS",
      },
      text: "I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.",
    },
  ],
};
