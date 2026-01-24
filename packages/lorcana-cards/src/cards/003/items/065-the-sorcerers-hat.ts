import type { ItemCard } from "@tcg/lorcana-types";

export const theSorcerersHat: ItemCard = {
  id: "1tg",
  cardType: "item",
  name: "The Sorcerer's Hat",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  text: "INCREDIBLE ENERGY {E}, 1 {I} — Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
  cost: 2,
  cardNumber: 65,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ea5687ceaf322e37471f2bad55629dd134dcd65f",
  },
  abilities: [
    {
      id: "1tg-1",
      type: "activated",
      effect: {
        type: "reveal-top-card",
        target: "CONTROLLER",
      },
      text: "INCREDIBLE ENERGY {E}, 1 {I} — Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
    },
  ],
};
