import type { ItemCard } from "@tcg/lorcana-types";

export const airfoil: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you've played 2 or more actions this turn",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      id: "1kp-1",
      text: "I GOT TO BE GOING {E} — If you've played 2 or more actions this turn, draw a card.",
      type: "activated",
    },
  ],
  cardNumber: 97,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "cc66d741f2606521d3e52b9282371857f133830f",
  },
  franchise: "Talespin",
  id: "1kp",
  inkType: ["emerald"],
  inkable: true,
  name: "Airfoil",
  set: "003",
  text: "I GOT TO BE GOING {E} — If you've played 2 or more actions this turn, draw a card.",
};
