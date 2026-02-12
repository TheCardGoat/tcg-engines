import type { ItemCard } from "@tcg/lorcana-types";

export const amethystChromicon: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "EACH_PLAYER",
        type: "draw",
      },
      id: "1nk-1",
      text: "AMETHYST LIGHT {E} — Each player may draw a card.",
      type: "activated",
    },
  ],
  cardNumber: 66,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "d4d96ef9fc0086b65fcb2361a63d0808cb76f94c",
  },
  franchise: "Lorcana",
  id: "1nk",
  inkType: ["amethyst"],
  inkable: true,
  name: "Amethyst Chromicon",
  set: "005",
  text: "AMETHYST LIGHT {E} — Each player may draw a card.",
};
