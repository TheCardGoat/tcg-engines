import type { ItemCard } from "@tcg/lorcana-types";

export const halfHexwellCrown: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "1fp-1",
      text: "AN UNEXPECTED FIND {E}, 2 {I} — Draw a card.",
      type: "activated",
    },
  ],
  cardNumber: 65,
  cardType: "item",
  cost: 6,
  externalIds: {
    ravensburger: "b811b3defd86d738200c72437085b562903d888b",
  },
  franchise: "Lorcana",
  id: "1fp",
  inkType: ["amethyst"],
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  name: "Half Hexwell Crown",
  set: "005",
  text: "AN UNEXPECTED FIND {E}, 2 {I} — Draw a card.\nA PERILOUS POWER {E}, 2 {I}, Discard a card — Exert chosen character.",
};
