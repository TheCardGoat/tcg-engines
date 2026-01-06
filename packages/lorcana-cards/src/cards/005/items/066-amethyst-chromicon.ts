import type { ItemCard } from "@tcg/lorcana-types";

export const amethystChromicon: ItemCard = {
  id: "1nk",
  cardType: "item",
  name: "Amethyst Chromicon",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "005",
  text: "AMETHYST LIGHT {E} — Each player may draw a card.",
  cost: 2,
  cardNumber: 66,
  inkable: true,
  externalIds: {
    ravensburger: "d4d96ef9fc0086b65fcb2361a63d0808cb76f94c",
  },
  abilities: [
    {
      id: "1nk-1",
      type: "activated",
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
      text: "AMETHYST LIGHT {E} — Each player may draw a card.",
    },
  ],
};
