import type { ActionCard } from "@tcg/lorcana-types";

export const showMeMore: ActionCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 3,
        target: "EACH_PLAYER",
      },
      id: "11i-1",
      text: "Each player draws 3 cards.",
      type: "action",
    },
  ],
  cardNumber: 82,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "873eefb76cf90cb4ec1223e2e0418e03236723b2",
  },
  franchise: "Snow White",
  id: "11i",
  inkType: ["amethyst"],
  inkable: false,
  name: "Show Me More!",
  set: "007",
  text: "Each player draws 3 cards.",
};
