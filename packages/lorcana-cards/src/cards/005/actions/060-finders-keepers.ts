import type { ActionCard } from "@tcg/lorcana-types";

export const findersKeepers: ActionCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 3,
        target: "CONTROLLER",
      },
      id: "q4f-1",
      text: "Draw 3 cards.",
      type: "action",
    },
  ],
  cardNumber: 60,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "5e2657fa5dbffd004f504784ce267a28e50d742c",
  },
  franchise: "Aladdin",
  id: "q4f",
  inkType: ["amethyst"],
  inkable: true,
  name: "Finders Keepers",
  set: "005",
  text: "Draw 3 cards.",
};
