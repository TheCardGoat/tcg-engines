import type { ActionCard } from "@tcg/lorcana-types";

export const findersKeepers: ActionCard = {
  id: "q4f",
  cardType: "action",
  name: "Finders Keepers",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  text: "Draw 3 cards.",
  cost: 5,
  cardNumber: 60,
  inkable: true,
  externalIds: {
    ravensburger: "5e2657fa5dbffd004f504784ce267a28e50d742c",
  },
  abilities: [
    {
      id: "q4f-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 3,
        target: "CONTROLLER",
      },
    },
  ],
};
