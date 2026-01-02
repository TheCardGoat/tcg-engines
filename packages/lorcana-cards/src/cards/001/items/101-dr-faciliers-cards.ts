import type { ItemCard } from "@tcg/lorcana-types";

export const drFaciliersCards: ItemCard = {
  id: "18f",
  cardType: "item",
  name: "Dr. Facilier’s Cards",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "001",
  text: "THE CARDS WILL TELL {E} — You pay 1 {I} less for the next action you play this turn.",
  cost: 2,
  cardNumber: 101,
  inkable: false,
  externalIds: {
    ravensburger: "9ed2b53642b3c2e3a044510d81777c87acd0b5f3",
  },
  abilities: [
    {
      id: "18f-1",
      text: "THE CARDS WILL TELL {E} — You pay 1 {I} less for the next action you play this turn.",
      name: "THE CARDS WILL TELL",
      type: "activated",
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
    },
  ],
};
