import type { ItemCard } from "@tcg/lorcana-types";

export const drFaciliersCards: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "action",
        target: "CONTROLLER",
        duration: "next-play-this-turn",
      },
      id: "18f-1",
      name: "THE CARDS WILL TELL",
      text: "THE CARDS WILL TELL {E} — You pay 1 {I} less for the next action you play this turn.",
      type: "activated",
    },
  ],
  cardNumber: 101,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "9ed2b53642b3c2e3a044510d81777c87acd0b5f3",
  },
  franchise: "Princess and the Frog",
  id: "18f",
  inkType: ["emerald"],
  inkable: false,
  name: "Dr. Facilier’s Cards",
  set: "001",
  text: "THE CARDS WILL TELL {E} — You pay 1 {I} less for the next action you play this turn.",
};
