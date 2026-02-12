import type { ItemCard } from "@tcg/lorcana-types";

export const scrump: ItemCard = {
  abilities: [
    {
      effect: {
        modifier: -2,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "88v-1",
      text: "I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.",
      type: "action",
    },
  ],
  cardNumber: 33,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "1db87a0f3feb2b0a4a3818b87f46013e9c354cd8",
  },
  franchise: "Lilo and Stitch",
  id: "88v",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Scrump",
  set: "006",
  text: "I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.",
};
