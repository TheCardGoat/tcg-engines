import type { ItemCard } from "@tcg/lorcana-types";

export const theSorcerersHat: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        target: "CONTROLLER",
        type: "reveal-top-card",
      },
      id: "1tg-1",
      text: "INCREDIBLE ENERGY {E}, 1 {I} — Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
      type: "activated",
    },
  ],
  cardNumber: 65,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "ea5687ceaf322e37471f2bad55629dd134dcd65f",
  },
  franchise: "Fantasia",
  id: "1tg",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "The Sorcerer's Hat",
  set: "003",
  text: "INCREDIBLE ENERGY {E}, 1 {I} — Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
};
