import type { ItemCard } from "@tcg/lorcana-types";

export const halfHexwellCrown: ItemCard = {
  id: "1fp",
  cardType: "item",
  name: "Half Hexwell Crown",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "005",
  text: "AN UNEXPECTED FIND {E}, 2 {I} — Draw a card.\nA PERILOUS POWER {E}, 2 {I}, Discard a card — Exert chosen character.",
  cost: 6,
  cardNumber: 65,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b811b3defd86d738200c72437085b562903d888b",
  },
  abilities: [
    {
      id: "1fp-1",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "AN UNEXPECTED FIND {E}, 2 {I} — Draw a card.",
    },
  ],
};
