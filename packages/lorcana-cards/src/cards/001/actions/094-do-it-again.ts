import type { ActionCard } from "@tcg/lorcana-types";

export const doItAgain: ActionCard = {
  id: "8s5",
  cardType: "action",
  name: "Do It Again!",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "001",
  text: "Return an action card from your discard to your hand.",
  cost: 3,
  cardNumber: 94,
  inkable: false,
  externalIds: {
    ravensburger: "1fa692d71466897743f12f7dbceee65c69c5d6a5",
  },
  abilities: [
    {
      id: "8s5-1",
      text: "Return an action card from your discard to your hand.",
      type: "action",
      effect: {
        type: "return-from-discard",
        cardType: "action",
        target: "CONTROLLER",
      },
    },
  ],
};
