import type { ItemCard } from "@tcg/lorcana-types";

export const airfoil: ItemCard = {
  id: "1kp",
  cardType: "item",
  name: "Airfoil",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "003",
  text: "I GOT TO BE GOING {E} — If you've played 2 or more actions this turn, draw a card.",
  cost: 2,
  cardNumber: 97,
  inkable: true,
  externalIds: {
    ravensburger: "cc66d741f2606521d3e52b9282371857f133830f",
  },
  abilities: [
    {
      id: "1kp-1",
      type: "activated",
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
    },
  ],
};
