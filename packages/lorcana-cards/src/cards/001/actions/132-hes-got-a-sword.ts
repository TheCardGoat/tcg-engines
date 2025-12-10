import type { ActionCard } from "@tcg/lorcana";

export const hesGotASword: ActionCard = {
  id: "1hz",
  cardType: "action",
  name: "He's Got a Sword!",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "001",
  text: "Chosen character gets +2 {S} this turn.",
  cost: 1,
  cardNumber: 132,
  inkable: true,
  externalIds: {
    ravensburger: "c286fc16a13143ed3d347c25f5f85877a90a8bd5",
  },
  abilities: [
    {
      id: "1hz-1",
      text: "Chosen character gets +2 {S} this turn.",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
        duration: "turn",
      },
    },
  ],
};
